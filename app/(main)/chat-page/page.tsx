
"use client";
import React, { useState, useEffect } from 'react';
import ChatBox from '@/components/Chat';
import { useRouter } from "next/navigation";
import { authClient, ClientSession } from '@/lib/auth-client';
export const dynamic = "force-dynamic";

const ChatPage = () => {
  const [session, setSession] = useState<ClientSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: sessionData } = await authClient.getSession();
        setSession(sessionData);
      } catch (error) {
        console.error('Error fetching session:', error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-[#0A0A0B] text-[#E5E7EB]">Loading...</div>;
  }

  if (!session) {
    router.push('/'); 
    return null;
  }

  return (
    <div className="h-screen bg-[#0A0A0B] text-[#E5E7EB] flex items-center justify-center">
      <ChatBox />
    </div>
  );
};

export default ChatPage;