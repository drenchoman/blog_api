const express = require('express');
const router = express.Router();
const passport = require('passport')
const auth_Controller = require('../controllers/authController');
const post_Controller = require('../controllers/postController');
const comment_Controller = require('../controllers/commentController');
const user_Controller = require('../controllers/userController');

router.post('/login', auth_Controller.login);

router.post('/register', auth_Controller.register);

router.get('/posts', post_Controller.allPosts);

router.get('/posts/:postid', post_Controller.singlePost);

router.post('/posts', passport.authenticate('jwt', {session: false}), post_Controller.createPost);

router.get('/users/:userid',  passport.authenticate('jwt', {session: false}), user_Controller.userProfile);

router.get('/users', passport.authenticate('jwt', {session: false}), user_Controller.allUsers);

router.get('/users/:userid/posts', passport.authenticate('jwt', {session: false}), user_Controller.usersPosts);

router.post('/posts/:postid/comments', comment_Controller.createComment);

module.exports = router;
