const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// GET all products
router.get('/', async (req, res) => {
  try {
    // Find all products and include associated Category and Tag data
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag, through: ProductTag }],
    });
    res.status(200).json(productData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET one product by ID
router.get('/:id', async (req, res) => {
  try {
    // Find one product by ID and include associated Category and Tag data
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag, through: ProductTag }],
    });

    if (!productData) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }

    res.status(200).json(productData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// POST create a new product
router.post('/', async (req, res) => {
  try {
    // Create a new product
    const newProduct = await Product.create(req.body);

    // If there are associated tags, create pairings in the ProductTag model
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: newProduct.id,
          tag_id,
        };
      });

      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(200).json(newProduct);
  } catch (error) {
    res.status(400).json(error);
  }
});

// PUT update a product by ID
router.put('/:id', async (req, res) => {
  try {
    // Update product data by ID
    const updatedProduct = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!updatedProduct[0]) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }

    // If there are associated tags, update pairings in the ProductTag model
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });

      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

      await Promise.all([
        ProductTag.destroy({ where: { id: productTagIds } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE a product by ID
router.delete('/:id', async (req, res) => {
  try {
    // Delete a product by ID
    const deletedProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedProduct) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }

    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
