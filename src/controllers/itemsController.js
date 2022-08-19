const itemsModel = require('../models/itemsModel');
const nid = require('nid');

module.exports = {
  getUserItems: async (req, res) => {
    const { userId } = req.body;

    const itemsFound = await itemsModel.find({ owner: userId });

    return res.send({ items: itemsFound });
  },
  uploadItem: async (req, res) => {
    const { owner, title, photo } = req.body;

    const item = new itemsModel();
    item.title = title;
    item.photo = photo;
    item.owner = owner;

    try {
      await item.save();
      return res.send({ success: true, item });
    } catch (error) {
      return res.send({ success: false, error });
    }
  },
};
