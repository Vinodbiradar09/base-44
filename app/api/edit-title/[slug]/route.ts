export const runtime = "nodejs";
import { connectDB } from "@/app/lib/db";
import { Chat } from "@/app/model/Chat";
import { NextRequest , NextResponse } from "next/server";
import {auth} from "@/lib/auth";
import { headers } from "next/headers";
import { TitleMessage } from "@/app/types/addMessage";

export async function  PATCH(req : NextRequest , {params} : {params : Promise<{slug : string}>}) : Promise<NextResponse> {
    try {
        await connectDB();
        const session = await auth.api.getSession({
            headers : await headers(),
        });
        if(!session || !session.user.id){
            return NextResponse.json({
                message : "Unauthorized user , please login",
                success : false,
            },{status : 401})
        }
        const {slug} = await params;
        if(!slug){
            return NextResponse.json(
                {
                    message : "slug is required to update the title",
                    success : false,
                },{status : 400}
            )
        }
        const body : TitleMessage = await req.json();
        const {title} = body;
        if(!title || title.trim().length === 0){
            return NextResponse.json(
                {
                    message : "New title is required to update title",
                    success : false,
                },{status : 400}
            )
        }
        const id = session.user.id;
        const chat = await Chat.findOne({
            _id : slug,
            userId : id,
        });
        if(!chat){
            return NextResponse.json(
                {
                    message : "Chat window not found to update the title",
                    success : false,
                },{status : 400}
            )
        }
        chat.title = title;
        await chat.save();

        return NextResponse.json({
            message : "successfully updated the chat window title",
            success : true,
        },{status : 200})
    } catch (error) {
        console.error("error while updating the title" , error);
        return NextResponse.json(
            {
                message : "Error while updating the title",
                success : false,
            },{status : 500}
        )
    }
}