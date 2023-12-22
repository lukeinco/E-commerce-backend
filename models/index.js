// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belong to Category
Product.belongsTo(Category, {
  foreignKey: 'category_id', // Add the correct foreign key here
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'category_id', // Add the correct foreign key here
});

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignKey: 'product_id', // Add the correct foreign key here
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: 'tag_id', // Add the correct foreign key here
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
