"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios , {AxiosError} from "axios";
import { API } from "@/app/types/Api";
export default function ChatBox() {
    const [content , setContent] = useState<string>("");
    const [loading , setLoading] = useState<boolean>(false);
    const [isChatId , setIsChatId] = useState<string>("");
    const [error , setError] = useState<string | null>(null);
    const [response , setResponse] = useState<string>("");
    const [metadata, setMetadata] = useState(null);

    const handleSubmit = async ()=>{
        setLoading(false);
        setError(null);
        setResponse('');
        setMetadata(null);

        try {
           const res = await axios.post("/api/first-chat-window",{
            content , isChatId
           });
           if(!res.data.success){
            const errorData = res.data.message
            console.log("error" , errorData);
            setError(errorData);
           } 
           if(res.data.success){
            console.log("response structure" , res.data.optimized)
           }

        } catch (error) {
            console.error('Error streaming response:', error);
            setError("error chat window");
        }finally {
            setLoading(false);
        }
    }

  return (
    <div className="flex flex-col h-full">
    
      <div className="p-4 border-b font-semibold">Chat with AI</div>

    
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
       
      </div>

    
      <div className="p-4 border-t flex items-center gap-2">
        <Input
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button onClick={handleSubmit}>
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}
