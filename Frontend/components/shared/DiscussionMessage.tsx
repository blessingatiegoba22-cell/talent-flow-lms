import { cn } from "@/lib/utils";
import { Smile, MessageSquare, Paperclip, Send } from "lucide-react";

const MessageCard = ({ author, role, time, content, reactions, replies }: any) => (
  <div className="bg-card border border-border rounded-3xl p-6 shadow-sm mb-6 max-w-6xl">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-full overflow-hidden">
        <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex items-center gap-3">
        <h3 className="font-bold text-slate-900">{author.name}</h3>
        <span className={cn(
          "px-3 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
          role === "Instructor" ? "bg-indigo-50 text-indigo-600" : "bg-blue-50 text-blue-600"
        )}>
          {role}
        </span>
        <span className="text-xs font-bold text-slate-400">{time}</span>
      </div>
    </div>
    
    <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
      {content}
    </p>

    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
        <span className="text-xs">👍</span>
        <span className="text-xs font-black text-slate-700">{reactions.likes}</span>
      </div>
      {reactions.hearts && (
        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
          <span className="text-xs">❤️</span>
          <span className="text-xs font-black text-slate-700">{reactions.hearts}</span>
        </div>
      )}
      <button className="text-slate-400 hover:text-slate-600 transition-colors">
        <Smile size={18} />
      </button>
      <div className="flex items-center gap-2 text-slate-400 ml-2">
        <MessageSquare size={16} />
        <span className="text-xs font-bold">{replies} {replies > 1 ? 'replies' : 'reply'}</span>
      </div>
    </div>
  </div>
);

export default MessageCard;