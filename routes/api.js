const router = require('express').Router();
const Blog = require('../models/Blog');
const { checkToken } = require('../middleware/middleware');

//* Create a new blog
router.route('/newblog').post(checkToken,async (req,res)=>{
    const { title, description, keywordone, keywordtwo, keywordthree, url } = req.body;
    try {
        const blog = await Blog.create({ title, description, keywordone, keywordtwo, keywordthree,username:req.user.username,url })
        res.send({ statusload:true, msg : "Blog created successfully",blog:blog})
    } catch (error) {
        console.log(error);
        res.send({ statusload:false, msg : "Unable to create a blog"})
    }
})


//* All blogs
router.route('/allblogs').get( async (req,res)=>{
    try {
        const blogs = await Blog.find();
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

router.route('/comment/:id').post( checkToken,async (req,res)=>{
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
        res.send({ statusload : true, comment : req.body.comment })
        
    } catch (error) {
        res.send({ statusload : false })
    }
})

module.exports = router;