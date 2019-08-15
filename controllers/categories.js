const Category = require("../models/category");
const formidable = require("formidable");
const sharp = require("sharp");
const path = require("path");
const { promisify } = require("util");
const unlink = promisify(require("fs").unlink);

function getAll(req, res) {
  getAllCategories()
    .then(results => res.json(results))
    .catch(console.log);
}

function getAllCategories() {
  return Category.find({ topLevel: true }).sort({ order: 1, _id: 1 });
}

function remove(req, res) {
  const categoryIDs = req.body;
  const images = [];

  Category.find({ _id: { $in: categoryIDs } })
    .then(results => {
      results.forEach(cat => {
        if (cat.image) {
          images.push(cat.image);
        }
      });
    })
    .then(() => Category.deleteMany({ _id: { $in: categoryIDs } }))
    .then(() =>
      Category.updateMany(
        {},
        { $pull: { subcategories: { $in: categoryIDs } } }
      )
    )
    .then(() => Category.find({ parent: { $in: categoryIDs } }))
    .then(children => {
      return asyncForEach(children, async child => {
        child.path = child.pathName;
        child.parent = "";
        child.topLevel = true;
        await child.save();

        removeDeletedPathFromChidren(child.path + "/", child.id, child);
      });
    })
    .then(() => getAllCategories())
    .then(results => res.json(results))
    .then(() => {
      const promises = [];
      images.forEach(image => {
        const largePath = `./public/images/categories/${image}`;
        const mediumPath = `./public/images/categories/medium/${image}`;
        const smallPath = `./public/images/categories/small/${image}`;
        promises.push(unlink(largePath), unlink(mediumPath), unlink(smallPath));
      });
      return Promise.all(promises);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Unable to delete");
    });
}

function removeDeletedPathFromChidren(parentPath, parentID, category) {
  asyncForEach(category.subcategories, async cat => {
    cat.path = parentPath + cat.pathName;
    cat.parent = parentID;
    cat.topLevel = true;
    await cat.save();
    removeDeletedPathFromChidren(cat.path + "/", cat.id, cat);
  });
}

function getOne(req, res) {
  Category.findById(req.params.id)
    .then(cat => res.json(cat))
    .catch(err => {
      console.log(err.message);
      res.status(400).send("Error retrieving category");
    });
}

function update(req, res) {
  const category = req.body.category;
  let foundCategory;

  Category.findById(req.params.id)
    .then(_category => {
      foundCategory = _category;
      if (category.parent !== foundCategory.parent) {
        return swapParents(foundCategory.parent, category.parent, category._id);
      }
    })
    .then(() => {
      if (category.path !== foundCategory.path) {
        return adjustChildPaths(
          foundCategory.path,
          category.path,
          foundCategory
        );
      }
    })
    .then(() => {
      foundCategory.name = category.name;
      foundCategory.path = category.path;
      foundCategory.pathName = category.pathName;
      foundCategory.image = category.image;
      foundCategory.topLevel = category.topLevel;
      foundCategory.parent = category.parent;
      foundCategory.metaDescription = category.metaDescription;
      foundCategory.order = category.order;
      return foundCategory.save();
    })
    .then(() => getAllCategories())
    .then(results => res.json(results))
    .catch(err => {
      console.log(err);
      res.status(400).send("Unable to save changes.");
    });
}

async function asyncForEach(array, cb) {
  for (let i = 0; i < array.length; i++) {
    await cb(array[i], i, array);
  }
}

function adjustChildPaths(oldPath, newPath, category) {
  const oldLength = oldPath.length;

  return asyncForEach(category.subcategories, async cat => {
    cat.path = newPath + cat.path.substring(oldLength);
    await cat.save();
    adjustChildPaths(oldPath, newPath, cat);
  });
}

function swapParents(oldParentID, newParentID, childID) {
  let oldParent, newParent;

  return Category.findById(newParentID)
    .then(found => {
      newParent = found;
      if (oldParentID) {
        return Category.findById(oldParentID);
      }
    })
    .then(found => {
      oldParent = found;

      if (oldParent) {
        oldParent.subcategories = oldParent.subcategories.filter(subcat => {
          return subcat.id !== childID;
        });
        return oldParent.save();
      }
    })
    .then(() => {
      newParent.subcategories.push(childID);
      return newParent.save();
    });
}

function add(req, res) {
  const {
    name,
    path,
    pathName,
    image,
    topLevel,
    subcategories,
    parent
  } = req.body.category;
  let newCatID;

  const category = new Category({
    name,
    path,
    pathName,
    image,
    topLevel,
    parent,
    subcategories
  });

  category
    .save()
    .then(savedCat => (newCatID = savedCat._id))
    .then(() => {
      if (parent) {
        return addToParent(parent, newCatID);
      }
    })
    .then(() => res.json(newCatID))
    .catch(console.log);
}

function addToParent(parentID, newCatID) {
  return Category.findById(parentID).then(parentCat => {
    if (parentCat) {
      parentCat.subcategories.push(newCatID);
      return parentCat.save();
    }
  });
}

function addImage(req, res) {
  const categoryID = req.params.id;
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
      .then(() => Category.findById(categoryID))
      .then(category => {
        category.image = `${fileName}${fileExt}`;
        return category.save();
      })
      .then(savedCategory => {
        sharp.cache(false);
        res.json(savedCategory);
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
  const categoryID = req.params.id;
  const imgLocation = req.query.location;
  const fileName = req.query.file;

  const largePath = `./public/images/${imgLocation}/${fileName}`;
  const mediumPath = `./public/images/${imgLocation}/medium/${fileName}`;
  const smallPath = `./public/images/${imgLocation}/small/${fileName}`;

  Category.findByIdAndUpdate(categoryID, { image: "" }, { new: true })
    .then(updatedCategory => res.json(updatedCategory))
    .catch(err => {
      console.log(err);
      res.status(400).send("Could not delete image.");
      throw new Error("Failed to update category");
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

module.exports = {
  getAll,
  remove,
  getOne,
  update,
  add,
  addImage,
  deleteImage
};
