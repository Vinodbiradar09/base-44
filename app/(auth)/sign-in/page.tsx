"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { authClient } from '@/lib/auth-client';

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
            <Button onClick={SignInWithGoogle}>Sign In With Google</Button>
            <br/>
             <br/>
            <Button onClick={SignInWithGitHub}>Sign In With Github</Button>
        </div>
    )
}

export default SignIn;