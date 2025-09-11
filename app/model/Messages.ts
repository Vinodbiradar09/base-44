import mongoose , {Schema , model , models , Model , Document} from "mongoose";

export interface MessageINT extends Document {
    _id : mongoose.Types.ObjectId,
    chatId: mongoose.Types.ObjectId;
    userId: string; 
    role: "user" | "assistant";
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<MessageINT>(
    {
        chatId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Chat",
            required : [true , "Chat window context id is required"],
            index : true,
        },
        userId : {
            type : String,
            required : [true , "user id is required from better auth"],
        },
        role : {
            type : String,
            enum : ["user" , "assistant"],
            required : [true , "role is required for message schema"],
        },
        content : {
            type : String,
            required: [true , "content is required"],
            maxlength: 100000,
        }
    },
    {
        timestamps : true,
    }
)

export const Message : Model<MessageINT> = models?.Message as mongoose.Model<MessageINT> || model<MessageINT>("Message" , messageSchema);