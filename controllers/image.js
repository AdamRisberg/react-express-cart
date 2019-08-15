const formidable = require("formidable");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);

function upload(req, res) {
  const imgLocation = req.query.location;

  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req);

  let filePath, fileName, fileExt, imagePath;

  form.on("fileBegin", (name, file) => {
    filePath = `./client/src/images/${imgLocation}/`;
    fileExt = path.extname(file.name);
    fileName = file.name.substring(0, file.name.length - fileExt.length);
    imagePath = `${filePath}${fileName}${fileExt}`;

    file.path = imagePath;
  });

  form.on("end", (name, file) => {
    const destPathMedium = `${filePath}medium/${fileName}${fileExt}`;
    const destPathSmall = `${filePath}small/${fileName}${fileExt}`;

    Promise.all([
      resizeImage(imagePath, destPathMedium, 400),
      resizeImage(imagePath, destPathSmall, 100)
    ])
      .then(_ => {
        res.json({ success: true });
      })
      .catch(err => {
        console.log(err);
      });
  });

  form.on("error", err => {
    console.log(err);
  });
}

function resizeImage(imagePath, destinationPath, width) {
  return sharp(imagePath)
    .resize({ width })
    .toFile(destinationPath);
}

function getImages(req, res) {
  const imgLocation = req.query.location;
  const filePath = `./client/src/images/${imgLocation}/`;

  readdir(filePath)
    .then(files => files.filter(file => !!path.extname(file)))
    .then(files => res.json(files))
    .catch(console.log);
}

module.exports = {
  upload,
  getImages
};
