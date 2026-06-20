
import React, { useState, useEffect } from 'react';
import { 
  User, Camera, Edit, Key, Loader2, Save, X, 
  MapPin, Calendar, Phone, Mail 
} from 'lucide-react';

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  avatar: string;
  phone: string;
  location: string;
  joinDate: string;
}

const Profile: React.FC<ProfileProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    bio: "",
    avatar: "",
    phone: "",
    location: "",
    joinDate: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ProfileData>({ ...profileData });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // const API_BASE_URL = 'http://localhost:5001';

  const getAuthToken = () => localStorage.getItem('token') || '';

  const getAuthHeaders = (contentType = true) => {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${getAuthToken()}`,
    };
    if (contentType) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  };

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to fetch profile');

      const json = await response.json();
      const data = json.data || {};

      const safeData: ProfileData = {
        name: data.name || "",
        email: data.email || "",
        bio: data.bio || "",
        avatar: data.avatar || "",           // ← ImageKit URL (absolute)
        phone: data.phone || "",
        location: data.location || "",
        joinDate: data.joinDate || "",
      };

      setProfileData(safeData);
      setEditedData(safeData);
    } catch (err: any) {
      console.error('Fetch profile error:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchProfile();
  }, [isOpen]);

  // Save profile changes (name, phone, location, bio)
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile/update`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(editedData),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || 'Failed to update profile');
      }

      setProfileData({ ...editedData });
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Avatar upload → backend returns ImageKit URL
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic client-side validation
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setError('Only JPEG, PNG, GIF, WebP allowed');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be smaller than 2MB');
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: formData,
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || 'Avatar upload failed');
      }

      // Backend should return absolute ImageKit URL
      const newAvatarUrl = json.avatar || json.data?.avatar || "";

      setProfileData(prev => ({ ...prev, avatar: newAvatarUrl }));
      setEditedData(prev => ({ ...prev, avatar: newAvatarUrl }));
      setSuccess('Avatar updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setSuccess("");
    setError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile/change-password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || 'Failed to change password');
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Password updated successfully!");
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  // Reset messages when switching tabs
  useEffect(() => {
    setError("");
    setSuccess("");
    setPasswordError("");
  }, [activeTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-red-500/10">
          <div className="flex items-center gap-3">
            <User className="w-7 h-7 text-red-400" />
            <h2 className="text-2xl font-bold text-white">User Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Global messages */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            {error}
          </div>
        )}
        {success && (
          <div className="mx-6 mt-4 p-4 bg-green-500/15 border border-green-500/30 text-green-400 rounded-lg flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {success}
          </div>
        )}

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar – Avatar + basic info + tabs */}
          <div className="w-full lg:w-1/3 bg-white/5 p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}           // ← direct ImageKit URL
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white/10 shadow-lg group-hover:shadow-xl transition-shadow"
                    onError={(e) => {
                      e.currentTarget.src = "/default-avatar.png"; // fallback
                    }}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-red-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg group-hover:shadow-xl transition-shadow">
                    {profileData.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase() || '?'}
                  </div>
                )}

                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-red-600 text-white p-3 rounded-full cursor-pointer hover:bg-red-700 shadow-lg hover:shadow-xl transition-all">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>

              <h3 className="text-xl font-semibold mt-4 text-white">{profileData.name || "User"}</h3>
              <p className="text-gray-300 flex items-center gap-1.5 mt-1">
                <Mail className="w-4 h-4" />
                {profileData.email}
              </p>
              {profileData.location && (
                <p className="text-gray-400 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4" />
                  {profileData.location}
                </p>
              )}
              {profileData.joinDate && (
                <p className="text-gray-400 flex items-center gap-1.5 mt-1">
                  <Calendar className="w-4 h-4" />
                  Member since {new Date(profileData.joinDate).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Tabs */}
            <ul className="space-y-2">
              <li>
                <button
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    activeTab === "profile"
                      ? "bg-red-500/10 text-red-400 font-medium shadow-sm"
                      : "hover:bg-white/10 text-gray-300"
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  Profile Information
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    activeTab === "security"
                      ? "bg-red-500/10 text-red-400 font-medium shadow-sm"
                      : "hover:bg-white/10 text-gray-300"
                  }`}
                  onClick={() => setActiveTab("security")}
                >
                  Security Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Main content area */}
          <div className="w-full lg:w-2/3 p-8">
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin w-8 h-8 text-red-400" />
                <span className="ml-3 text-gray-300">Loading...</span>
              </div>
            )}

            {!loading && activeTab === "profile" && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-semibold text-white">Profile Information</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all shadow-sm hover:shadow-md"
                    >
                      <Edit className="w-4 h-4" /> Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditedData({ ...profileData });
                        }}
                        className="bg-white/10 text-gray-300 px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-60 transition-all shadow-sm hover:shadow-md"
                      >
                        {loading ? (
                          <Loader2 className="animate-spin w-4 h-4" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                {!isEditing ? (
                  // View mode
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-gray-400 text-sm font-medium">Full Name</p>
                      <p className="text-lg font-semibold text-white">{profileData.name || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-400 text-sm font-medium">Email</p>
                      <p className="text-lg font-semibold text-white">{profileData.email || "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-400 text-sm font-medium">Phone</p>
                      <p className="text-lg font-semibold text-white flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {profileData.phone || "Not specified"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-400 text-sm font-medium">Location</p>
                      <p className="text-lg font-semibold text-white flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {profileData.location || "Not specified"}
                      </p>
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <p className="text-gray-400 text-sm font-medium">Bio</p>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {profileData.bio || "No bio available"}
                      </p>
                    </div>
                  </div>
                ) : (
                  // Edit mode
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editedData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editedData.email}
                        disabled
                        className="w-full p-3 border border-white/10 rounded-lg bg-white/5 text-white cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={editedData.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={editedData.location}
                        onChange={handleInputChange}
                        placeholder="City, Country"
                        className="w-full p-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-300 font-medium mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={editedData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        maxLength={500}
                        placeholder="Tell us about yourself..."
                        className="w-full p-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                      <p className="text-sm text-gray-400 mt-2 text-right">
                        {editedData.bio.length} / 500
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!loading && activeTab === "security" && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <Key className="w-6 h-6 text-red-400" />
                  <h3 className="text-2xl font-semibold text-white">Change Password</h3>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      className="w-full p-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                      autoComplete="current-password"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full p-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                      autoComplete="new-password"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full p-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                      autoComplete="new-password"
                    />
                  </div>

                  {passwordError && (
                    <p className="text-red-300 bg-red-500/10 p-3 rounded-lg border border-red-500/30">
                      {passwordError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 disabled:opacity-60 transition-all shadow-sm hover:shadow-md"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                      <Key className="w-5 h-5" />
                    )}
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;