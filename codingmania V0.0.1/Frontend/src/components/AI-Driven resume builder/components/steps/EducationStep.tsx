import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Bot } from 'lucide-react';
import { Education } from '../../types/resume';

interface EducationStepProps {
  data: Education[];
  onChange: (data: Education[]) => void;
  onOpenAI: () => void;
}

export const EducationStep: React.FC<EducationStepProps> = ({ data, onChange, onOpenAI }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEducation, setNewEducation] = useState<Education>({
    id: '',
    degree: '',
    institution: '',
    year: '',
    percentage: ''
  });

  const addEducation = () => {
    if (newEducation.degree && newEducation.institution && newEducation.year) {
      const education = { ...newEducation, id: Date.now().toString() };
      onChange([...data, education]);
      setNewEducation({ id: '', degree: '', institution: '', year: '', percentage: '' });
    }
  };

  const updateEducation = (id: string, updatedEducation: Education) => {
    onChange(data.map(edu => edu.id === id ? updatedEducation : edu));
    setEditingId(null);
  };

  const deleteEducation = (id: string) => {
    onChange(data.filter(edu => edu.id !== id));
  };

  const EducationCard = ({ education }: { education: Education }) => {
    const [editData, setEditData] = useState(education);
    const isEditing = editingId === education.id;

    if (isEditing) {
      return (
        <div className="bg-black border border-gray-700 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-white mb-4">Edit Education</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
            <input
              type="text"
              value={editData.degree}
              onChange={(e) => setEditData({ ...editData, degree: e.target.value })}
              className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="Degree"
            />
            <input
              type="text"
              value={editData.institution}
              onChange={(e) => setEditData({ ...editData, institution: e.target.value })}
              className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="Institution"
            />
            <input
              type="text"
              value={editData.year}
              onChange={(e) => setEditData({ ...editData, year: e.target.value })}
              className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="Year"
            />
            <input
              type="text"
              value={editData.percentage || ''}
              onChange={(e) => setEditData({ ...editData, percentage: e.target.value })}
              className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="Percentage/CGPA (optional)"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => updateEducation(education.id, editData)}
              className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="flex items-center px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-black border border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-semibold text-white">{education.degree}</h4>
            <p className="text-gray-400">{education.institution}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>{education.year}</span>
              {education.percentage && <span>{education.percentage}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditingId(education.id)}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteEducation(education.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 bg-black min-h-screen py-6 px-4 rounded-lg">
      {/* AI Assistant Button */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-600 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Generate education details</h3>
              <p className="text-sm text-gray-400">Tell AI about your educational background</p>
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

      {/* Add New Education */}
      <div className="bg-black border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Add Education</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            value={newEducation.degree}
            onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
            className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="Degree (e.g., B.Tech in Computer Science)"
          />
          <input
            type="text"
            value={newEducation.institution}
            onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
            className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="Institution Name"
          />
          <input
            type="text"
            value={newEducation.year}
            onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
            className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="Year (e.g., 2024 or 2020-2024)"
          />
          <input
            type="text"
            value={newEducation.percentage || ''}
            onChange={(e) => setNewEducation({ ...newEducation, percentage: e.target.value })}
            className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="Percentage/CGPA (optional)"
          />
        </div>
        <button
          onClick={addEducation}
          disabled={!newEducation.degree || !newEducation.institution || !newEducation.year}
          className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </button>
      </div>

      {/* Education List */}
      <div className="space-y-4">
        {data.map((education) => (
          <EducationCard key={education.id} education={education} />
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No education added yet. Add your educational background above!</p>
        </div>
      )}
    </div>
  );
};
