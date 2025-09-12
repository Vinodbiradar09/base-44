import { NextResponse , NextRequest } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Chat } from "@/app/model/Chat";
import { Message } from "@/app/model/Messages";
import {auth} from "@/lib/auth";
import { headers } from "next/headers";

export async function DELETE(req : NextRequest , {params} : {params : Promise<{slug : string}>}) : Promise<NextResponse> {
    try {
        await connectDB();
        const session = await auth.api.getSession({
            headers : await headers(),
        })
        if(!session || !session.user.id){
            return NextResponse.json(
                {
                    message : "Unauthorized User , please login",
                    success : false,
                },{status : 401}
            )
        }
        const {slug} = await params;
        if(!slug){
            return NextResponse.json(
                {
                    message : "slug is required",
                    success : false,
                },{status : 400}
            )
        }
        const id = session.user.id;
        const chatWindow = await Chat.findOne({
            _id : slug,
            userId : id,
        });
        if(!chatWindow){
            return NextResponse.json({
                message : "chat window does not belongs to you",
                success : false,
            },{status : 400})
        }
        const deletedMessages = await Message.deleteMany({
            chatId : slug,
            userId : id,
        })
        if(!deletedMessages){
            return NextResponse.json({
                message : "failed to delete the messages in the chat",
                success : false
            },{status : 404})
        }
        const deletedChatWindow = await Chat.deleteOne({_id : slug , userId : id});
        if(!deletedChatWindow){
            return NextResponse.json({
                message : "Failed to delete the chat window",
                success : false,
            },{status : 400})
        }

        return NextResponse.json({
            message : "successfully deleted the chat window",
            success : true,
        })
    } catch (error) {
        console.error("Error deleting the chat window" , error);
        return NextResponse.json({
            message : "error deleting the chat window",
            success : false,
        },{status : 500})
    }
}