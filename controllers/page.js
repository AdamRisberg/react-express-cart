const Page = require("../models/page");

function getAll(req, res) {
  Page.find({})
    .then(pages => res.json(pages))
    .catch(err => {
      console.log(err);
      res.status(400).send("Could not retrieve pages");
    });
}

function getPage(req, res) {
  const id = req.params.id;

  Page.findById(id)
    .then(page => res.json(page))
    .catch(err => {
      console.log(err);
      res.status(400).send("Could not retrieve page");
    });
}

function getPageByPath(req, res) {
  const path = req.params.path;

  Page.findOne({ path })
    .then(page => res.json(page))
    .catch(err => {
      console.log(err);
      res.status(400).send("Could not retrieve page");
    });
}

function remove(req, res) {
  const pageIDs = req.body;

  Page.deleteMany({ _id: { $in: pageIDs } })
    .then(() => Page.find({}))
    .then(pages => res.json(pages))
    .catch(err => {
      console.log(err);
      res.status(400).send("Unable to delete page(s)");
    });
}

function add(req, res) {
  const { title, content, path } = req.body.page;

  const page = new Page({
    title,
    content,
    path
  });

  page
    .save()
    .then(savedPage => res.json(savedPage._id))
    .catch(console.log);
}

function update(req, res) {
  const { title, content, path, metaDescription } = req.body.page;

  Page.findByIdAndUpdate(req.params.id, {
    title,
    content,
    path,
    metaDescription
  })
    .then(() => res.json(true))
    .catch(console.log);
}

module.exports = {
  getAll,
  getPage,
  getPageByPath,
  remove,
  add,
  update
};
