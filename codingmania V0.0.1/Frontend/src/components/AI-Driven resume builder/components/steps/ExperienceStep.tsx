import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Bot } from 'lucide-react';
import { Experience } from '../../types/resume';

interface ExperienceStepProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
  onOpenAI: () => void;
}

export const ExperienceStep: React.FC<ExperienceStepProps> = ({ data, onChange, onOpenAI }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newExperience, setNewExperience] = useState<Experience>({
    id: '',
    title: '',
    company: '',
    duration: '',
    description: ''
  });

  const addExperience = () => {
    if (newExperience.title && newExperience.company && newExperience.duration) {
      const experience = { ...newExperience, id: Date.now().toString() };
      onChange([...data, experience]);
      setNewExperience({ id: '', title: '', company: '', duration: '', description: '' });
    }
  };

  const updateExperience = (id: string, updatedExperience: Experience) => {
    onChange(data.map(exp => exp.id === id ? updatedExperience : exp));
    setEditingId(null);
  };

  const deleteExperience = (id: string) => {
    onChange(data.filter(exp => exp.id !== id));
  };

  const ExperienceCard = ({ experience }: { experience: Experience }) => {
    const [editData, setEditData] = useState(experience);
    const isEditing = editingId === experience.id;

    if (isEditing) {
      return (
        <div className="bg-black border border-gray-700 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="Job Title"
            />
            <input
              type="text"
              value={editData.company}
              onChange={(e) => setEditData({ ...editData, company: e.target.value })}
              className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="Company"
            />
            <input
              type="text"
              value={editData.duration}
              onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
              className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="Duration"
            />
          </div>
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none mb-4"
            placeholder="Job Description"
          />
          <div className="flex gap-2">
            <button
              onClick={() => updateExperience(experience.id, editData)}
              className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="flex items-center px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-black border border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-medium text-white">{experience.title}</h4>
            <p className="text-gray-400">{experience.company}</p>
            <p className="text-sm text-gray-500 mt-1">{experience.duration}</p>
            {experience.description && (
              <p className="text-gray-300 mt-2">{experience.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditingId(experience.id)}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteExperience(experience.id)}
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
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Describe your experience</h3>
              <p className="text-sm text-gray-400">Let AI help format your work experience professionally</p>
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

      {/* Add New Experience */}
      <div className="bg-black border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Add Experience</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            value={newExperience.title}
            onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
            className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="Job Title (e.g., Software Developer Intern)"
          />
          <input
            type="text"
            value={newExperience.company}
            onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
            className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="Company Name"
          />
          <input
            type="text"
            value={newExperience.duration}
            onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
            className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="Duration (e.g., Jun 2023 - Aug 2023)"
          />
        </div>
        <textarea
          value={newExperience.description}
          onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none mb-4"
          placeholder="Describe your role and achievements..."
        />
        <button
          onClick={addExperience}
          disabled={!newExperience.title || !newExperience.company || !newExperience.duration}
          className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </button>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {data.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No experience added yet. Add your work experience above!</p>
          <p className="text-sm mt-1 text-gray-600">If you don't have work experience, you can skip this section.</p>
        </div>
      )}
    </div>
  );
};
