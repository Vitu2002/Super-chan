import { model, Schema } from "mongoose";
import ProjectRolesSchema from "../types/ProjectsRoles";

const schema = new Schema<ProjectRolesSchema>({
    roleId: {
        type: String,
        required: true,
        unique: true
    },
    title: String,
    description: String,
    cover: String,
    type: String,
    tsuki: String,
    ml: String,
    other: String
});

const MenuRoles = model<ProjectRolesSchema>('projects_roles', schema);

export default MenuRoles;