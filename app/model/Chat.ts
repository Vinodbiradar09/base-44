import mongoose , {Schema , model , models , Model , Document} from "mongoose";

export interface ChatINT extends Document{
    _id : mongoose.Types.ObjectId,
    userId : string,
    title : string,
    messageCount : number,
    createdAt: Date;
    updatedAt: Date;
}

const chatSchema = new Schema<ChatINT>(
    {
        userId : {
            type : String,
            required : [true , "UserId from bettter auth is required"],
            index : true,
        },
        title : {
            type : String,
            required : [true , "title is required"],
            index : true,
        },
        messageCount : {
            type : Number,
            default : 0,
            max : 20,
        }
    },
    {
        timestamps : true,
    }
)

export const Chat : Model<ChatINT> = models?.Chat as mongoose.Model<ChatINT>  || model<ChatINT>("Chat" , chatSchema);
