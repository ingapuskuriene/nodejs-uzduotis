const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

module.exports = {
  register: async (req, res) => {
    const { username, passOne, photo } = req.body;

    const user = new userModel();
    user.username = username;
    user.password = await bcrypt.hash(passOne, 10);
    user.photo = photo;
    try {
      await user.save();
      res.send({ success: true });
    } catch (error) {
      res.send({ success: false, error });
    }
  },
  login: async (req, res) => {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username });

    if (user) {
      const passMatch = await bcrypt.compare(password, user.password);

      if (passMatch) {
        req.session.user = user.id;
        return res.send({
          success: true,
          userId: user.id,
          username: user.username,
          photo: user.photo,
        });
      } else {
        return res.send({ success: false, error: 'Incorrect credentials' });
      }
    }

    res.send({ success: false, error: 'User does not exist' });
  },
  changeName: async (req, res) => {
    const { username } = req.body;
    const userId = req.session.user;

    const userData = await userModel.findOne({ id: userId });

    if (!userData) {
      return res.send({
        success: false,
        error: 'Username already exists',
      });
    }

    try {
      await userModel.findOneAndUpdate({ id: userId }, { $set: { username } });
      return res.send({ success: true });
    } catch (e) {
      return res.send({ success: false });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await userModel.find({});
      const showUsers = users.map((user) => ({
        id: user.id,
        username: user.username,
        photo: user.photo,
      }));
      return res.send({ success: true, users: showUsers });
    } catch (e) {
      return res.send({ success: false });
    }
  },
};
