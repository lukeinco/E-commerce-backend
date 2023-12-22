const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// GET all tags
router.get('/', async (req, res) => {
  try {
    // Find all tags and include associated Product data
    const tagData = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }],
    });
    res.status(200).json(tagData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET one tag by ID
router.get('/:id', async (req, res) => {
  try {
    // Find one tag by ID and include associated Product data
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag }],
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// POST create a new tag
router.post('/', async (req, res) => {
  try {
    // Create a new tag
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag);
  } catch (error) {
    res.status(400).json(error);
  }
});

// PUT update a tag by ID
router.put('/:id', async (req, res) => {
  try {
    // Update a tag's name by ID
    const updatedTag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!updatedTag[0]) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }

    res.status(200).json(updatedTag);
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE a tag by ID
router.delete('/:id', async (req, res) => {
  try {
    // Delete one tag by ID
    const deletedTag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedTag) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }

    res.status(200).json(deletedTag);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
