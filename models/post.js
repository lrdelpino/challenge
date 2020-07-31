'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = Schema({
    title: String,
    text: String,
    timeStamp: Date
})


module.exports = mongoose.model('Post', PostSchema)

