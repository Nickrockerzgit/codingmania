import React from 'react';
import { ResumeData } from '../../types/resume';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink, Code, Award, Trophy } from 'lucide-react';

interface CreativeTemplateProps {
  data: ResumeData;
}

export const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ data }) => {
  const { personalInfo, skills, education, experience, projects, certifications, achievements, socialLinks } = data;

  return (
    <div className="bg-white shadow-lg max-w-4xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Sidebar */}
        <div className="bg-gradient-to-b from-purple-600 to-pink-600 text-white p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="w-12 h-12" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{personalInfo.fullName}</h1>
          </div>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-6 h-0.5 bg-white"></div>
              Contact
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="break-all">{personalInfo.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{personalInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{personalInfo.location}</span>
              </div>
            </div>
          </section>

          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <div className="w-6 h-0.5 bg-white"></div>
                Skills
              </h2>
              <div className="space-y-4">
                {['technical', 'tools', 'soft'].map(category => {
                  const categorySkills = skills.filter(skill => skill.category === category);
                  if (categorySkills.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <h3 className="font-semibold text-purple-100 mb-2 capitalize text-sm">
                        {category === 'technical' ? 'Technical' : category === 'tools' ? 'Tools' : 'Soft Skills'}
                      </h3>
                      <div className="space-y-1">
                        {categorySkills.map((skill, index) => (
                          <div key={index} className="text-sm">
                            {skill.name}
                          </div>
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
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <div className="w-6 h-0.5 bg-white"></div>
                Links
              </h2>
              <div className="space-y-3">
                {socialLinks.github && (
                  <div className="flex items-center gap-3">
                    <Github className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm break-all">{socialLinks.github.replace('https://', '')}</span>
                  </div>
                )}
                {socialLinks.linkedin && (
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm break-all">{socialLinks.linkedin.replace('https://', '')}</span>
                  </div>
                )}
                {socialLinks.portfolio && (
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm break-all">{socialLinks.portfolio.replace('https://', '')}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <div className="w-6 h-0.5 bg-white"></div>
                Certifications
              </h2>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id} className="text-sm">
                    <div className="font-semibold">{cert.name}</div>
                    <div className="text-purple-100">{cert.issuer}</div>
                    <div className="text-purple-200 text-xs">{cert.year}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 p-8">
          {/* Professional Summary */}
          <section className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <h2 className="text-2xl font-bold text-gray-900">Professional Summary</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{personalInfo.professionalSummary}</p>
          </section>

          {/* Experience */}
          {experience.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <h2 className="text-2xl font-bold text-gray-900">Experience</h2>
              </div>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={exp.id} className="relative pl-6">
                    <div className="absolute left-0 top-0 w-3 h-3 bg-purple-500 rounded-full"></div>
                    {index < experience.length - 1 && (
                      <div className="absolute left-1.5 top-3 w-0.5 h-full bg-purple-200"></div>
                    )}
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                      <p className="text-purple-600 font-semibold">{exp.company}</p>
                      <p className="text-gray-500 text-sm mb-2">{exp.duration}</p>
                      <p className="text-gray-700">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="border-l-4 border-purple-500 pl-4 bg-gray-50 p-4 rounded-r-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                      {project.link && (
                        <ExternalLink className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <p className="text-gray-700 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.split(',').map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                        >
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
            <section className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <h2 className="text-2xl font-bold text-gray-900">Education</h2>
              </div>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-purple-600 font-semibold">{edu.institution}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
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
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
              </div>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex gap-3">
                    <Trophy className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900">{achievement.title}</h3>
                      <p className="text-gray-700">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};