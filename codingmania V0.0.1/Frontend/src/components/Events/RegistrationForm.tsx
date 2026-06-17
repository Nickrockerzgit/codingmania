import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, X, Upload, Check } from 'lucide-react';
import axios from 'axios';

interface EventDetail {
  id: number;
  title: string;
  categories: string;
}

interface TeamMember {
  name: string;
  email: string;
  role: string;
}

const RegistrationForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [members, setMembers] = useState<TeamMember[]>([{ name: '', email: '', role: '' }]);
  const [category, setCategory] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [linkedinProfile, setLinkedinProfile] = useState('');
  const [proposalFile, setProposalFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/events/get-event/${id}`);
        setEvent(response.data);
        
        // Set categories from event
        if (response.data.categories) {
          const categoryList = response.data.categories.split(',').map((cat: string) => cat.trim());
          setCategories(categoryList);
          if (categoryList.length > 0) {
            setCategory(categoryList[0]);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setError('Failed to load event details. Please try again later.');
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const addTeamMember = () => {
    setMembers([...members, { name: '', email: '', role: '' }]);
  };

  const removeTeamMember = (index: number) => {
    if (members.length > 1) {
      const newMembers = [...members];
      newMembers.splice(index, 1);
      setMembers(newMembers);
    }
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProposalFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!teamName || !leaderName || !leaderEmail || !category || !projectName) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate team members
    const validMembers = members.filter(member => member.name && member.email);
    if (validMembers.length === 0) {
      setError('Please add at least one valid team member');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const formData = new FormData();
      formData.append('teamName', teamName);
      formData.append('leaderName', leaderName);
      formData.append('leaderEmail', leaderEmail);
      formData.append('leaderPhone', leaderPhone);
      formData.append('members', JSON.stringify(validMembers));
      formData.append('category', category);
      formData.append('projectName', projectName);
      formData.append('projectDescription', projectDescription);
      formData.append('githubRepo', githubRepo);
      formData.append('linkedinProfile', linkedinProfile);
      
      if (proposalFile) {
        formData.append('proposal', proposalFile);
      }

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/events/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(true);
      setSubmitting(false);
      
      // Reset form after successful submission
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting registration:', error);
      setError('Failed to submit registration. Please try again later.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white mt-20 ">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-lg">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Back to Events
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white ">
        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl max-w-md w-full text-center ">
          <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
          <p className="text-gray-300 mb-6">
            Thank you for registering for {event?.title}. We've sent a confirmation email to your registered email address.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors "
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mt-3">
        <button 
          onClick={() => navigate(`/event/${id}`)}
          className="flex items-center text-purple-400 hover:text-purple-300 mb-2 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Event Details
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl"
        >
          <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-2">Register for {event?.title}</h1>
            <p className="text-gray-300 mb-8">Fill out the form below to register your team for this event.</p>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Team Information */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-white/10">Team Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="teamName" className="block text-sm font-medium text-gray-300 mb-1">
                      Team Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="teamName"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Team Leader Information */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-white/10">Team Leader Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="leaderName" className="block text-sm font-medium text-gray-300 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="leaderName"
                      value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="leaderEmail" className="block text-sm font-medium text-gray-300 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="leaderEmail"
                      value={leaderEmail}
                      onChange={(e) => setLeaderEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="leaderPhone" className="block text-sm font-medium text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="leaderPhone"
                      value={leaderPhone}
                      onChange={(e) => setLeaderPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div>
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                  <h2 className="text-xl font-semibold text-white">Team Members</h2>
                  <button
                    type="button"
                    onClick={addTeamMember}
                    className="flex items-center text-sm bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 px-3 py-1 rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Member
                  </button>
                </div>
                
                {members.map((member, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-white font-medium">Member {index + 1}</h3>
                      {members.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateMember(index, 'name', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) => updateMember(index, 'email', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Role
                        </label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => updateMember(index, 'role', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g., Developer, Designer"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Project Information */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-white/10">Project Information</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-1">
                      Project Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="projectName"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-300 mb-1">
                      Project Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="projectDescription"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="githubRepo" className="block text-sm font-medium text-gray-300 mb-1">
                        GitHub Repository <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        id="githubRepo"
                        value={githubRepo}
                        onChange={(e) => setGithubRepo(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="https://github.com/username/repo"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="linkedinProfile" className="block text-sm font-medium text-gray-300 mb-1">
                        LinkedIn Profile <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        id="linkedinProfile"
                        value={linkedinProfile}
                        onChange={(e) => setLinkedinProfile(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="https://linkedin.com/in/username"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="proposalFile" className="block text-sm font-medium text-gray-300 mb-1">
                      Project Proposal (PDF)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/10 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-400">
                          <label
                            htmlFor="proposalFile"
                            className="relative cursor-pointer bg-transparent rounded-md font-medium text-purple-400 hover:text-purple-300"
                          >
                            <span>Upload a file</span>
                            <input
                              id="proposalFile"
                              name="proposalFile"
                              type="file"
                              accept=".pdf"
                              className="sr-only"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-400">PDF up to 10MB</p>
                        {proposalFile && (
                          <p className="text-sm text-green-400 mt-2">
                            {proposalFile.name} ({Math.round(proposalFile.size / 1024)} KB)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 ${
                    submitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Registration'
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegistrationForm;