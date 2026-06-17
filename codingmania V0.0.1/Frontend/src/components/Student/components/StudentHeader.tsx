import { GraduationCap, Menu, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StudentHeaderProps {
  onMenuClick: () => void;
}

const StudentHeader = ({ onMenuClick }: StudentHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between lg:hidden">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-xl">
          <GraduationCap className="w-5 h-5 text-blue-600" />
        </div>
        <span className="font-bold text-gray-900">Student Portal</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onMenuClick}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default StudentHeader;
