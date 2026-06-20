import React, { useState } from 'react';
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

const AlumniCertificates: React.FC = () => {
  const [certificates] = useState<Certificate[]>([
    {
      id: 1,
      title: "Advanced React Development",
      issuer: "TechCorp Academy",
      date: "2024-12-15",
      description: "Comprehensive course covering advanced React concepts, hooks, context API, and performance optimization.",
      credentialId: "RC-2024-001234",
      skills: ["React", "JavaScript", "Redux", "Hooks"],
      downloadUrl: "/certificates/react-advanced.pdf",
      verificationUrl: "https://techcorp.academy/verify/RC-2024-001234",
      status: "completed"
    },
    {
      id: 2,
      title: "Full Stack Web Development",
      issuer: "CodeMasters Institute",
      date: "2024-11-20",
      description: "Complete full-stack development bootcamp covering frontend, backend, and database technologies.",
      credentialId: "FS-2024-005678",
      skills: ["Node.js", "MongoDB", "Express", "React"],
      downloadUrl: "/certificates/fullstack.pdf",
      verificationUrl: "https://codemasters.edu/verify/FS-2024-005678",
      status: "completed"
    },
    {
      id: 3,
      title: "Cloud Computing Fundamentals",
      issuer: "CloudTech University",
      date: "2024-10-10",
      description: "Introduction to cloud computing, AWS services, and deployment strategies.",
      credentialId: "CC-2024-009876",
      skills: ["AWS", "Cloud Computing", "Docker", "Kubernetes"],
      downloadUrl: "/certificates/cloud-fundamentals.pdf",
      verificationUrl: "https://cloudtech.university/verify/CC-2024-009876",
      status: "completed"
    },
    {
      id: 4,
      title: "Data Science with Python",
      issuer: "DataScience Pro",
      date: "2024-09-05",
      description: "Comprehensive data science course covering Python, pandas, machine learning, and data visualization.",
      credentialId: "DS-2024-112233",
      skills: ["Python", "Pandas", "Machine Learning", "Data Visualization"],
      downloadUrl: "/certificates/data-science.pdf",
      verificationUrl: "https://datasciencepro.com/verify/DS-2024-112233",
      status: "completed"
    },
    {
      id: 5,
      title: "Cybersecurity Specialist",
      issuer: "SecureNet Academy",
      date: "2025-02-15",
      description: "Advanced cybersecurity training covering threat analysis, network security, and incident response.",
      credentialId: "CS-2025-445566",
      skills: ["Cybersecurity", "Network Security", "Incident Response"],
      downloadUrl: "/certificates/cybersecurity.pdf",
      verificationUrl: "https://securenet.academy/verify/CS-2025-445566",
      status: "in-progress"
    }
  ]);

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
      case "completed": return "bg-green-500/15 text-green-400";
      case "in-progress": return "bg-red-500/10 text-red-400";
      case "expired": return "bg-red-500/15 text-red-300";
      default: return "bg-white/5 text-gray-300";
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

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-white">My Certifications</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage and view your earned certificates</p>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-sm border border-white/10 w-full overflow-hidden">
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
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            
            <div className="flex gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-300" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                <div key={cert.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-amber-500/15 rounded-lg">
                      <Award className="w-6 h-6 text-amber-400" />
                    </div>
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(cert.status)}`}>
                      {getStatusIcon(cert.status)}
                      {cert.status.charAt(0).toUpperCase() + cert.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{cert.title}</h3>
                  <p className="text-gray-300 text-sm mb-2">{cert.issuer}</p>
                  <p className="text-gray-400 text-xs mb-4">{new Date(cert.date).toLocaleDateString()}</p>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">{cert.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {cert.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-md">
                          {skill}
                        </span>
                      ))}
                      {cert.skills.length > 3 && (
                        <span className="px-2 py-1 bg-white/5 text-gray-300 text-xs rounded-md">
                          +{cert.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 mb-4">
                    <p>Credential ID: {cert.credentialId}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(cert)}
                      disabled={cert.status === 'in-progress'}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => handleShare(cert)}
                      disabled={cert.status === 'in-progress'}
                      className="flex items-center justify-center gap-2 px-3 py-2 border border-white/10 text-gray-300 rounded-lg hover:bg-white/5 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                  
                  {cert.status === 'completed' && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <a
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-400 hover:text-red-300 text-xs underline"
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
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 text-lg">No certifications found.</p>
              <p className="text-gray-400 text-sm">Complete courses to earn certificates!</p>
            </div>
          )}
          
          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-500/15 border border-green-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {certificates.filter(c => c.status === 'completed').length}
              </div>
              <div className="text-sm text-green-400">Completed</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {certificates.filter(c => c.status === 'in-progress').length}
              </div>
              <div className="text-sm text-red-400">In Progress</div>
            </div>
            <div className="bg-amber-500/15 border border-amber-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-amber-400 mb-1">
                {certificates.length}
              </div>
              <div className="text-sm text-amber-400">Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniCertificates;
