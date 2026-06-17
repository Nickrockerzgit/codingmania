import React, { useState, useEffect } from 'react';
import { Award, Download, Share2, Search, Filter, Calendar, CheckCircle } from 'lucide-react';

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  description: string;
  credentialId: string;
  skills: string[];
  downloadUrl: string;
  verificationUrl: string;
  status: 'completed' | 'in-progress' | 'expired';
}

const StudentCertificates: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/certificates/user`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch certificates');
        const data = await response.json();
        setCertificates(data);
      } catch (err) {
        console.error(err);
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || cert.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedCertificates = [...filteredCertificates].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "issuer") {
      return a.issuer.localeCompare(b.issuer);
    }
    return 0;
  });

  const handleDownload = (cert: Certificate) => {
    // In a real app, this would trigger an actual download
    alert(`Downloading certificate: ${cert.title}`);
  };

  const handleShare = (cert: Certificate) => {
    if (navigator.share) {
      navigator.share({
        title: `${cert.title} Certificate`,
        text: `I've earned a certificate in ${cert.title} from ${cert.issuer}!`,
        url: cert.verificationUrl,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(cert.verificationUrl);
      alert('Verification link copied to clipboard!');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "in-progress": return <Calendar className="w-4 h-4" />;
      case "expired": return "⚠️";
      default: return null;
    }
  };

  if (loading) return <div className="p-8">Loading certificates...</div>;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">My Certifications</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage and view your earned certificates</p>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100/60 w-full overflow-hidden">
        <div className="p-6">
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search certifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="issuer">Sort by Issuer</option>
              </select>
            </div>
          </div>

          {/* Certificates Grid */}
          {sortedCertificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCertificates.map(cert => (
                <div key={cert.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Award className="w-6 h-6 text-yellow-600" />
                    </div>
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(cert.status)}`}>
                      {getStatusIcon(cert.status)}
                      {cert.status.charAt(0).toUpperCase() + cert.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{cert.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{cert.issuer}</p>
                  <p className="text-gray-500 text-xs mb-4">{new Date(cert.date).toLocaleDateString()}</p>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{cert.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {cert.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                          {skill}
                        </span>
                      ))}
                      {cert.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                          +{cert.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-4">
                    <p>Credential ID: {cert.credentialId}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(cert)}
                      disabled={cert.status === 'in-progress'}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => handleShare(cert)}
                      disabled={cert.status === 'in-progress'}
                      className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                  
                  {cert.status === 'completed' && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <a
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xs underline"
                      >
                        Verify Certificate
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No certifications found.</p>
              <p className="text-gray-400 text-sm">Complete courses to earn certificates!</p>
            </div>
          )}
          
          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {certificates.filter(c => c.status === 'completed').length}
              </div>
              <div className="text-sm text-green-700">Completed</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {certificates.filter(c => c.status === 'in-progress').length}
              </div>
              <div className="text-sm text-blue-700">In Progress</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {certificates.length}
              </div>
              <div className="text-sm text-yellow-700">Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCertificates;
