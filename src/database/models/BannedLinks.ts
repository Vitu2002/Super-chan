import { model, Schema } from "mongoose";

const schema = new Schema({
    staff: {
        type: String
    },
    link: {
        type: String,
        unique: true
    },
    date: {
        type: Number,
        default: (Date.now() / 1000).toFixed()
    }
})

const Model = model('banned_links', schema)

export default Model