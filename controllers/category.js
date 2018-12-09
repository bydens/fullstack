const Category = require('../models/Category');
const Position = require('../models/Position')
const errorHandler = require('../utils/errorHandler');

module.exports.getAll = async (req, resp) => {
  try {
    const categories = await Category.find({user: req.user.id});
    resp.status(200).json(categories);
  } catch (e) {
    errorHandler(resp, e);
  }
};

module.exports.getById = async (req, resp) => {
  try {
    const category = await Category.findById(req.params.id);
    resp.status(200).json(category);
  } catch (e) {
    errorHandler(resp, e);
  }
};

module.exports.remove = async (req, resp) => {
  try {
    await Category.remove({_id: req.params.id});
    await Position.remove({category: req.params.id});
    resp.status(200).json({
      message: 'Category deleted'
    })
  } catch (e) {
    errorHandler(resp, e);
  }
};

module.exports.create = async (req, resp) => {
  const category = new Category({
    name: req.body.name,
    user: req.user.id,
    imageSrc: req.file ? req.file.path : ''
  });
  try {
    await category.save();
    resp.status(201).json(category);
  } catch (e) {
    errorHandler(resp, e);
  }
};

module.exports.update = async (req, resp) => {
  const updated = {
    name: req.body.name
  };

  if (req.file) {
    updated.imageSrc = req.file.path
  }
  try {
    const category = await Category.findOneAndUpdate(
        {_id: req.params.id},
        {$set: updated},
        {new: true}
    );
    resp.status(200).json(category);
  } catch (e) {
    errorHandler(resp, e);
  }
};