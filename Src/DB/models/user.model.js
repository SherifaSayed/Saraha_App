import mongoose from "mongoose";
import { User_Roles , GENDER, STATUS } from "../../Common/constants.js"
const userSchema = new mongoose.Schema({

    firstName:{
        type:String,
        required:true,
        trim:true,
        minLength:[3,'first name must be at least 3 characters long'],
        maxLength:[50, 'first name must be less than 50 character long']
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        minLength:[3,"last name must be at least 3 character long"],
        maxLength:[50,"last name must be less than 50 character long"]
    },
    email:{
          type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        index:{
            name:"email_unique",
            unique:true

        }
    },
    role:{
         type:String,
       enum:Object.values(User_Roles),
       default:User_Roles.USER
    },
    gender:{
        type:String,
        enum:Object.values(GENDER)
    },
    status:{
         type:String,
        enum:Object.values(STATUS),
        default:STATUS.ACTIVE
    },
    phoneNumber:{
        type:String,
    },
    isDeleted: {
    type: Boolean,
    default: false
  },
    createdAt:{
        type:Date,
    
    },
    updatedAt:{
        type:Date,
        
    }
},{
    toJSON:{virtuals:true,getters:true},
    toObject:{getters:true},
    timestamps:true

})
userSchema.virtual('fullName').get(function(){
    return this.firstName +' '+ this.lastName
})
// safty check for model
 const User= mongoose.models.User|| mongoose.model('User',userSchema)
 export default User;