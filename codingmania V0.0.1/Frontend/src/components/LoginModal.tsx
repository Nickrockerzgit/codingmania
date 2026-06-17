import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { User, X, GraduationCap } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal = ({ onClose }: LoginModalProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex min-h-screen items-center justify-center p-4" onClick={onClose}>
      <div 
        className="relative z-10 bg-[#0a0a0a] border border-red-600/30 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-red-900/20"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Select your login type to continue</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => { onClose(); navigate('/auth'); }}
            className="w-full group flex items-center gap-4 p-5 bg-[#1a1a1a] hover:bg-[#222] border border-gray-800 hover:border-blue-500/50 rounded-xl transition-all duration-300 text-left"
          >
            <div className="p-3 bg-blue-600/20 rounded-lg group-hover:bg-blue-600/30 transition-colors">
              <User className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                Student / Member
              </h3>
              <p className="text-sm text-gray-500">
                Login as a team member or participant
              </p>
            </div>
          </button>

          <button
            onClick={() => { onClose(); navigate('/'); }}
            className="w-full group flex items-center gap-4 p-5 bg-[#1a1a1a] hover:bg-[#222] border border-gray-800 hover:border-purple-500/50 rounded-xl transition-all duration-300 text-left"
          >
            <div className="p-3 bg-purple-600/20 rounded-lg group-hover:bg-purple-600/30 transition-colors">
              <GraduationCap className="w-6 h-6 text-purple-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                Alumni
              </h3>
              <p className="text-sm text-gray-500">
                Browse the main site experience
              </p>
            </div>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Not a member yet?{' '}
            <button 
              onClick={() => { onClose(); navigate('/joinus'); }}
              className="text-red-500 hover:text-red-400 underline"
            >
              Join us
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
