"use client"
import { Input } from '@/components/ui/input'
import React, { useState , useEffect } from 'react'
import {Send} from "lucide-react";
import { Button } from '@/components/ui/button';
import ChatBox from '@/components/Chat';
import { API } from "@/app/types/Api";
import { useRouter } from "next/navigation";
import { authClient , ClientSession } from '@/lib/auth-client';


const ChatPage = () => {
  const [session, setSession] = useState<ClientSession>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
   const checkSession = async()=>{
    try {
      const {data : sessionData } = await authClient.getSession();
      setSession(sessionData);
    } catch (error) {
      console.error('Error fetching session:', error);
      setSession(null);
    } finally{
      setLoading(false);
    }
   }
   checkSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }
  
  return (
   <div>
    <ChatBox />
   </div>
  )
}

export default ChatPage
