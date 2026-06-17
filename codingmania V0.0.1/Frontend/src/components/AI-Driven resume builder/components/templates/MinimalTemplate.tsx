import React from 'react';
import { ResumeData } from '../../types/resume';

interface MinimalTemplateProps {
  data: ResumeData;
}

export const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ data }) => {
  const { personalInfo, skills, education, experience, projects, certifications, achievements, socialLinks } = data;

  return (
    <div className="bg-white max-w-4xl mx-auto p-8 font-light">
      {/* Header */}
      <header className="text-center mb-12 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-wide">{personalInfo.fullName}</h1>
        <div className="flex justify-center items-center gap-8 text-sm text-gray-600 mb-4">
          <span>{personalInfo.email}</span>
          <span>•</span>
          <span>{personalInfo.phone}</span>
          <span>•</span>
          <span>{personalInfo.location}</span>
        </div>
        <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">{personalInfo.professionalSummary}</p>
      </header>

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-light text-gray-900 mb-6 tracking-wide">EXPERIENCE</h2>
          <div className="space-y-8">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{exp.title}</h3>
                    <p className="text-gray-700">{exp.company}</p>
                  </div>
                  <span className="text-gray-600 text-sm">{exp.duration}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-light text-gray-900 mb-6 tracking-wide">PROJECTS</h2>
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id}>
                <h3 className="text-lg font-medium text-gray-900 mb-1">{project.name}</h3>
                <p className="text-gray-700 leading-relaxed mb-2">{project.description}</p>
                <p className="text-gray-600 text-sm">{project.technologies}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-light text-gray-900 mb-6 tracking-wide">EDUCATION</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700">{edu.institution}</p>
                  </div>
                  <div className="text-right text-gray-600 text-sm">
                    <div>{edu.year}</div>
                    {edu.percentage && <div>{edu.percentage}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-light text-gray-900 mb-6 tracking-wide">SKILLS</h2>
          <div className="space-y-3">
            {['technical', 'tools', 'soft'].map(category => {
              const categorySkills = skills.filter(skill => skill.category === category);
              if (categorySkills.length === 0) return null;
              
              return (
                <div key={category} className="flex">
                  <span className="w-24 text-gray-900 font-medium capitalize">
                    {category === 'technical' ? 'Technical' : category === 'tools' ? 'Tools' : 'Soft'}:
                  </span>
                  <span className="text-gray-700">
                    {categorySkills.map(skill => skill.name).join(', ')}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Certifications */}
        {certifications.length > 0 && (
          <section>
            <h2 className="text-xl font-light text-gray-900 mb-6 tracking-wide">CERTIFICATIONS</h2>
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div key={cert.id}>
                  <h3 className="font-medium text-gray-900">{cert.name}</h3>
                  <p className="text-gray-700 text-sm">{cert.issuer}, {cert.year}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <section>
            <h2 className="text-xl font-light text-gray-900 mb-6 tracking-wide">ACHIEVEMENTS</h2>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div key={achievement.id}>
                  <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                  <p className="text-gray-700 text-sm">{achievement.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Social Links */}
      {(socialLinks.github || socialLinks.linkedin || socialLinks.portfolio) && (
        <section className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-center gap-8 text-sm text-gray-600">
            {socialLinks.github && <span>{socialLinks.github}</span>}
            {socialLinks.linkedin && <span>{socialLinks.linkedin}</span>}
            {socialLinks.portfolio && <span>{socialLinks.portfolio}</span>}
          </div>
        </section>
      )}
    </div>
  );
};