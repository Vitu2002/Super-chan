import { Schema, model } from 'mongoose'

const schema = new Schema({
    customID: {
        type: String,
        unique: true,
        required: true
    },
    messageID: {
        type: String,
        unique: true,
        required: true
    },
    title: {
        type: String,
        unique: true,
        required: true
    }
})

const Model = model('menus', schema)

export default Model