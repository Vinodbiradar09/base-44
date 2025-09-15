export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { gemini_response } from "@/app/helpers/gemini";
import { createChat, addMessage } from "@/app/helpers/firstChat";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { FirstMessage, Chat } from "@/app/types/addMessage";
import { contentZod } from "@/app/schemas/messageZod";
import { Chat as ChatModel } from "@/app/model/Chat";
import { Message as MessageModel } from "@/app/model/Messages" 

const encoder = new TextEncoder();

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized User, please login",
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body: FirstMessage = await req.json();
    const { content, chatId } = body;

    const contentRes = contentZod.safeParse({ content });
    if (!contentRes.success) {
      return NextResponse.json(
        {
          success: false,
          message: contentRes.error.format().content?._errors.join(", ") || "Invalid content format",
        },
        { status: 400 }
      );
    }

    let chat: Chat;
    let optimizedResponse = "";

    if (!chatId) {
      chat = await createChat(userId, content);
    } else {
      const existingChat = await ChatModel.findOne({ _id: chatId, userId });
      if (!existingChat) {
        return NextResponse.json(
          {
            success: false,
            message: "Chat not found or you don't have access",
          },
          { status: 404 }
        );
      }
      if (existingChat.messageCount >= 20) {
        return NextResponse.json(
          {
            success: false,
            message: "Your chat window is full, please select a new one",
          },
          { status: 400 }
        );
      }
      chat = {
        _id: existingChat._id.toString(),
        userId: existingChat.userId.toString(),
        title: existingChat.title,
        messageCount: existingChat.messageCount,
        createdAt: existingChat.createdAt,
        updatedAt: existingChat.updatedAt,
      };
    }

    await addMessage({
      chatId: chat._id,
      userId,
      role: "user",
      content: content.trim(),
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          await gemini_response(content.trim(), (chunk) => {
            optimizedResponse += chunk;
            if (optimizedResponse.length > 1000000) {
              throw new Error("Response size exceeds 1MB limit");
            }
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`));
          });
          await addMessage({
            chatId: chat._id,
            userId,
            role: "assistant",
            content: optimizedResponse,
          });

          const metadata = JSON.stringify({
            message: "Successfully created context chat window for chat",
            success: true,
            chatId: chat._id,
          });
          controller.enqueue(encoder.encode(`data: ${metadata}\n\n`));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in POST /api/first-chat-window:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Error in creating the context chat window: ${error}`,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized User, please login",
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const url = new URL(req.url);
    const chatId = url.searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json(
        {
          success: false,
          message: "chatId is required",
        },
        { status: 400 }
      );
    }

    const chat = await ChatModel.findOne({ _id: chatId, userId });
    if (!chat) {
      return NextResponse.json(
        {
          success: false,
          message: "Chat not found or you don't have access",
        },
        { status: 404 }
      );
    }

    const messages = await MessageModel.find({ chatId }).sort({ createdAt: 1 }).select("role content");

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Error in GET /api/first-chat-window:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Error fetching messages: ${error}`,
      },
      { status: 500 }
    );
  }
}