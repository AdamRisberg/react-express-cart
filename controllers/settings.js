const fs = require("fs");
const { promisify } = require("util");
const formidable = require("formidable");
const sharp = require("sharp");
const path = require("path");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(require("fs").unlink);

function get(req, res) {
  readFile("./settings/settings.json", "utf8")
    .then(file => res.json(JSON.parse(file)))
    .catch(err => copyDefaults(req, res, get));
}

function getGeneral(req, res) {
  readFile("./settings/settings.json", "utf8")
    .then(file => {
      const settings = JSON.parse(file);
      return res.json(settings.general);
    })
    .catch(err => copyDefaults(req, res, getGeneral));
}

function copyDefaults(req, res, callback) {
  readFile("./settings/settingsDefault.json", "utf8")
    .then(file => writeSettings(file))
    .then(() => callback(req, res))
    .catch(() => res.json(null));
}

function writeSettings(settings) {
  return writeFile("./settings/settings.json", settings).then(() => settings);
}

function update(req, res) {
  writeFile("./settings/settings.json", JSON.stringify(req.body))
    .then(() => res.json(true))
    .catch(() => res.json(false));
}

function addImage(req, res) {
  const imgLocation = req.query.location;

  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req);

  sharp.cache(true);
  let filePath, fileName, fileExt, imagePath;

  form.on("fileBegin", (name, file) => {
    filePath = `./public/images/${imgLocation}/`;
    fileExt = path.extname(file.name);
    fileName = file.name.substring(0, file.name.length - fileExt.length);
    imagePath = `${filePath}${fileName}${fileExt}`;
    file.path = imagePath;
  });

  form.on("end", (name, file) => {
    const destPathMedium = `${filePath}medium/${fileName}${fileExt}`;
    const destPathSmall = `${filePath}small/${fileName}${fileExt}`;

    Promise.all([
      resizeImage(imagePath, destPathMedium, null, 40),
      resizeImage(imagePath, destPathSmall, null, 67)
    ])
      .then(() => readFile("./settings/settings.json", "utf8"))
      .then(file => {
        sharp.cache(false);

        const settings = JSON.parse(file);
        settings.general.brand_image = `${fileName}${fileExt}`;

        return writeSettings(JSON.stringify(settings));
      })
      .then(settings => res.json(JSON.parse(settings)))
      .catch(err => {
        console.log(err);
      });
  });

  form.on("error", err => {
    console.log(err);
  });
}

function resizeImage(imagePath, destinationPath, width, height) {
  return sharp(imagePath)
    .resize({ width, height })
    .toFile(destinationPath);
}

function deleteImage(req, res) {
  const imgLocation = req.query.location;
  const fileName = req.query.file;

  const largePath = `./public/images/${imgLocation}/${fileName}`;
  const mediumPath = `./public/images/${imgLocation}/medium/${fileName}`;
  const smallPath = `./public/images/${imgLocation}/small/${fileName}`;

  readFile("./settings/settings.json", "utf8")
    .then(file => {
      const settings = JSON.parse(file);
      settings.general.brand_image = "";

      return writeSettings(JSON.stringify(settings));
    })
    .then(settings => res.json(JSON.parse(settings)))
    .then(() => {
      return Promise.all([
        unlink(largePath),
        unlink(mediumPath),
        unlink(smallPath)
      ]);
    })
    .catch(err => console.log(err));
}

module.exports = {
  get,
  update,
  addImage,
  deleteImage,
  getGeneral
};
