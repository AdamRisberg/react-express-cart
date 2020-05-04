const path = require("path");
const fs = require("fs-extra");
const extract = require("extract-zip");
const formidable = require("formidable");
const del = require("del");
const archiver = require("archiver");
const backup = require("mongodb-backup");
const restore = require("mongodb-restore");

function backupDatabase(mongoUri, backupDir) {
  return new Promise((resolve, reject) => {
    backup({
      uri: mongoUri,
      root: backupDir,
      callback: function (err) {
        err ? reject(err) : resolve();
      }
    });
  });
}

function restoreDatabase(mongoUri, backupDir) {
  return new Promise((resolve, reject) => {
    restore({
      uri: mongoUri,
      root: backupDir,
      drop: true,
      callback: function (err) {
        err ? reject(err) : resolve();
      }
    });
  });
}

function getDatabaseName(uri) {
  const lastSlash = uri.lastIndexOf("/");
  return uri.slice(lastSlash + 1);
}

function writeBackupFile(outputPath, dbPath, dbName, imagesPath) {
  const output = fs.createWriteStream(outputPath);
  const archive = archiver("zip");

  return new Promise((resolve, reject) => {
    output.on("close", resolve);
    output.on("error", reject);

    archive.pipe(output);
    archive.directory(dbPath, dbName);
    archive.directory(imagesPath, "images");
    archive.finalize();
  });
}

function saveBackupFromForm(req, zipFilePath) {
  const form = new formidable.IncomingForm();

  return new Promise((resolve, reject) => {
    form
      .parse(req, resolve)
      .on("fileBegin", (name, file) => {
        file.path = zipFilePath;
      })
      .on("error", reject);
  });
}

function deleteBackups() {
  const backupDirPath = path.resolve(__dirname, "..", "backup");

  return del([backupDirPath], {
    expandDirectories: true
  });
}

function deleteCurrentImages(imagesPath) {
  return del([imagesPath, "!**/no-image.jpg"], {
    expandDirectories: {
      files: ["*.jpg", "*.jpeg", "*.png"]
    }
  });
}

function get(req, res) {
  const mongoUri = process.env.MONGO_URI;
  const dbName = getDatabaseName(mongoUri);
  const outputPath = path.resolve(__dirname, "..", "backup");
  const zipOutputPath = outputPath + "/backup.zip";
  const dbPath = `${outputPath}/${dbName}`;
  const imagesPath = path.resolve(__dirname, "..", "public", "images");

  backupDatabase(mongoUri, outputPath)
    .then(() => {
      return writeBackupFile(zipOutputPath, dbPath, dbName, imagesPath);
    })
    .then(() => {
      res.sendFile(zipOutputPath);
    })
    .then(() => {
      return deleteBackups();
    })
    .catch(err => {
      console.log(err);
      res.status(500).send();
    });
}

function post(req, res) {
  const mongoUri = process.env.MONGO_URI;
  const dbName = getDatabaseName(mongoUri);

  const backupDirPath = path.resolve(__dirname, "..", "backup");
  const zipFilePath = backupDirPath + "/backup.zip";
  const backupImagesPath = backupDirPath + "/images";
  const imagesPath = path.resolve(__dirname, "..", "public", "images");

  saveBackupFromForm(req, zipFilePath)
    .then(() => {
      return extract(zipFilePath, {
        dir: backupDirPath
      });
    })
    .then(() => {
      // Delete current images
      return deleteCurrentImages(imagesPath);
    })
    .then(() => {
      // restore images from backup
      return fs.copy(backupImagesPath, imagesPath);
    })
    .then(() => {
      // restore database
      return restoreDatabase(mongoUri, `${backupDirPath}/${dbName}`);
    })
    .then(() => {
      // delete backup files
      return deleteBackups();
    })
    .then(() => {
      res.send();
    })
    .catch(err => {
      console.log(err);
      res.status(500).send();
    });
}

module.exports = {
  get,
  post
};
