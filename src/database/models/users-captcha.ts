import { Schema, model } from 'mongoose'

const schema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    errors: {
        type: Array,
        default: []
    }
})

const UsersCaptcha = model('usersCaptcha', schema)

export { UsersCaptcha, UsersCaptchaTypes }

interface UsersCaptchaTypes {
    id: string;
    errors: {
        timestamp: number;
        correct: string;
        selected: string;
    }[];
}