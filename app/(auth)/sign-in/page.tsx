"use client";
import { authClient } from "@/lib/auth-client";
import React from "react";


const SignIn = ()=>{
    const SignInWithGoogle = async ()=>{
        await authClient.signIn.social({
            provider : 'google',
            callbackURL : "/chat-page",
        })
    }

    const SignInWithGitHub = async ()=>{
        await authClient.signIn.social({
            provider : 'github',
            callbackURL : "/chat-page",
        })
    }

    return (
        <div className="flex items-center justify-center">
            <button onClick={SignInWithGoogle}>Sign In With Google</button>
            <br/>
             <br/>
            <button onClick={SignInWithGitHub}>Sign In With Github</button>
        </div>
    )
}

export default SignIn;