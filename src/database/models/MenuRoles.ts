import { model, Schema } from "mongoose";
import MenuRolesSchema from "../types/MenuRoles";

const schema = new Schema<MenuRolesSchema>({
    id: {
        type: String,
        required: true
    },
    roleId: String,
    description: String,
    emoji: String,
    label: String
});

const MenuRoles = model<MenuRolesSchema>('menu_roles', schema);
    
export default MenuRoles;