import ChatLayout from "../../Chat/ChatLayout";
import { useSearchParams } from "react-router-dom";
import { MessageSquare } from "lucide-react";

interface StudentMessagesProps {
  targetUserId?: string | null;
}

const StudentMessages = ({ targetUserId: propTargetUserId }: StudentMessagesProps) => {
  const [searchParams] = useSearchParams();
  const urlTargetUserId = searchParams.get("targetUserId") || searchParams.get("userId");
  const initialTargetUserId = propTargetUserId || urlTargetUserId;

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.8)",
        }}
      >
        <div className="px-6 py-4 border-b border-gray-100/60 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-indigo-500 font-semibold">
              Communication
            </span>
            <h3 className="text-base font-bold text-gray-900 leading-none">Messages</h3>
          </div>
        </div>
        <div className="h-[calc(100vh-16rem)] min-h-[400px] p-4">
          <ChatLayout initialTargetUserId={initialTargetUserId} />
        </div>
      </div>
    </div>
  );
};

export default StudentMessages;
