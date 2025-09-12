import { NextRequest , NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { gemini_response } from "@/app/helpers/gemini";
import { createChat , addMessage } from "@/app/helpers/firstChat";
import {auth} from "@/lib/auth";
import { headers } from "next/headers";
import { FirstMessage } from "@/app/types/addMessage";
import { contentZod } from "@/app/schemas/messageZod";

export async function POST(req : NextRequest) {
    try {
        await connectDB();
        const session = await auth.api.getSession({
            headers : await headers()
        })
        if(!session?.user.email){
            return NextResponse.json(
                {
                    success : false,
                    message : "Unauthorized User , please login",
                },{status : 401}
            )
        }
        const id = session.user.id;
        const body : FirstMessage = await req.json();
        const { content , chatId } = body;
        const contentRes = contentZod.safeParse({content});
        if(!contentRes.success){
            return NextResponse.json(
                {
                    success : false,
                    message : contentRes.error.format().content?._errors || "invalid content format",
                },{status : 402}
            )
        }

        let chat;
        const messages = [];
        let optimizedResponse = "";
        if(!chatId){
            chat = await createChat(session.user.id , content);
            const userMsg = await addMessage({chatId : chat._id, userId : id , role : "user" , content});
            messages.push(userMsg);

            const gemini = await gemini_response(content , (chunk)=> {
                optimizedResponse += chunk;
            });
            console.log("gemini" , gemini);
            const assistantMsg = await addMessage({chatId : chat._id || "" , userId : id , role : "assistant" , content : optimizedResponse});
            messages.push(assistantMsg);
        } else {
            chat = {_id : chatId};
            const userMsg = await addMessage({chatId, userId : id , role : "user" , content});
            messages.push(userMsg);

            const gemini = await gemini_response(content , (chunk)=>{
                optimizedResponse += chunk;
            });
            console.log("gemini" , gemini);

            const assistantMsg = await addMessage({chatId , userId : id , role : "assistant" , content : optimizedResponse});
            messages.push(assistantMsg);
        }
        return NextResponse.json(
            {
                message : "successfully created context chat window for chat",
                success : true,
                chat : chat,
                messages : messages,
            },{status : 200}
        )

    } catch (error) {
        console.error("error while creating the chat window" , error);
        return NextResponse.json(
            {
                message : "Error in creating the context chat window for chat",
                success : false
            },{status : 500}
        )
    }
}