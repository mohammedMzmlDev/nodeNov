const POSTMODAL = require('../modeles/post.modal');
exports.addPost = (req,res) => {
    POSTMODAL.add(req,(post) => {
        // console.log('err',err);
        // console.log('post',post);
        res.send(post)
    })
}

exports.getPosts = (req,res) => {
    POSTMODAL.getUserPosts(req,(posts) => {
        res.send(posts)
    })
} 

exports.getAllPosts = (req,res) => {
    POSTMODAL.getAllPosts((posts) => {
        res.send(posts)
    })
}

exports.deletePost = (req,res) => {
    POSTMODAL.deletePost(req,(delPost) => {
        res.send(delPost)
    })
}

exports.updatePost = (req,res) => {
    console.log('req of update post',req.body);
    POSTMODAL.updatePost(req,(resFromDB) => {
        res.send(resFromDB)
    })
}