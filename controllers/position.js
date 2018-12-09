const Position = require('../models/Position');
const errorHandler = require('../utils/errorHandler');

module.exports.getByCategoryId = async (req, resp) => {
  try {
    const positions = await Position.find({
      category: req.params.categoryId,
      user: req.user.id
    });
    resp.status(200).json(positions);
  } catch (e) {
    errorHandler(resp, e)
  }
};

module.exports.create = async (req, resp) => {
  try {
    const position = await new Position({
      name: req.body.name,
      cost: req.body.cost,
      category: req.body.category,
      user: req.user.id
    }).save();
    resp.status(201).json(position);
  } catch (e) {
    errorHandler(resp, e)
  }
};

module.exports.remove = async (req, resp) => {
  try {
    await Position.remove({_id: req.params.id});
    resp.status(200).json({
      message: 'Position deleted.'
    })
  } catch (e) {
    errorHandler(resp, e)
  }
};

module.exports.update = async (req, resp) => {
  try {
    const position = await Position.findOneAndUpdate(
      {_id: req.params.id},
      {$set: req.body},
      {new: true}
    );
    resp.status(200).json(position);
  } catch (e) {
    errorHandler(resp, e)
  }
};