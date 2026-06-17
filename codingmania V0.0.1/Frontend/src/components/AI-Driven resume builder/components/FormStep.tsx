import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface FormStepProps {
  title: string;
  description: string;
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onPrev?: () => void;
  nextDisabled?: boolean;
}

export const FormStep: React.FC<FormStepProps> = ({
  title,
  description,
  children,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  nextDisabled = false
}) => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-black min-h-screen text-white">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <span className="text-sm font-medium text-gray-300">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-blue-400">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-400 text-sm sm:text-base">{description}</p>
      </div>

      {/* Content */}
      <div className="mb-8">
        {children}
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={onPrev}
          disabled={currentStep === 1}
          className="flex items-center justify-center px-6 py-3 text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors order-2 sm:order-1"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </button>

        {onNext && (
          <button
            onClick={onNext}
            disabled={nextDisabled}
            className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all order-1 sm:order-2"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};
