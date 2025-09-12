import { Chat } from "../model/Chat";
import { Message } from "../model/Messages";
import { connectDB } from "../lib/db";
import { AddMessage } from "../types/addMessage";
import { messageZod } from "../schemas/messageZod";

export const generateTitle = (content: string): string => {
  const firstLine = content.trim().split("\n")[0].trim();
  return firstLine.length > 5 ? firstLine.slice(0, 50) : "Code Optimization";
};

export const createChat = async(userId : string , content : string)=>{
    try {
        await connectDB();
        const title = generateTitle(content);
        const chat = await Chat.create({
            userId,
            title,
            messageCount : 0,
        })
        if(!chat){
            throw new Error("Error while creating the chat");
        }
        return chat;
    } catch (error) {
        console.error("Error while creating the first chat" , error);
        throw new Error("Error in first chat");
    }
}

export const addMessage = async({chatId , userId , role , content}: AddMessage)=>{
    try {
        await connectDB();
        const result = messageZod.safeParse({chatId , userId , role , content});
        if(!result.success){
            const errors = result.error.format();
            const messageErrors = [
                ...(errors.chatId?._errors || "chatId is invalid"),
                ...(errors.userId?._errors || "userId is invalid"),
                ...(errors.role?._errors || "choose the role correctly"),
                ...(errors.content?._errors || "error in content"),
            ]
            if(messageErrors.length){
                return messageErrors.length > 0 ? messageErrors.join(", ") : "Error in adding new message";
            }
        }
        const chat = await Chat.findById(chatId);
        if(!chat){
            throw new Error("Chat not found");
        }
        if(chat.messageCount > 20){
            throw new Error("Chat is full - create a new chat");
        }
        const message = await Message.create({
            chatId,
            userId,
            role,
            content
        })
        if(!message){
            throw new Error("failed to create the message");
        }
        chat.messageCount += 1;
        await chat.save();

        return message;
    } catch (error) {
        console.error("Error while creating the messages" , error);
        throw new Error("Failed to create new messages");
    }
}