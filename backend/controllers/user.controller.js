const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Update profile
const updateProfile = async (req, res, next) => {
  try {
    if (req.user.isDemo) {
      return res.status(403).json({ success: false, message: 'Demo accounts cannot edit profile.' });
    }
    
    const { fullName, company, bio, website, location, phone, avatar, preferences } = req.body;
    
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, company, bio, website, location, phone, avatar, preferences },
      { new: true, runValidators: true }
    );
    
    updated.profileCompletionScore = updated.calculateProfileScore();
    await updated.save({ validateBeforeSave: false });
    
    res.json({ success: true, message: 'Profile updated!', user: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
const changePassword = async (req, res, next) => {
  try {
    if (req.user.isDemo) {
      return res.status(403).json({ success: false, message: 'Demo accounts cannot change password.' });
    }
    
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    
    if (!user.password) {
      return res.status(400).json({ success: false, message: 'No password set (OAuth account).' });
    }
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password incorrect.' });
    }
    
    user.password = newPassword;
    user.activityHistory.unshift({ action: 'password_changed', ip: req.ip });
    await user.save();
    
    res.json({ success: true, message: 'Password changed successfully!' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get activity history
const getActivity = async (req, res) => {
  res.json({ success: true, activity: req.user.activityHistory || [] });
};

// @desc    Get login devices
const getDevices = async (req, res) => {
  res.json({ success: true, devices: req.user.loginDevices || [] });
};

// @desc    Revoke device access
const revokeDevice = async (req, res, next) => {
  try {
    const { deviceIndex, password } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    
    if (user.password) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(400).json({ success: false, message: 'Incorrect password.' });
    }
    
    if (deviceIndex === 0) return res.status(400).json({ success: false, message: 'Cannot revoke current device.' });
    
    user.loginDevices.splice(deviceIndex, 1);
    await user.save({ validateBeforeSave: false });
    
    res.json({ success: true, message: 'Device access revoked.' });
  } catch (error) { next(error); }
};

// @desc    Delete account
const deleteAccount = async (req, res, next) => {
  try {
    if (req.user.isDemo) {
      return res.status(403).json({ success: false, message: 'Cannot delete demo account.' });
    }
    
    const { password } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    
    if (user.password) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Password incorrect.' });
      }
    }
    
    await User.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: 'Account deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateProfile, changePassword, getActivity, getDevices, revokeDevice, deleteAccount };
