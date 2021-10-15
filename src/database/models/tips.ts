import { Schema, model } from 'mongoose'

const schema = new Schema({
    id: {
        type: Number,
        required: true
    },
    date: Date,  
    tip_original: String,
    tip_translation: String,
    user_name: String,
    user_avatar: String,
    example_original: String,
    example_translation: String,
    language_flag: String
})

const Model = model('tips', schema)

export default Model