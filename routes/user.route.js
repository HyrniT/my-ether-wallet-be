const userController = require('../controllers/user.controller');
const router = require('express').Router();

// CRUD Routes /users
router.get('/', userController.getUsers); // /users
router.get('/:userId', userController.getUser); // /users/:userId
router.post('/', userController.createUser); // /users
router.put('/:userId', userController.updateUser); // /users/:userId
router.delete('/:userId', userController.deleteUser); // /users/:userId

module.exports = router;
