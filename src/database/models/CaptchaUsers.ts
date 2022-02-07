import CaptchaUsersSchema from "../types/CaptchaUsers";
import { Schema, model } from 'mongoose';

const schema = new Schema<CaptchaUsersSchema>({
    id: {
        type: String,
        unique: true,
        required: true
    },
    fails: [{
        timestamp: Number,
        correct: String,
        selected: String
    }]
});
    
const CaptchaUsers = model<CaptchaUsersSchema>('usersCaptcha', schema);

export default CaptchaUsers;