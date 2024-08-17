import { Schema,model } from "mongoose";

const UserSchema = new Schema({
    username:{type:String,min:4,unique:true,required:true},
    password:{type:String,required:true,unique:true}
})
export const UserModel = model("User",UserSchema);

