const fs = require("fs");

const { importDataToDB, emptyDB } = require("./seed.js");
const User = require("../models/user.model.js");
const Product = require("../models/product.model.js");

const obj = {
  user: { model: User, filePath: `${__dirname}/../dev/users.data.json` },
  product: { model: Product, filePath: `${__dirname}/../dev/products.data.json` },
  //   review: { model: Review, filePath: `${__dirname}/review.json` },
};

// SOLID Principles
// O => Open for extension and closed for modification

const list = JSON.parse(
  fs.readFileSync(obj[process.argv[3]].filePath, "utf-8")
);

if (process.argv[2] === "--import") {
  importDataToDB(obj[process.argv[3]].model, list);
} else if (process.argv[2] === "--delete") {
  emptyDB(obj[process.argv[3]].model);
}