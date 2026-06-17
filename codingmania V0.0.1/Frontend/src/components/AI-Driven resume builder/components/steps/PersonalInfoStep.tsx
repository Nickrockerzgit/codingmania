// import React from 'react';
// import { Bot } from 'lucide-react';
// import { PersonalInfo } from '../../types/resume';

// interface PersonalInfoStepProps {
//   data: PersonalInfo;
//   onChange: (data: PersonalInfo) => void;
//   onOpenAI: () => void;
// }

// export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ data, onChange, onOpenAI }) => {
//   const handleChange = (field: keyof PersonalInfo, value: string) => {
//     onChange({ ...data, [field]: value });
//   };

//   return (
//     <div className="space-y-6 bg-black min-h-screen py-6 px-4 rounded-lg">
//       {/* AI Assistant Button */}
//       <div className="bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-700 rounded-lg p-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//               <Bot className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h3 className="font-semibold text-white">Need help with content?</h3>
//               <p className="text-sm text-gray-400">Let AI generate your personal information and summary</p>
//             </div>
//           </div>
//           <button
//             onClick={onOpenAI}
//             className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-sm font-medium"
//           >
//             Try AI Assistant
//           </button>
//         </div>
//       </div>

//       {/* Input Fields */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//         <div className="lg:col-span-2">
//           <label className="block text-sm font-medium text-gray-300 mb-2">
//             Full Name *
//           </label>
//           <input
//             type="text"
//             value={data.fullName}
//             onChange={(e) => handleChange('fullName', e.target.value)}
//             className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
//             placeholder="Enter your full name"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-2">
//             Email Address *
//           </label>
//           <input
//             type="email"
//             value={data.email}
//             onChange={(e) => handleChange('email', e.target.value)}
//             className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
//             placeholder="your.email@example.com"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-2">
//             Phone Number *
//           </label>
//           <input
//             type="tel"
//             value={data.phone}
//             onChange={(e) => handleChange('phone', e.target.value)}
//             className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
//             placeholder="+91 9876543210"
//           />
//         </div>

//         <div className="lg:col-span-2">
//           <label className="block text-sm font-medium text-gray-300 mb-2">
//             Location *
//           </label>
//           <input
//             type="text"
//             value={data.location}
//             onChange={(e) => handleChange('location', e.target.value)}
//             className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
//             placeholder="City, State, Country"
//           />
//         </div>

//         <div className="lg:col-span-2">
//           <label className="block text-sm font-medium text-gray-300 mb-2">
//             Professional Summary *
//           </label>
//           <textarea
//             value={data.professionalSummary}
//             onChange={(e) => handleChange('professionalSummary', e.target.value)}
//             rows={4}
//             className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none"
//             placeholder="Write a 2-3 line summary highlighting your core technical skills and career goals..."
//           />
//           <p className="text-xs sm:text-sm text-gray-500 mt-1">
//             Focus on your technical expertise and what you're looking to achieve in your career.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };












// components/steps/PersonalInfoStep.tsx
import React from 'react';
import { Bot } from 'lucide-react';
import { PersonalInfo } from '../../types/resume';

interface PersonalInfoStepProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  onOpenAI: () => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ data, onChange, onOpenAI }) => {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 bg-black min-h-screen py-6 px-4 rounded-lg">
      {/* AI Assistant */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Need help with content?</h3>
              <p className="text-sm text-gray-400">Let AI generate your personal information and summary</p>
            </div>
          </div>
          <button
            onClick={onOpenAI}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-sm font-medium"
          >
            Try AI Assistant
          </button>
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg"
            placeholder="+91 9876543210"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg"
            placeholder="City, State, Country"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Professional Summary *</label>
          <textarea
            value={data.professionalSummary}
            onChange={(e) => handleChange('professionalSummary', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg"
            placeholder="Write your 2-3 line professional summary"
          />
        </div>
      </div>
    </div>
  );
};
