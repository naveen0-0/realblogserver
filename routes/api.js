const router = require('express').Router();
const Blog = require('../models/Blog');
const { checkToken } = require('../middleware/middleware');

//* Create a new blog
router.route('/newblog').post(checkToken,async (req,res)=>{
    const { title, description, keyword1, keyword2, keyword3, url } = req.body;
    try {
        const blog = await Blog.create({ title, description, keyword1, keyword2, keyword3,username:req.user.username,url })
        res.send({ statusload:true, msg : "Blog created successfully",blog:blog})
    } catch (error) {
        res.send({ statusload:false, msg : "Unable to create a blog"})
    }
})


//* All blogs
router.route('/allblogs').get( async (req,res)=>{
    try {
        const blogs = await Blog.find({}).select({title:1,keyword1:1,keyword2:1,keyword3:1,url:1, username:1, description:1});
        res.send({ statusload:true,blogs:blogs })
    } catch (error) {
        res.send({ statusload:false,blogs:[]})
    }
})

//* Get a single blog
router.route('/blog/:id').get( async (req,res)=>{
    const { id } = req.params;
    try {
        const blog = await Blog.findOne({ _id: id})
        res.send({statusload:true,blog:blog})
    } catch (error) {
        res.send({statusload:false,blog:{}})
    }
})

//*Comment on a specific post
router.route('/comment/:id').post(checkToken,async (req,res)=>{
    const { id } = req.params;

    try {
        let blog = await Blog.updateOne({ _id :id }, {
            $push : {
                comments : {
                    username : req.user.username,
                    comment:req.body.comment
                }
            }
        })
        res.send({ statusload : true, comment : req.body.comment, username:req.user.username })
        
    } catch (error) {
        console.log(error)
        res.send({ statusload : false })
    }
})

//*Personal Blogs
router.route('/ownblogs').get(checkToken,async (req,res) => {
    try {
        let blogs = await Blog.find({ username : req.user.username },{ url:1,title:1,description:1 })
        res.send({ statusload:true,blogs:blogs })
    } catch (error) {
        res.send({ statusload:false,blogs:{} })
    }
})


//* Blogs that i commented on
router.route('/commentedblogs').get(checkToken,async (req,res) => {
    try {
        let blogs = await Blog.find({ "comments" : { "username": req.user.username }})
        res.send({ statusload:true,blogs:blogs })
    } catch (error) {
        res.send({ statusload:false,blogs:{} })
    }
})

//* Check whether the user is allowed to edit the blog or not or not
router.route('/editcheck/:id').get(checkToken,async (req,res)=>{
    const { id } = req.params;
    try {
        const blog = await Blog.findOne({ _id:id, username: req.user.username },{ title:1, description:1, keyword1:1, keyword2:1, keyword3:1, url:1 });
        if(blog){
            return res.send({ statusload : true, blog:blog })
        }
    } catch (error) {
        return res.send({ statusload : false })
    }
})

//* Edit blog
router.route('/blog/edit/:id').put(checkToken,async (req,res) => {
    const { title, description, keyword1, keyword2, keyword3, url } = req.body;
    try {
        const blog = await Blog.updateOne({ _id: req.params.id },{ title, description, keyword1, keyword2, keyword3, url })
        res.send({ statusload: true, msg: "Blog Updated Successfully" })
    } catch (error) {
        console.log(error);
        res.send({ statusload: false, msg:"Error updating the blog" })
    }
})

//* Delete blog
router.route('/blog/delete/:id').delete(checkToken, async (req,res) => {
    try {
        let blog = await Blog.findByIdAndDelete({_id : req.params.id })
        res.send({ statusload:true})
    } catch (error) {
        res.send({ statusload:false})
    }
})

module.exports = router;