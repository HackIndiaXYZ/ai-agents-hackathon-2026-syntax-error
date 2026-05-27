const express = require('express');
const router = express.Router();
const { protect, notDemo } = require('../middleware/auth.middleware');
const { updateProfile, changePassword, getActivity, getDevices, revokeDevice, deleteAccount } = require('../controllers/user.controller');

router.use(protect);

router.put('/profile', notDemo, updateProfile);
router.put('/change-password', notDemo, changePassword);
router.get('/activity', getActivity);
router.get('/devices', getDevices);
router.post('/revoke-device', notDemo, revokeDevice);
router.delete('/account', notDemo, deleteAccount);

module.exports = router;
