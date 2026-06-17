import React from 'react';
import { ResumeData } from '../../types/resume';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react';

interface ModernTemplateProps {
  data: ResumeData;
}

export const ModernTemplate: React.FC<ModernTemplateProps> = ({ data }) => {
  const { personalInfo, skills, education, experience, projects, certifications, achievements, socialLinks } = data;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{personalInfo.fullName}</h1>
        <p className="text-blue-100 text-sm sm:text-base lg:text-lg mb-4">{personalInfo.professionalSummary}</p>
        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span className="break-all">{personalInfo.email}</span>
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
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-4 lg:space-y-6">
            {/* Skills */}
            {skills.length > 0 && (
              <section>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 border-b-2 border-blue-500 pb-2">Skills</h2>
                <div className="space-y-4">
                  {['technical', 'tools', 'soft'].map(category => {
                    const categorySkills = skills.filter(skill => skill.category === category);
                    if (categorySkills.length === 0) return null;
                    
                    return (
                      <div key={category}>
                        <h3 className="font-semibold text-gray-800 mb-2 capitalize text-sm sm:text-base">
                          {category === 'technical' ? 'Technical' : category === 'tools' ? 'Tools' : 'Soft Skills'}
                        </h3>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {categorySkills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm rounded-full">
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Social Links */}
            {(socialLinks.github || socialLinks.linkedin || socialLinks.portfolio) && (
              <section>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 border-b-2 border-blue-500 pb-2">Links</h2>
                <div className="space-y-2">
                  {socialLinks.github && (
                    <div className="flex items-center gap-2">
                      <Github className="w-4 h-4 text-gray-600" />
                      <span className="text-xs sm:text-sm text-blue-600 break-all">{socialLinks.github}</span>
                    </div>
                  )}
                  {socialLinks.linkedin && (
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-gray-600" />
                      <span className="text-xs sm:text-sm text-blue-600 break-all">{socialLinks.linkedin}</span>
                    </div>
                  )}
                  {socialLinks.portfolio && (
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-gray-600" />
                      <span className="text-xs sm:text-sm text-blue-600 break-all">{socialLinks.portfolio}</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <section>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 border-b-2 border-blue-500 pb-2">Certifications</h2>
                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <div key={cert.id}>
                      <h3 className="font-semibold text-gray-800 text-xs sm:text-sm">{cert.name}</h3>
                      <p className="text-gray-600 text-xs">{cert.issuer}</p>
                      <p className="text-gray-500 text-xs">{cert.year}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Experience */}
            {experience.length > 0 && (
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 border-b-2 border-blue-500 pb-2">Experience</h2>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{exp.title}</h3>
                      <p className="text-blue-600 font-medium text-sm sm:text-base">{exp.company}</p>
                      <p className="text-gray-500 text-xs sm:text-sm mb-2">{exp.duration}</p>
                      <p className="text-gray-700 text-sm sm:text-base">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 border-b-2 border-blue-500 pb-2">Projects</h2>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id}>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{project.name}</h3>
                        {project.link && (
                          <ExternalLink className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <p className="text-gray-700 mb-2 text-sm sm:text-base">{project.description}</p>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {project.technologies.split(',').map((tech, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 border-b-2 border-blue-500 pb-2">Education</h2>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-blue-600 font-medium text-sm sm:text-base">{edu.institution}</p>
                      <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        <span>{edu.year}</span>
                        {edu.percentage && <span>{edu.percentage}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 border-b-2 border-blue-500 pb-2">Achievements</h2>
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div key={achievement.id}>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{achievement.title}</h3>
                      <p className="text-gray-700 text-sm sm:text-base">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};