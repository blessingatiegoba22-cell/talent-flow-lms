"use client";

import { useState, useRef, useMemo } from "react";
import MessageCard from "@/components/shared/DiscussionMessage";
import ParticipantItem from "@/components/shared/ParticipantList";
import { Paperclip, Send, Smile, Image as ImageIcon, X } from "lucide-react";
import EmojiPicker, { Theme } from 'emoji-picker-react';

const INITIAL_PARTICIPANTS = [
  { name: "Jessica Obasi", role: "Instructor", status: "online", avatar: "https://i.pravatar.cc/150?u=jess" },
  { name: "Ayankola Precious", role: "Student", status: "online", avatar: "https://i.pravatar.cc/150?u=pre" },
  { name: "Eze Emmanuel", role: "Student", status: "away", avatar: "https://i.pravatar.cc/150?u=eze" },
  { name: "Lawal Praise", role: "Student", status: "online", avatar: "https://i.pravatar.cc/150?u=law" },
];

export default function DiscussionPage() {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredParticipants = useMemo(() => {
    return INITIAL_PARTICIPANTS.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const onEmojiClick = (emojiData: any) => {
    setMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="max-w-9xl mx-auto p-6 lg:p-10 flex flex-col lg:flex-row gap-10">
      
      <div className="flex-1 flex flex-col h-[calc(100vh-140px)]">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Discussion</h1>
          <p className="text-slate-400 font-bold text-sm mt-1">Team discussions and updates</p>
        </header>

        <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide space-y-2">
          <MessageCard author={{ name: "Jessica Obasi", avatar: "https://i.pravatar.cc/150?u=jessica" }} role="Instructor" time="10:30 AM" content="Welcome everyone! 🚀" reactions={{ likes: 12, hearts: 8 }} replies={3} />

        </div>

        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-3xl p-4 relative">
          
          {attachedFile && (
            <div className="mb-2 flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 w-fit">
              <span className="text-xs font-bold truncate max-w-[200px]">{attachedFile.name}</span>
              <button onClick={() => setAttachedFile(null)} className="text-red-500 hover:bg-red-50 rounded-full p-1">
                <X size={14} />
              </button>
            </div>
          )}

          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none outline-none text-sm font-medium placeholder:text-slate-400 resize-none h-24"
          />

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 text-slate-400 relative">
              
              <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                <Smile size={20} />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-12 left-0 z-50">
                  <EmojiPicker onEmojiClick={onEmojiClick} theme={Theme.LIGHT} />
                </div>
              )}

              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                <Paperclip size={20} />
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                <ImageIcon size={20} />
              </button>
            </div>

            <button className="bg-brand-blue-600 p-3 rounded-full text-white hover:bg-brand-blue-700 shadow-lg active:scale-95 transition-all">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      <aside className="w-full lg:w-80 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 mb-4">Participants</h2>

        <div className="relative mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search members..."
            className="w-full bg-slate-100 border-none rounded-xl py-3 pl-4 text-xs font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-brand-blue-500/20 outline-none"
          />
        </div>

        <div className="space-y-1 overflow-y-auto max-h-[600px] pr-2">
          {filteredParticipants.length > 0 ? (
            filteredParticipants.map((p, i) => (
              <ParticipantItem key={i} user={p} />
            ))
          ) : (
            <p className="text-xs font-bold text-slate-400 text-center py-4 uppercase">No members found</p>
          )}
        </div>
      </aside>
    </div>
  );
}