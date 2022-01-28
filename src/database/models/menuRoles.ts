import { Schema, model } from 'mongoose'

const schema = new Schema({
    SelectMenu: {
        type: String,
        required: true
    },
    roleID: {
        type: String,
        required: true
    },
    options: {
        label: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        emoji: {
            type: String,
            required: true
        }
    }
})

const Model = model('select-menu-roles', schema)

export default Model