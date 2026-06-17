import  { useState, useEffect } from 'react';
import { FileUp as FileUser, Download, Save, Eye, Edit, Palette } from 'lucide-react';
import { FormStep } from './components/FormStep';
import { AIAssistant } from './components/AIAssistant';
import { PersonalInfoStep } from './components/steps/PersonalInfoStep';
import { SkillsStep } from './components/steps/SkillsStep';
import { EducationStep } from './components/steps/EducationStep';
import { ExperienceStep } from './components/steps/ExperienceStep';
import { ProjectsStep } from './components/steps/ProjectsStep';
import { AdditionalStep } from './components/steps/AdditionalStep';
import { ResumePreview } from './components/ResumePreview';
import { TemplateSelector } from './components/TemplateSelector';
import { ResumeData, Template } from './types/resume';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/localStorage';
import { downloadAsPDF } from './utils/pdfExport';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [viewMode, setViewMode] = useState<'form' | 'preview' | 'template'>('form');
  const [selectedTemplate, setSelectedTemplate] = useState<Template>('modern');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiSection, setAiSection] = useState('');
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      professionalSummary: ''
    },
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    achievements: [],
    socialLinks: {
      github: '',
      linkedin: '',
      portfolio: ''
    }
  });

  // Load saved data on component mount
  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      setResumeData(savedData);
    }
  }, []);

  // Auto-save data when it changes
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToLocalStorage(resumeData);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resumeData]);

  const totalSteps = 6;

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(resumeData.personalInfo.fullName && 
                 resumeData.personalInfo.email && 
                 resumeData.personalInfo.phone && 
                 resumeData.personalInfo.location && 
                 resumeData.personalInfo.professionalSummary);
      case 2:
        return resumeData.skills.length > 0;
      case 3:
        return resumeData.education.length > 0;
      case 4:
        return true; // Experience is optional
      case 5:
        return resumeData.projects.length > 0;
      case 6:
        return !!(resumeData.socialLinks.github && resumeData.socialLinks.linkedin);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDownload = () => {
    downloadAsPDF(resumeData, selectedTemplate);
  };

  const handleOpenAI = (section: string) => {
    setAiSection(section);
    setShowAIAssistant(true);
  };

  const handleAIContentGenerated = (content: any) => {
    switch (aiSection) {
      case 'personalInfo':
        setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, ...content } });
        break;
      case 'skills':
        setResumeData({ ...resumeData, skills: [...resumeData.skills, ...content] });
        break;
      case 'education':
        setResumeData({ ...resumeData, education: [...resumeData.education, ...content] });
        break;
      case 'experience':
        setResumeData({ ...resumeData, experience: [...resumeData.experience, ...content] });
        break;
      case 'projects':
        setResumeData({ ...resumeData, projects: [...resumeData.projects, ...content] });
        break;
      case 'additional':
        setResumeData({ 
          ...resumeData, 
          certifications: [...resumeData.certifications, ...content.certifications],
          achievements: [...resumeData.achievements, ...content.achievements]
        });
        break;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={resumeData.personalInfo}
            onChange={(data) => setResumeData({ ...resumeData, personalInfo: data })}
            onOpenAI={() => handleOpenAI('personalInfo')}
          />
        );
      case 2:
        return (
          <SkillsStep
            data={resumeData.skills}
            onChange={(data) => setResumeData({ ...resumeData, skills: data })}
            onOpenAI={() => handleOpenAI('skills')}
          />
        );
      case 3:
        return (
          <EducationStep
            data={resumeData.education}
            onChange={(data) => setResumeData({ ...resumeData, education: data })}
            onOpenAI={() => handleOpenAI('education')}
          />
        );
      case 4:
        return (
          <ExperienceStep
            data={resumeData.experience}
            onChange={(data) => setResumeData({ ...resumeData, experience: data })}
            onOpenAI={() => handleOpenAI('experience')}
          />
        );
      case 5:
        return (
          <ProjectsStep
            data={resumeData.projects}
            onChange={(data) => setResumeData({ ...resumeData, projects: data })}
            onOpenAI={() => handleOpenAI('projects')}
          />
        );
      case 6:
        return (
          <AdditionalStep
            certifications={resumeData.certifications}
            achievements={resumeData.achievements}
            socialLinks={resumeData.socialLinks}
            onCertificationsChange={(data) => setResumeData({ ...resumeData, certifications: data })}
            onAchievementsChange={(data) => setResumeData({ ...resumeData, achievements: data })}
            onSocialLinksChange={(data) => setResumeData({ ...resumeData, socialLinks: data })}
            onOpenAI={() => handleOpenAI('additional')}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    const titles = [
      'Personal Information',
      'Skills & Expertise',
      'Education Background',
      'Work Experience',
      'Projects Portfolio',
      'Additional Information'
    ];
    return titles[currentStep - 1];
  };

  const getStepDescription = () => {
    const descriptions = [
      'Let\'s start with your basic information and professional summary.',
      'Add your technical skills, tools, and soft skills.',
      'Tell us about your educational background.',
      'Add your work experience and internships.',
      'Showcase your projects and achievements.',
      'Add certifications, achievements, and social links.'
    ];
    return descriptions[currentStep - 1];
  };

  if (viewMode === 'preview') {
    return (
      <div className="min-h-screen bg-gray-950 pt-20">
        {/* Header */}
        <div className="bg-black shadow-sm  ">
          <div className=" mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <FileUser className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600" />
                <h1 className="text-lg sm:text-xl font-bold text-gray-50">AI Resume Builder</h1>
              </div>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setViewMode('template')}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
                >
                  <Palette className="w-4 h-4" />
                  <span className="hidden sm:inline">Change Template</span>
                  <span className="sm:hidden">Template</span>
                </button>
                <button
                  onClick={() => setViewMode('form')}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-gray-300 text-back rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Resume</span>
                  <span className="sm:hidden">Edit</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download PDF</span>
                  <span className="sm:hidden">Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="px-2 sm:px-4">
          <ResumePreview data={resumeData} template={selectedTemplate} />
        </div>
      </div>
    );
  }

  if (viewMode === 'template') {
    return (
     <div className="min-h-screen bg-gray-950 pt-20">
        {/* Header */}
        <div className="bg-gray-950 shadow-sm  ">
          <div className=" mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <FileUser className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600" />
                <h1 className="text-lg sm:text-xl font-bold text-gray-50">AI Resume Builder</h1>
              </div>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setViewMode('preview')}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Preview Resume</span>
                  <span className="sm:hidden">Preview</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Template Selector */}
        <div className="max-w-6xl mx-auto p-3 sm:p-6">
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onTemplateChange={setSelectedTemplate}
          />
        </div>
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-gray-950 pt-20">
        {/* Header */}
        <div className="bg-gray-950 shadow-sm  ">
        <div className=" mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <FileUser className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-50">AI Resume Builder</h1>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => saveToLocalStorage(resumeData)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save Progress</span>
                <span className="sm:hidden">Save</span>
              </button>
              <button
                onClick={() => setViewMode('preview')}
                disabled={!isStepValid(1)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview Resume</span>
                <span className="sm:hidden">Preview</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-4 sm:py-8">
        <FormStep
          title={getStepTitle()}
          description={getStepDescription()}
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={currentStep < totalSteps ? handleNext : undefined}
          onPrev={handlePrev}
          nextDisabled={!isStepValid(currentStep)}
        >
          {renderCurrentStep()}
        </FormStep>

        {/* Completion Message */}
        {currentStep === totalSteps && isStepValid(currentStep) && (
         <div className="max-w-4xl mx-auto mt-6 sm:mt-8 p-4 sm:p-6 bg-gray-900 border border-green-600 rounded-lg mx-4 sm:mx-auto shadow-md">
  <div className="text-center">
    <h3 className="text-base sm:text-lg font-semibold text-green-400 mb-2">
      🎉 Congratulations! Your resume is ready!
    </h3>
    <p className="text-green-300 mb-4 text-sm sm:text-base">
      You've completed all the required sections. You can now preview your resume, choose a template, and download it.
    </p>
    <button
      onClick={() => setViewMode('preview')}
      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
    >
      <Eye className="w-5 h-5" />
      View Your Resume
    </button>
  </div>
</div>

        )}
      </div>

      {/* AI Assistant Modal */}
      <AIAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        onContentGenerated={handleAIContentGenerated}
        currentSection={aiSection}
      />
    </div>
  );
}

export default App;