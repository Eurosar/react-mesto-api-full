const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateUserProfile,
  updateUserAvatar, getUserInfo,
} = require('../controllers/users');
const { updateUserProfileValidator, updateUserAvatarValidator, idValidator } = require('../validators/celebrate');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:id', idValidator, getUser);
router.patch('/me', updateUserProfileValidator, updateUserProfile);
router.patch('/me/avatar', updateUserAvatarValidator, updateUserAvatar);

module.exports = router;
