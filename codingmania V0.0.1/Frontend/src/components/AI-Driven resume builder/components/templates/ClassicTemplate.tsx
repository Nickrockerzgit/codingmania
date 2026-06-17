import React from 'react';
import { ResumeData } from '../../types/resume';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react';

interface ClassicTemplateProps {
  data: ResumeData;
}

export const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ data }) => {
  const { personalInfo, skills, education, experience, projects, certifications, achievements, socialLinks } = data;

  return (
    <div className="bg-white shadow-lg max-w-4xl mx-auto border">
      {/* Header */}
      <div className="border-b-4 border-gray-800 p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{personalInfo.fullName}</h1>
        <div className="flex flex-wrap gap-6 text-sm text-gray-700 mb-4">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{personalInfo.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>{personalInfo.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{personalInfo.location}</span>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed">{personalInfo.professionalSummary}</p>
      </div>

      <div className="p-8">
        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                      <p className="text-gray-700 font-semibold">{exp.company}</p>
                    </div>
                    <span className="text-gray-600 font-medium">{exp.duration}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
              Projects
            </h2>
            <div className="space-y-6">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                    {project.link && (
                      <ExternalLink className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-2">{project.description}</p>
                  <p className="text-gray-600 text-sm">
                    <strong>Technologies:</strong> {project.technologies}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-700 font-semibold">{edu.institution}</p>
                    </div>
                    <div className="text-right text-gray-600">
                      <div>{edu.year}</div>
                      {edu.percentage && <div className="text-sm">{edu.percentage}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
              Skills
            </h2>
            <div className="space-y-3">
              {['technical', 'tools', 'soft'].map(category => {
                const categorySkills = skills.filter(skill => skill.category === category);
                if (categorySkills.length === 0) return null;
                
                return (
                  <div key={category}>
                    <span className="font-bold text-gray-900">
                      {category === 'technical' ? 'Technical:' : category === 'tools' ? 'Tools:' : 'Soft Skills:'}
                    </span>
                    <span className="ml-2 text-gray-700">
                      {categorySkills.map(skill => skill.name).join(', ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Certifications */}
          {certifications.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                Certifications
              </h2>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <h3 className="font-bold text-gray-900">{cert.name}</h3>
                    <p className="text-gray-700">{cert.issuer}, {cert.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                Achievements
              </h2>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id}>
                    <h3 className="font-bold text-gray-900">{achievement.title}</h3>
                    <p className="text-gray-700">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Social Links */}
        {(socialLinks.github || socialLinks.linkedin || socialLinks.portfolio) && (
          <section className="mt-8 pt-6 border-t border-gray-300">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
              Online Presence
            </h2>
            <div className="flex flex-wrap gap-6">
              {socialLinks.github && (
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">{socialLinks.github}</span>
                </div>
              )}
              {socialLinks.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">{socialLinks.linkedin}</span>
                </div>
              )}
              {socialLinks.portfolio && (
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">{socialLinks.portfolio}</span>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};