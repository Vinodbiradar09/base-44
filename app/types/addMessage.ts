import mongoose from "mongoose";

export interface AddMessage {
    chatId : string | mongoose.Types.ObjectId,
    userId : string | mongoose.Types.ObjectId,
    role: "user" | "assistant",
    content : string,
}

export interface FirstMessage {
    content : string,
    chatId?: string | mongoose.Types.ObjectId,
}

export interface ContentMessage {
    content : string,
}