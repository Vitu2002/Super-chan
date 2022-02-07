import { model, Schema } from "mongoose";
import BannedLinksSchema from "../types/BannedLinks";

const schema = new Schema<BannedLinksSchema>({
    staff: { type: String },
    link: { type: String, unique: true },
    date: { type: Number, default: Number((Date.now() / 1000).toFixed()) }
});

const BannedLinks = model<BannedLinksSchema>('banned_links', schema);
    
export default BannedLinks;