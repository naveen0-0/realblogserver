const { Schema, model } = require('mongoose');

const RequiredString = {
    type:String,
    required:true
}

const blogSchema = new Schema({
    title:RequiredString,
    description:RequiredString,
    keywordone:RequiredString,
    keywordtwo:RequiredString,
    keywordthree:RequiredString,
    username:RequiredString
},{
    timestamps:true
})

const Blog = model('blog',blogSchema);
module.exports = Blog