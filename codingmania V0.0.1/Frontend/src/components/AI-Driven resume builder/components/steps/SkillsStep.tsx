import React, { useState } from 'react';
import { Plus, X, Bot } from 'lucide-react';
import { Skill } from '../../types/resume';

interface SkillsStepProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
  onOpenAI: () => void;
}

export const SkillsStep: React.FC<SkillsStepProps> = ({ data, onChange, onOpenAI }) => {
  const [newSkill, setNewSkill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'technical' | 'soft' | 'tools'>('technical');

  const addSkill = () => {
    if (newSkill.trim()) {
      onChange([...data, { name: newSkill.trim(), category: selectedCategory }]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const skillsByCategory = {
    technical: data.filter(skill => skill.category === 'technical'),
    tools: data.filter(skill => skill.category === 'tools'),
    soft: data.filter(skill => skill.category === 'soft')
  };

  const SkillCategory = ({ title, skills, category }: { title: string; skills: Skill[]; category: string }) => (
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
      <h4 className="font-semibold text-white mb-3">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => {
          const globalIndex = data.findIndex(s => s.name === skill.name && s.category === skill.category);
          return (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-blue-900 text-blue-300 rounded-full text-sm"
            >
              {skill.name}
              <button
                onClick={() => removeSkill(globalIndex)}
                className="ml-2 p-0.5 hover:bg-blue-800 rounded-full"
              >
                <X className="w-3 h-3 text-blue-300" />
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 bg-black min-h-screen p-6 rounded-lg">
      {/* AI Assistant Button */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Let AI suggest your skills</h3>
              <p className="text-sm text-gray-400">Describe your technical background and get skill recommendations</p>
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

      {/* Add New Skill */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Add Skills</h3>
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm sm:text-base"
              placeholder="Enter a skill (e.g., React, JavaScript, Problem Solving)"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as 'technical' | 'soft' | 'tools')}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="technical">Technical</option>
              <option value="tools">Tools</option>
              <option value="soft">Soft Skills</option>
            </select>
            <button
              onClick={addSkill}
              className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Skills Display */}
      <div className="space-y-4">
        <SkillCategory 
          title="Technical Skills" 
          skills={skillsByCategory.technical} 
          category="technical"
        />
        <SkillCategory 
          title="Tools & Technologies" 
          skills={skillsByCategory.tools} 
          category="tools"
        />
        <SkillCategory 
          title="Soft Skills" 
          skills={skillsByCategory.soft} 
          category="soft"
        />
      </div>

      {data.length === 0 && (
        <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
          <p>No skills added yet. Add your first skill above!</p>
        </div>
      )}
    </div>
  );
};
