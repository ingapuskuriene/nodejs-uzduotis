const requestsModel = require('../models/requestsModel');
const itemsModel = require('../models/itemsModel');

module.exports = {
  getRequests: async (req, res) => {
    try {
      const data = await requestsModel.find({});
      return res.send({ success: true, data });
    } catch (e) {
      return res.send({ success: false, e });
    }
  },
  createRequest: async (req, res) => {
    const { requestedItems, requestor } = req.body;

    const request = new requestsModel();
    request.requestor = requestor;
    request.owner = { id: requestedItems[0].owner };
    request.success = false;
    request.complete = false;
    request.requestedItems = requestedItems;

    try {
      await request.save();
      return res.send({ success: true, data: request });
    } catch (e) {
      return res.send({ success: false, e });
    }
  },
  updateRequest: async (req, res) => {
    const { _id, success, requestedItems, requestor } = req.body;

    try {
      await requestsModel.findOneAndUpdate(
        { _id },
        { $set: { success, complete: true } }
      );
      if (success) {
        await itemsModel.updateMany(
          { _id: { $in: [...requestedItems.map((item) => item._id)] } },
          { $set: { owner: requestor.userId } }
        );
      }
      return res.send({ success: true });
    } catch (error) {
      return res.send({ success: false, error });
    }
  },
};
