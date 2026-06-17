import React from 'react';
import { Template } from '../types/resume';

interface TemplateSelectorProps {
  selectedTemplate: Template;
  onTemplateChange: (template: Template) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange
}) => {
  const templates = [
    {
      id: 'modern' as Template,
      name: 'Modern',
      description: 'Clean design with gradient header and organized layout',
      preview: 'bg-gradient-to-r from-blue-500 to-purple-600'
    },
    {
      id: 'classic' as Template,
      name: 'Classic',
      description: 'Traditional professional format with clean typography',
      preview: 'bg-gray-800'
    },
    {
      id: 'creative' as Template,
      name: 'Creative',
      description: 'Colorful sidebar design perfect for creative roles',
      preview: 'bg-gradient-to-b from-purple-500 to-pink-600'
    },
    {
      id: 'minimal' as Template,
      name: 'Minimal',
      description: 'Simple, elegant design focusing on content',
      preview: 'bg-gray-200 border border-gray-400'
    }
  ];

  return (
    <div className="bg-black rounded-lg p-4 sm:p-6 shadow-lg">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Choose Template</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            className={`p-3 sm:p-4 rounded-lg border transition-all text-left ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-900/30'
                : 'border-gray-600 hover:border-blue-400 hover:bg-white/5'
            }`}
          >
            <div className={`w-full h-16 sm:h-20 rounded ${template.preview} mb-2 sm:mb-3`}></div>
            <h4 className="font-semibold text-white mb-1 text-sm sm:text-base">{template.name}</h4>
            <p className="text-xs sm:text-sm text-gray-300">{template.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
