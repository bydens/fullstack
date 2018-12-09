const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');

//(get) localhos:5000/api/order?offset=2&limit=5
module.exports.getAll = async (req, resp) => {
  const query = {
    user: req.user.id
  };

  // date start
  if (req.query.start) {
    query.date = {
      // больше или равно
      $gte: req.query.start
    }
  }

  if (req.query.end) {
    if (!query.date) {
      query.date = {}
    }
    query.date['$lte'] = req.query.end;
  }


  if (req.query.order) {
    query.order = +req.query.order;
  }
  try {
    const orders = await Order
        .find(query)
        .sort({date: -1})
        .skip(Number(req.query.offset))
        .limit(+req.query.limit);
    resp.status(200).json(orders);
  } catch (e) {
    errorHandler(resp, e);
  }
};

module.exports.create = async (req, resp) => {
  try {
    const lastOrder = await Order
        .findOne({user: req.user.id})
        .sort({date: -1});

    const maxOrder = lastOrder ? lastOrder.order : 0;

    const order = await new Order({
      order: maxOrder + 1,
      list: req.body.list,
      user: req.user.id
    }).save();
    resp.status(201).json(order);
  } catch (e) {
    errorHandler(resp, e);
  }
};