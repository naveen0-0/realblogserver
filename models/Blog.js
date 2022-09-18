const { Schema, model } = require('mongoose');
const {commentSchema} = require('./Comment')

const RequiredString = {
    type:String,
    required:true
}

const blogSchema = new Schema({
    title:RequiredString,
    description:RequiredString,
    keyword1:RequiredString,
    keyword2:RequiredString,
    keyword3:RequiredString,
    username:RequiredString,
    comments:[commentSchema],
    url:RequiredString
},{
    timestamps:true
})

const Blog = model('blog',blogSchema);
module.exports = Blog