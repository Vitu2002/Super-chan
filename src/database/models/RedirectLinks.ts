import { model, Schema } from "mongoose";
import RedirectLinksSchema from "../types/RedirectLinks";

const schema = new Schema<RedirectLinksSchema>({
    from: {
        type: String,
        unique: true
    },
    uses: {
        type: Number,
        default: 0
    },
    staff: String,
    data: Number,
    to: String
});

const RedirectLinks = model<RedirectLinksSchema>('redirect_links', schema);
    
export default RedirectLinks;