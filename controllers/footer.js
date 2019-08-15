const Page = require("../models/page");

function getFooterLinks(req, res) {
  Page.find({}, "title path")
    .then(pages => {
      res.json(pages);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Could not retrieve footer links");
    });
}

module.exports = {
  getFooterLinks
};
