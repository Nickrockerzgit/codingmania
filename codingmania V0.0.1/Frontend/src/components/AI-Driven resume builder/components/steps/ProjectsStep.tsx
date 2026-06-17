import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, ExternalLink, Bot } from 'lucide-react';
import { Project } from '../../types/resume';

interface ProjectsStepProps {
  data: Project[];
  onChange: (data: Project[]) => void;
  onOpenAI: () => void;
}

export const ProjectsStep: React.FC<ProjectsStepProps> = ({ data, onChange, onOpenAI }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<Project>({
    id: '',
    name: '',
    description: '',
    technologies: '',
    link: ''
  });

  const addProject = () => {
    if (newProject.name && newProject.description && newProject.technologies) {
      const project = { ...newProject, id: Date.now().toString() };
      onChange([...data, project]);
      setNewProject({ id: '', name: '', description: '', technologies: '', link: '' });
    }
  };

  const updateProject = (id: string, updatedProject: Project) => {
    onChange(data.map(proj => proj.id === id ? updatedProject : proj));
    setEditingId(null);
  };

  const deleteProject = (id: string) => {
    onChange(data.filter(proj => proj.id !== id));
  };

  const ProjectCard = ({ project }: { project: Project }) => {
    const [editData, setEditData] = useState(project);
    const isEditing = editingId === project.id;

    if (isEditing) {
      return (
        <div className="bg-gray-900 border border-gray-600 rounded-lg p-6">
          <div className="grid grid-cols-1 gap-4 mb-4">
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full px-3 py-2 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="Project Name"
            />
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none"
              placeholder="Project Description"
            />
            <input
              type="text"
              value={editData.technologies}
              onChange={(e) => setEditData({ ...editData, technologies: e.target.value })}
              className="w-full px-3 py-2 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="Technologies Used"
            />
            <input
              type="url"
              value={editData.link || ''}
              onChange={(e) => setEditData({ ...editData, link: e.target.value })}
              className="w-full px-3 py-2 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="Project Link (optional)"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => updateProject(project.id, editData)}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-900 border border-gray-600 rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium text-white">{project.name}</h4>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-500"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            <p className="text-gray-300 mb-2">{project.description}</p>
            <div className="flex flex-wrap gap-1">
              {project.technologies.split(',').map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded-full"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditingId(project.id)}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteProject(project.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

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
              <h3 className="font-semibold text-white">Generate project descriptions</h3>
              <p className="text-sm text-gray-400">Describe your projects and get professional formatting</p>
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

      {/* Add New Project */}
      <div className="bg-gray-900 border border-gray-600 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Add Project</h3>
        <div className="space-y-4">
          <input
            type="text"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="Project Name (e.g., E-commerce Website)"
          />
          <textarea
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none"
            placeholder="Describe your project, what it does, and your role in it..."
          />
          <input
            type="text"
            value={newProject.technologies}
            onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
            className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="Technologies Used (e.g., React, Node.js, MongoDB)"
          />
          <input
            type="url"
            value={newProject.link || ''}
            onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
            className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="Project Link (GitHub, Demo, etc.) - Optional"
          />
        </div>
        <button
          onClick={addProject}
          disabled={!newProject.name || !newProject.description || !newProject.technologies}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {data.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No projects added yet. Add your projects above!</p>
          <p className="text-sm mt-1">Include personal projects, hackathon submissions, or coursework.</p>
        </div>
      )}
    </div>
  );
};
