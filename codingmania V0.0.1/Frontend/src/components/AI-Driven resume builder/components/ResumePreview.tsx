import React from 'react';
import { ResumeData, Template } from '../types/resume';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';

interface ResumePreviewProps {
  data: ResumeData;
  template: Template;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template }) => {
  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate data={data}  />;
      case 'classic':
        return <ClassicTemplate data={data}  />;
      case 'creative':
        return <CreativeTemplate data={data}  />;
      case 'minimal':
        return <MinimalTemplate data={data}  />;
      default:
        return <ModernTemplate data={data}  />;
    }
  };

  return (
    <div className="bg-black p-2 sm:p-4 min-h-screen text-white">
      <div className="transform scale-75 sm:scale-90 origin-top">
        {renderTemplate()}
      </div>
    </div>
  );
};
