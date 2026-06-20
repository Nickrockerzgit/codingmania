import ChatLayout from "../../Chat/ChatLayout";
import { useSearchParams } from "react-router-dom";
import { MessageSquare } from "lucide-react";

const AlumniMessages = () => {
  const [searchParams] = useSearchParams();
  const initialTargetUserId =
    searchParams.get("targetUserId") || searchParams.get("userId");

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10"
      >
        <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-red-400 font-semibold">
              Communication
            </span>
            <h3 className="text-base font-bold text-white leading-none">Messages</h3>
          </div>
        </div>
        <div className="h-[calc(100vh-16rem)] min-h-[400px] p-4">
          <ChatLayout initialTargetUserId={initialTargetUserId} />
        </div>
      </div>
    </div>
  );
};

export default AlumniMessages;
