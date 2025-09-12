import { NextResponse , NextRequest } from "next/server";
import { Chat } from "@/app/model/Chat";
import { Message } from "@/app/model/Messages";
import { connectDB } from "@/app/lib/db";
import {auth} from "@/lib/auth";
import { headers } from "next/headers";
import { ContentMessage } from "@/app/types/addMessage";

export async function PATCH(req : NextRequest , {params} : {params : Promise<{slug : string}>}) : Promise<NextResponse> {
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
        const body : ContentMessage = await req.json();
        const {content} = body;
        if(!content || content.trim().length === 0){
            return NextResponse.json(
                {
                    message : "content is invalid",
                    success : false,
                },{status : 400}
            )
        }
        const {slug} = await params;
        if(!slug){
            return NextResponse.json(
                {
                    message : "slug is required to edit message",
                    success : false
                },{status : 400}
            )
        }
        const id = session.user.id;
        const message = await Message.findOne({
            userId : id,
            _id : slug
        });
        if(!message){
            return NextResponse.json(
                {
                    message : "message not found",
                    success : false,
                },{status : 400}
            )
        }
        const editedMessage = await Message.findByIdAndUpdate(slug , {
            $set : {
                content,
            }
        },{new : true , runValidators : true});
        if(!editedMessage){
             return NextResponse.json(
                {
                    message : "failed to edit the message",
                    success : false,
                },{status : 400}
            )
        }
        return NextResponse.json(
            {
                message : "message edited successfully",
                success : true,
            },{status : 200}
        )
    } catch (error) {
        console.error("error while editing the message" , error);
        return NextResponse.json(
            {
                message : "error editing the message",
                success : false,
            },{status : 500}
        )
    }
}