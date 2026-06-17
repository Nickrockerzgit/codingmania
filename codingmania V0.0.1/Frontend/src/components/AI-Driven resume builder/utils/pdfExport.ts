import { ResumeData, Template } from '../types/resume';

export const downloadAsPDF = (data: ResumeData, template: Template): void => {
  // Create a new window with the resume content
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download the resume');
    return;
  }

  // Generate HTML content based on template
  const htmlContent = generateHTMLForPDF(data, template);
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load then trigger print
  printWindow.onload = () => {
    printWindow.print();
  };
};

const generateHTMLForPDF = (data: ResumeData, template: Template): string => {
  const { personalInfo, skills, education, experience, projects, certifications, achievements, socialLinks } = data;

  // Basic CSS for PDF generation
  const css = `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 800px; margin: 0 auto; padding: 20px; }
      .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
      .header h1 { font-size: 28px; margin-bottom: 10px; }
      .header .contact { font-size: 14px; margin-bottom: 10px; }
      .header .summary { font-size: 16px; line-height: 1.5; }
      .section { margin-bottom: 25px; }
      .section h2 { font-size: 20px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px; }
      .section h3 { font-size: 16px; margin-bottom: 5px; }
      .section h4 { font-size: 14px; margin-bottom: 5px; color: #666; }
      .section p { margin-bottom: 10px; }
      .skills { display: flex; flex-wrap: wrap; gap: 10px; }
      .skill { background: #f0f0f0; padding: 5px 10px; border-radius: 3px; font-size: 12px; }
      .experience-item, .education-item, .project-item { margin-bottom: 20px; }
      .date { float: right; color: #666; font-size: 14px; }
      .tech-stack { font-size: 12px; color: #666; margin-top: 5px; }
      @media print { body { font-size: 12px; } }
    </style>
  `;

  const skillsByCategory = {
    technical: skills.filter(skill => skill.category === 'technical'),
    tools: skills.filter(skill => skill.category === 'tools'),
    soft: skills.filter(skill => skill.category === 'soft')
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${personalInfo.fullName} - Resume</title>
      ${css}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${personalInfo.fullName}</h1>
          <div class="contact">
            ${personalInfo.email} • ${personalInfo.phone} • ${personalInfo.location}
          </div>
          <p class="summary">${personalInfo.professionalSummary}</p>
        </div>

        ${experience.length > 0 ? `
          <div class="section">
            <h2>Professional Experience</h2>
            ${experience.map(exp => `
              <div class="experience-item">
                <h3>${exp.title}</h3>
                <h4>${exp.company} <span class="date">${exp.duration}</span></h4>
                <p>${exp.description}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${projects.length > 0 ? `
          <div class="section">
            <h2>Projects</h2>
            ${projects.map(project => `
              <div class="project-item">
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <div class="tech-stack"><strong>Technologies:</strong> ${project.technologies}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${education.length > 0 ? `
          <div class="section">
            <h2>Education</h2>
            ${education.map(edu => `
              <div class="education-item">
                <h3>${edu.degree}</h3>
                <h4>${edu.institution} <span class="date">${edu.year}${edu.percentage ? ` • ${edu.percentage}` : ''}</span></h4>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${skills.length > 0 ? `
          <div class="section">
            <h2>Skills</h2>
            ${Object.entries(skillsByCategory).map(([category, categorySkills]) => 
              categorySkills.length > 0 ? `
                <div style="margin-bottom: 15px;">
                  <h4 style="margin-bottom: 8px; text-transform: capitalize;">
                    ${category === 'technical' ? 'Technical Skills' : category === 'tools' ? 'Tools & Technologies' : 'Soft Skills'}:
                  </h4>
                  <div class="skills">
                    ${categorySkills.map(skill => `<span class="skill">${skill.name}</span>`).join('')}
                  </div>
                </div>
              ` : ''
            ).join('')}
          </div>
        ` : ''}

        ${certifications.length > 0 ? `
          <div class="section">
            <h2>Certifications</h2>
            ${certifications.map(cert => `
              <div style="margin-bottom: 10px;">
                <h3>${cert.name}</h3>
                <h4>${cert.issuer}, ${cert.year}</h4>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${achievements.length > 0 ? `
          <div class="section">
            <h2>Achievements</h2>
            ${achievements.map(achievement => `
              <div style="margin-bottom: 10px;">
                <h3>${achievement.title}</h3>
                <p>${achievement.description}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${(socialLinks.github || socialLinks.linkedin || socialLinks.portfolio) ? `
          <div class="section">
            <h2>Online Presence</h2>
            <div>
              ${socialLinks.github ? `<p><strong>GitHub:</strong> ${socialLinks.github}</p>` : ''}
              ${socialLinks.linkedin ? `<p><strong>LinkedIn:</strong> ${socialLinks.linkedin}</p>` : ''}
              ${socialLinks.portfolio ? `<p><strong>Portfolio:</strong> ${socialLinks.portfolio}</p>` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
};