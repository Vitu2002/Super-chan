import { Schema, model } from 'mongoose'

const schema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    userID: {
        type: String,
        unique: true,
        required: true
    },
    isPermanent: {
        type: Boolean,
        default: false
    }
})

const Model = model('customRoles', schema)

export default Model