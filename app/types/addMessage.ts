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

export interface TitleMessage {
    title : string,
}

export interface Message {
  _id: string;
  chatId: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Chat {
  _id: string;
  userId: string;
  title: string;
  messageCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}