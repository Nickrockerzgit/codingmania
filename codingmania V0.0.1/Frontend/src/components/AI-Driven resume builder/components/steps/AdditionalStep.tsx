
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Award, Trophy, Link, Bot } from 'lucide-react';
import { Certification, Achievement, SocialLinks } from '../../types/resume';

interface AdditionalStepProps {
  certifications: Certification[];
  achievements: Achievement[];
  socialLinks: SocialLinks;
  onCertificationsChange: (data: Certification[]) => void;
  onAchievementsChange: (data: Achievement[]) => void;
  onSocialLinksChange: (data: SocialLinks) => void;
  onOpenAI: () => void;
}

export const AdditionalStep: React.FC<AdditionalStepProps> = ({
  certifications,
  achievements,
  socialLinks,
  onCertificationsChange,
  onAchievementsChange,
  onSocialLinksChange,
  onOpenAI
}) => {
  const [activeTab, setActiveTab] = useState<'certifications' | 'achievements' | 'social'>('certifications');
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [editingAchId, setEditingAchId] = useState<string | null>(null);

  const [newCertification, setNewCertification] = useState<Certification>({
    id: '', name: '', issuer: '', year: ''
  });

  const [newAchievement, setNewAchievement] = useState<Achievement>({
    id: '', title: '', description: ''
  });

  // Certification functions
  const addCertification = () => {
    if (newCertification.name && newCertification.issuer && newCertification.year) {
      const cert = { ...newCertification, id: Date.now().toString() };
      onCertificationsChange([...certifications, cert]);
      setNewCertification({ id: '', name: '', issuer: '', year: '' });
    }
  };

  const updateCertification = (id: string, updatedCert: Certification) => {
    onCertificationsChange(certifications.map(cert => cert.id === id ? updatedCert : cert));
    setEditingCertId(null);
  };

  const deleteCertification = (id: string) => {
    onCertificationsChange(certifications.filter(cert => cert.id !== id));
  };

  // Achievement functions
  const addAchievement = () => {
    if (newAchievement.title && newAchievement.description) {
      const ach = { ...newAchievement, id: Date.now().toString() };
      onAchievementsChange([...achievements, ach]);
      setNewAchievement({ id: '', title: '', description: '' });
    }
  };

  const updateAchievement = (id: string, updatedAch: Achievement) => {
    onAchievementsChange(achievements.map(ach => ach.id === id ? updatedAch : ach));
    setEditingAchId(null);
  };

  const deleteAchievement = (id: string) => {
    onAchievementsChange(achievements.filter(ach => ach.id !== id));
  };

  const CertificationCard = ({ cert }: { cert: Certification }) => {
    const [editData, setEditData] = useState(cert);
    const isEditing = editingCertId === cert.id;

    if (isEditing) {
      return (
              <div className="bg-[#2c2c2e] border border-gray-700 rounded-lg p-4 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="px-3 py-2 bg-[#1c1c1e] text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Certification Name"
            />
            <input
              type="text"
              value={editData.issuer}
              onChange={(e) => setEditData({ ...editData, issuer: e.target.value })}
              className="px-3 py-2 bg-[#1c1c1e] text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Issuer"
            />
            <input
              type="text"
              value={editData.year}
              onChange={(e) => setEditData({ ...editData, year: e.target.value })}
              className="px-3 py-2 bg-[#1c1c1e] text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Year"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => updateCertification(cert.id, editData)} className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
              <Save className="w-3 h-3 mr-1" />
              Save
            </button>
            <button onClick={() => setEditingCertId(null)} className="flex items-center px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">
              <X className="w-3 h-3 mr-1" />
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-[#2c2c2e] border border-gray-700 rounded-lg p-4 text-white hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium">{cert.name}</h4>
              <p className="text-sm text-gray-400">{cert.issuer}</p>
              <p className="text-sm text-gray-500">{cert.year}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setEditingCertId(cert.id)} className="p-1 text-gray-400 hover:text-blue-400">
              <Edit2 className="w-3 h-3" />
            </button>
            <button onClick={() => deleteCertification(cert.id)} className="p-1 text-gray-400 hover:text-red-500">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  };


  const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
    const [editData, setEditData] = useState(achievement);
    const isEditing = editingAchId === achievement.id;

    if (isEditing) {
      return (
       <div className="bg-[#2c2c2e] border border-gray-700 rounded-lg p-4 text-white">
          <div className="space-y-3 mb-3">
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full px-3 py-2 bg-[#1c1c1e] text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Achievement Title"
            />
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 bg-[#1c1c1e] text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Description"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => updateAchievement(achievement.id, editData)} className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
              <Save className="w-3 h-3 mr-1" />
              Save
            </button>
            <button onClick={() => setEditingAchId(null)} className="flex items-center px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">
              <X className="w-3 h-3 mr-1" />
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-[#2c2c2e] border border-gray-700 rounded-lg p-4 text-white hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <Trophy className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <h4 className="font-medium">{achievement.title}</h4>
              <p className="text-sm text-gray-400">{achievement.description}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setEditingAchId(achievement.id)} className="p-1 text-gray-400 hover:text-blue-400">
              <Edit2 className="w-3 h-3" />
            </button>
            <button onClick={() => deleteAchievement(achievement.id)} className="p-1 text-gray-400 hover:text-red-500">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* AI Assistant Button */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 border border-indigo-400 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Generate certifications & achievements</h3>
              <p className="text-sm text-gray-200">Tell AI about your accomplishments</p>
            </div>
          </div>
          <button
            onClick={onOpenAI}
            className="px-4 py-2 bg-black/30 hover:bg-black/50 text-white rounded-lg transition-all text-sm font-medium"
          >
            Try AI Assistant
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-700">
        {[
          { id: 'certifications', label: 'Certifications', icon: Award },
          { id: 'achievements', label: 'Achievements', icon: Trophy },
          { id: 'social', label: 'Social Links', icon: Link }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === id
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Certifications Tab */}
      {activeTab === 'certifications' && (
        <div className="space-y-4">
          <div className="bg-black border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-50 mb-4">Add Certification</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                value={newCertification.name}
                onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                className="px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                placeholder="Certification Name"
              />
              <input
                type="text"
                value={newCertification.issuer}
                onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                className="px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                placeholder="Issuing Organization"
              />
              <input
                type="text"
                value={newCertification.year}
                onChange={(e) => setNewCertification({ ...newCertification, year: e.target.value })}
                className="px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                placeholder="Year"
              />
            </div>
            <button
              onClick={addCertification}
              disabled={!newCertification.name || !newCertification.issuer || !newCertification.year}
              className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Certification
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert) => (
              <CertificationCard key={cert.id} cert={cert} />
            ))}
          </div>

          {certifications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No certifications added yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="space-y-4">
          <div className="bg-black border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-50 mb-4">Add Achievement</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newAchievement.title}
                onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                placeholder="Achievement Title"
              />
              <textarea
                value={newAchievement.description}
                onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                placeholder="Describe your achievement..."
              />
            </div>
            <button
              onClick={addAchievement}
              disabled={!newAchievement.title || !newAchievement.description}
              className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Achievement
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>

          {achievements.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No achievements added yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Social Links Tab */}
      {activeTab === 'social' && (
        <div className="bg-black border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-50 mb-4">Social Links & Portfolio</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                GitHub Profile *
              </label>
              <input
                type="url"
                value={socialLinks.github}
                onChange={(e) => onSocialLinksChange({ ...socialLinks, github: e.target.value })}
                className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                placeholder="https://github.com/yourusername"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                LinkedIn Profile *
              </label>
              <input
                type="url"
                value={socialLinks.linkedin}
                onChange={(e) => onSocialLinksChange({ ...socialLinks, linkedin: e.target.value })}
                className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Portfolio Website
              </label>
              <input
                type="url"
                value={socialLinks.portfolio || ''}
                onChange={(e) => onSocialLinksChange({ ...socialLinks, portfolio: e.target.value })}
                className="w-full px-4 py-3 bg-black text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                placeholder="https://yourportfolio.com (optional)"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};