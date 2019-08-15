const formidable = require("formidable");
const sharp = require("sharp");
const path = require("path");
const Product = require("../models/product");
const { promisify } = require("util");
const unlink = promisify(require("fs").unlink);

function getFeatured(req, res) {
  const page = req.query.page;

  Product.paginate(
    { featured: true },
    { page: page, limit: 12, sort: "name" }
  ).then(results => {
    res.json({ items: results.docs, pages: results.pages });
  });
}

function getAll(req, res) {
  const queryObj = {};
  if (req.query.category) {
    queryObj.category = req.query.category;
  }
  if (req.query.search) {
    queryObj.name = new RegExp(`.*${req.query.search}.*`, "i");
  }

  Product.paginate(queryObj, { page: req.query.page, limit: 12 })
    .then(results => {
      res.json({ items: results.docs, pages: results.pages });
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Could not retrieve products");
    });
}

function getByCategory(req, res) {
  const queryObj = {};
  if (req.query.category) {
    queryObj.$or = [
      { category: req.query.category },
      { path: new RegExp(`^${req.query.path}`) }
    ];
  }
  if (req.query.search) {
    queryObj.name = new RegExp(`.*${req.query.search}.*`, "i");
  }

  Product.paginate(queryObj, {
    page: req.query.page,
    limit: 12,
    sort: "field path"
  })
    .then(results => {
      res.json({ items: results.docs, pages: results.pages });
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Could not retrieve products");
    });
}

function getOne(req, res) {
  Product.findById(req.params.id)
    .then(product => {
      if (!product) {
        throw new Error("Unable to find product");
      }
      const optionsObj = {};
      const options = product.options;

      options.forEach(option => {
        if (option.options.length) {
          let defaultIdx = option.options.reduce(
            (acc, el, i) => (el.default ? i : acc),
            0
          );

          optionsObj[option._id] = {
            price: option.options[defaultIdx].price,
            value: option.options[defaultIdx].label,
            name: option.label
          };
        } else {
          optionsObj[option._id] = {
            price: option.price,
            value: "",
            name: option.label
          };
        }
      });

      res.json({ product, options: optionsObj });
    })
    .catch(err => {
      console.log(err);
      res.json(false);
    });
}

function update(req, res) {
  const productID = req.body._id;
  delete req.body._id;

  Product.findByIdAndUpdate(productID, req.body, { new: true })
    .then(updatedProduct => {
      res.json(updatedProduct);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Could not save changes");
    });
}

function insert(req, res) {
  const product = new Product(req.body);

  product
    .save()
    .then(savedProduct => {
      res.json(savedProduct._id);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Could not save product");
    });
}

function addImage(req, res) {
  const productID = req.params.id;
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
      resizeImage(imagePath, destPathMedium, 400),
      resizeImage(imagePath, destPathSmall, 100)
    ])
      .then(() => Product.findById(productID))
      .then(product => {
        product.images.push({
          src: `${fileName}${fileExt}`,
          alt: `${product.name} ${product.images.length + 1}`
        });
        return product.save();
      })
      .then(savedProduct => {
        sharp.cache(false);
        res.json(savedProduct);
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

function deleteImage(req, res) {
  const productID = req.params.id;
  const imgLocation = req.query.location;
  const fileName = req.query.file;

  const largePath = `./public/images/${imgLocation}/${fileName}`;
  const mediumPath = `./public/images/${imgLocation}/medium/${fileName}`;
  const smallPath = `./public/images/${imgLocation}/small/${fileName}`;

  Product.findByIdAndUpdate(
    productID,
    { $pull: { images: { src: fileName } } },
    { new: true }
  )
    .then(updatedProduct => res.json(updatedProduct))
    .catch(err => {
      console.log(err);
      res.status(400).send("Could not delete image.");
      throw new Error("Failed to update product");
    })
    .then(() => {
      return Promise.all([
        unlink(largePath),
        unlink(mediumPath),
        unlink(smallPath)
      ]);
    })
    .catch(err => console.log(err));
}

function deleteProducts(req, res) {
  const productIDs = req.body;
  const images = [];

  Product.find({ _id: { $in: productIDs } })
    .then(results => {
      results.forEach(product => {
        product.images.forEach(image => {
          images.push(image.src);
        });
      });
    })
    .then(() => Product.deleteMany({ _id: { $in: productIDs } }))
    .then(_ => {
      res.json({ success: true });
    })
    .then(() => {
      const promises = [];
      images.forEach(image => {
        const largePath = `./public/images/products/${image}`;
        const mediumPath = `./public/images/products/medium/${image}`;
        const smallPath = `./public/images/products/small/${image}`;
        promises.push(unlink(largePath), unlink(mediumPath), unlink(smallPath));
      });
      return Promise.all(promises);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Unable to delete");
    });
}

module.exports = {
  getAll,
  getFeatured,
  getOne,
  getByCategory,
  update,
  addImage,
  deleteImage,
  insert,
  deleteProducts
};
