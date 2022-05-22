const express = require('express')
const router = express.Router()
const postController = require('../controllers/post.controller');

router.post('/add',postController.addPost)
router.post('/getPosts',postController.getPosts)
router.get('/getAllPosts',postController.getAllPosts)
router.get('/getUserPosts',postController.getPosts);
router.delete('/deletePost',postController.deletePost);
router.put('/updatePost',postController.updatePost)
module.exports = router