import { GraduationCap, Menu, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AlumniHeaderProps {
  onMenuClick: () => void;
}

const AlumniHeader = ({ onMenuClick }: AlumniHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#0a0a0a] border-b border-white/10 px-6 py-4 flex items-center justify-between lg:hidden">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-500/10 rounded-xl">
          <GraduationCap className="w-5 h-5 text-red-400" />
        </div>
        <span className="font-bold text-white">Alumni Portal</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg font-medium transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onMenuClick}
          className="p-2 text-gray-300 hover:bg-white/10 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default AlumniHeader;