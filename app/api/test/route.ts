export const runtime = "nodejs";
import { gemini_response } from "@/app/helpers/gemini";
import { NextRequest , NextResponse } from "next/server";

export async function POST(req : NextRequest) {
    try {
        const body = await req.json();
        const code = body.content;
        if(!code){
            return NextResponse.json(
                {
                    message : "content is required",
                    success : false,
                },{status : 400}
            )
        }
        let optimized = "";
        const response = await gemini_response(code , (chunk)=>{
            optimized += chunk;
        })

        return NextResponse.json(
            {
                message : "generated gemini res",
                success : true,
                optimized,
                response,
            }
        )
    } catch (error) {
        console.error("error " , error);
        return NextResponse.json(
            {
                message : "Failed to gemini res",
                success : false
            },{status : 500}
        )
    }
}