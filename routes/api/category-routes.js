const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// GET all categories
router.get('/', async (req, res) => {
  try {
    // Find all categories and include associated Products
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categoryData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET one category by ID
router.get('/:id', async (req, res) => {
  try {
    // Find one category by ID and include associated Products
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// POST create a new category
router.post('/', async (req, res) => {
  try {
    // Create a new category
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (error) {
    res.status(400).json(error);
  }
});

// PUT update a category by ID
router.put('/:id', async (req, res) => {
  try {
    // Update a category by ID
    const updatedCategory = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!updatedCategory[0]) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE a category by ID
router.delete('/:id', async (req, res) => {
  try {
    // Delete a category by ID
    const deletedCategory = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedCategory) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    res.status(200).json(deletedCategory);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
