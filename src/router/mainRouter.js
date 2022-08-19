const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getAllUsers,
} = require('../controllers/userController');

const { getUserItems, uploadItem } = require('../controllers/itemsController');
const {
  updateRequest,
  createRequest,
  getRequests,
} = require('../controllers/requestsController');

const {
  validateUserExist,
  validateRegister,
} = require('../middlewares/validate');

router.post('/register', [validateUserExist, validateRegister], register);
router.post('/login', login);
router.post('/user-items', getUserItems);
router.post('/upload-item', uploadItem);
router.post('/create-request', createRequest);
router.post('/update-request', updateRequest);
router.get('/get-requests', getRequests);
router.get('/all-users', getAllUsers);

module.exports = router;
