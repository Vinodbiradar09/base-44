export const runtime = "nodejs";
import { Chat as ChatModel } from "../model/Chat";
import { Message as MessageModel } from "../model/Messages";
import { connectDB } from "../lib/db";
import { AddMessage, Chat, Message } from "../types/addMessage";
import { messageZod } from "../schemas/messageZod";

export const generateTitle = (content: string): string => {
  const firstLine = content.trim().split("\n")[0].trim();
  return firstLine.length > 5 ? firstLine.slice(0, 50) : "Code Optimization";
};

export const createChat = async (
  userId: string,
  content: string
): Promise<Chat> => {
  try {
    await connectDB();
    const title = generateTitle(content);
    const chat = await ChatModel.create({
      userId,
      title,
      messageCount: 0,
    });
    if (!chat) {
      throw new Error("Error while creating the chat");
    }
    return {
      _id: chat._id.toString(),
      userId: chat.userId.toString(),
      title: chat.title,
      messageCount: chat.messageCount,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };
  } catch (error) {
    console.error("Error while creating the first chat:", error);
    throw new Error(`Error in first chat: ${error}`);
  }
};

export const addMessage = async ({
  chatId,
  userId,
  role,
  content,
}: AddMessage): Promise<Message> => {
  try {
    await connectDB();
    const result = messageZod.safeParse({ chatId, userId, role, content });
    if (!result.success) {
      const errors = result.error.format();
      const messageErrors = [
        ...(errors.chatId?._errors || []),
        ...(errors.userId?._errors || []),
        ...(errors.role?._errors || []),
        ...(errors.content?._errors || []),
      ].filter(Boolean);
      throw new Error(
        messageErrors.length > 0
          ? messageErrors.join(", ")
          : "Error in adding new message"
      );
    }
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }
    if (chat.messageCount > 20) {
      throw new Error("Chat is full - create a new chat");
    }
    const message = await MessageModel.create({
      chatId,
      userId,
      role,
      content,
    });
    if (!message) {
      throw new Error("failed to create the message");
    }
    chat.messageCount += 1;
    await chat.save();

    return {
      _id: message._id.toString(),
      chatId: message.chatId.toString(),
      userId: message.userId.toString(),
      role: message.role,
      content: message.content,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  } catch (error) {
    console.error("Error while creating the messages", error);
    throw new Error("Failed to create new messages");
  }
};
