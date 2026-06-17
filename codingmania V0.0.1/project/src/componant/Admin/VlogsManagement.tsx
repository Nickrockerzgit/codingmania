
// //without Vanta.js effect
// import { useState, useEffect } from 'react';
// import { Plus, Save, Trash, ArrowLeft } from 'lucide-react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// interface Vlog {
//   id?: number;
//   title: string;
//   video: File | null;
//   thumbnail: File | null;
//   videoUrl?: string;
//   thumbnailUrl?: string;
//   views?: number;
//   likes?: number;
//   duration?: string;
// }

// const VlogsManagement = () => {
//   const [vlogs, setVlogs] = useState<Vlog[]>([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchVlogs();
//   }, []);

//   const fetchVlogs = async () => {
//     try {
//       const response = await axios.get('http://localhost:5001/api/vlogs/get-vlogs');
//       const fetchedVlogs = response.data.map((vlog: any) => ({
//         id: vlog.id,
//         title: vlog.title || '',
//         video: null,
//         thumbnail: null,
//         videoUrl: vlog.video_url,       // ImageKit URL
//         thumbnailUrl: vlog.thumbnail_url, // ImageKit URL
//         views: vlog.views,
//         likes: vlog.likes,
//         duration: vlog.duration
//       }));
//       setVlogs(fetchedVlogs);
//     } catch (error) {
//       console.error('Error fetching vlogs:', error);
//     }
//   };

//   const validateVideo = (file: File): Promise<boolean> => {
//     return new Promise((resolve) => {
//       const video = document.createElement('video');
//       video.preload = 'metadata';
//       video.onloadedmetadata = () => {
//         window.URL.revokeObjectURL(video.src);
//         const duration = video.duration;
//         resolve(duration <= 1500); // 25 minutes
//       };
//       video.src = URL.createObjectURL(file);
//     });
//   };

//   const handleVlogChange = (index: number, field: keyof Vlog, value: any) => {
//     const newVlogs = [...vlogs];
//     newVlogs[index] = { ...newVlogs[index], [field]: value };
//     setVlogs(newVlogs);
//   };

//   const handleVideoUpload = async (index: number, file: File) => {
//     if (!file) return;
//     if (file.size > 500 * 1024 * 1024) {
//       alert('File size must be less than 500MB');
//       return;
//     }
//     const isValidDuration = await validateVideo(file);
//     if (!isValidDuration) {
//       alert('Video duration must be less than 25 minutes');
//       return;
//     }
//     handleVlogChange(index, 'video', file);
//     handleVlogChange(index, 'videoUrl', URL.createObjectURL(file)); // for preview
//   };

//   const handleThumbnailUpload = (index: number, file: File) => {
//     if (!file) return;
//     handleVlogChange(index, 'thumbnail', file);
//     handleVlogChange(index, 'thumbnailUrl', URL.createObjectURL(file)); // for preview
//   };

//   const handleAddVlog = () => {
//     setVlogs([
//       ...vlogs,
//       { title: 'New Vlog', video: null, thumbnail: null }
//     ]);
//   };

//   const handleDeleteVlog = (index: number) => {
//     const newVlogs = vlogs.filter((_, i) => i !== index);
//     setVlogs(newVlogs);
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       const validVlogs = vlogs.filter(vlog => vlog.title && vlog.video && vlog.thumbnail);
//       if (validVlogs.length === 0) {
//         alert('Please provide title, video, and thumbnail for at least one vlog');
//         setLoading(false);
//         return;
//       }

//       for (const vlog of validVlogs) {
//         const formData = new FormData();
//         formData.append('title', vlog.title);
//         if (vlog.video) formData.append('video', vlog.video);
//         if (vlog.thumbnail) formData.append('thumbnail', vlog.thumbnail);

//         await axios.post('http://localhost:5001/api/vlogs/upload-vlog', formData, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });
//       }

//       alert('Vlogs saved successfully!');
//       setVlogs([]);           // optional: clear form after save
//       fetchVlogs();           // refresh list
//     } catch (error) {
//       console.error('Error saving vlogs:', error);
//       alert('Error saving vlogs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black p-6 text-white">
//       <div>
//         <button
//           onClick={() => navigate('/admin')}
//           className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors mb-6"
//         >
//           <ArrowLeft className="mr-2" /> Back
//         </button>

//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-2xl font-bold">Vlogs Management</h2>
//           <div className="flex space-x-4">
//             <button
//               onClick={handleSave}
//               disabled={loading}
//               className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
//             >
//               <Save className="mr-2" /> {loading ? 'Saving...' : 'Save Changes'}
//             </button>
//             <button
//               onClick={handleAddVlog}
//               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               <Plus className="mr-2" /> Add Vlog
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {vlogs.map((vlog, index) => (
//             <div 
//               key={index} 
//               className="bg-gray-900/70 backdrop-blur-sm p-6 rounded-xl border border-gray-800 relative"
//             >
//               <button
//                 onClick={() => handleDeleteVlog(index)}
//                 className="absolute top-4 right-4 text-red-500 hover:text-red-400 transition-colors"
//               >
//                 <Trash className="h-5 w-5" />
//               </button>

//               <div className="space-y-5">
//                 {/* Title */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
//                   <input
//                     type="text"
//                     value={vlog.title}
//                     onChange={(e) => handleVlogChange(index, 'title', e.target.value)}
//                     className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
//                     placeholder="Enter vlog title"
//                   />
//                 </div>

//                 {/* Thumbnail */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Thumbnail</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => handleThumbnailUpload(index, e.target.files?.[0] as File)}
//                     className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
//                   />
//                   {vlog.thumbnailUrl && (
//                     <img
//                       src={vlog.thumbnailUrl}
//                       alt="Thumbnail preview"
//                       className="mt-3 w-full h-40 object-cover rounded-lg border border-gray-700"
//                     />
//                   )}
//                 </div>

//                 {/* Video */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">Upload Video</label>
//                   <input
//                     type="file"
//                     accept="video/*"
//                     onChange={(e) => handleVideoUpload(index, e.target.files?.[0] as File)}
//                     className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
//                   />
//                   {vlog.videoUrl && (
//                     <div className="mt-3">
//                       <video 
//                         controls 
//                         className="w-full h-52 object-cover rounded-lg border border-gray-700"
//                       >
//                         <source src={vlog.videoUrl} type="video/mp4" />
//                         Your browser does not support the video tag.
//                       </video>
//                     </div>
//                   )}
//                 </div>

//                 {/* Stats (existing videos only) */}
//                 {vlog.views !== undefined && (
//                   <div className="text-sm text-gray-400 pt-2 border-t border-gray-800">
//                     Views: {vlog.views} • Likes: {vlog.likes || 0}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VlogsManagement;








import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Vlog {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  thumbnail_url: string;
  video_url: string;
  slug: string;
  published: boolean;
  views?: number;
  likes?: number;
  duration?: string;
}

const VlogsManagement = () => {
  const [vlogs, setVlogs] = useState<Vlog[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingVlog, setEditingVlog] = useState<Vlog | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    thumbnail_url: '',
    video_url: '',
    slug: '',
    published: false,
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchVlogs();
  }, []);

  const fetchVlogs = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/vlogs/get-vlogs`);
      const fetchedVlogs = response.data.map((vlog: any) => ({
        id: Number(vlog.id),
        title: vlog.title || '',
        content: vlog.content || '',
        excerpt: vlog.excerpt || '',
        thumbnail_url: vlog.thumbnail_url || '',
        video_url: vlog.video_url || '',
        slug: vlog.slug || '',
        published: !!vlog.published,
        views: Number(vlog.views || 0),
        likes: Number(vlog.likes || 0),
        duration: vlog.duration || 'N/A',
      }));
      setVlogs(fetchedVlogs);
    } catch (error) {
      console.error('Error fetching vlogs:', error);
    }
  };

  const validateVideo = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration <= 1500); // 25 minutes = 1500 seconds
      };
      video.onerror = () => resolve(false);
      video.src = URL.createObjectURL(file);
    });
  };

  const handleVideoUpload = async (file: File | null) => {
    if (!file) return;

    // 50 MB limit
    if (file.size > 50 * 1024 * 1024) {
      alert('Maximum video size allowed is 50 MB');
      return;
    }

    const isValid = await validateVideo(file);
    if (!isValid) {
      alert('Video duration must be less than 25 minutes');
      return;
    }

    setVideoFile(file);
    setFormData((prev) => ({ ...prev, video_url: URL.createObjectURL(file) }));
  };

  const handleThumbnailUpload = (file: File | null) => {
    if (!file) return;
    setThumbnailFile(file);
    setFormData((prev) => ({ ...prev, thumbnail_url: URL.createObjectURL(file) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
      alert('Title, excerpt and content are required');
      return;
    }

    if (!editingVlog && (!videoFile || !thumbnailFile)) {
      alert('Video and thumbnail are required when creating a new vlog');
      return;
    }

    setLoading(true);

    try {
      const apiFormData = new FormData();
      apiFormData.append('title', formData.title.trim());
      apiFormData.append('content', formData.content.trim());
      apiFormData.append('excerpt', formData.excerpt.trim());
      apiFormData.append('slug', formData.slug.trim());
      apiFormData.append('published', formData.published ? 'true' : 'false');

      if (videoFile) apiFormData.append('video', videoFile);
      if (thumbnailFile) apiFormData.append('thumbnail', thumbnailFile);

      if (editingVlog) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/vlogs/update-vlog/${editingVlog.id}`,
          apiFormData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        alert('Vlog updated successfully!');
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/vlogs/upload-vlog`,
          apiFormData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        alert('Vlog created successfully!');
      }

      fetchVlogs();
      resetForm();
    } catch (error: any) {
      console.error('Error saving vlog:', error);
      alert(
        error.response?.data?.message ||
        'Failed to save vlog. Please check console or server logs.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this vlog?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/vlogs/delete-vlog/${id}`);
      alert('Vlog deleted successfully!');
      fetchVlogs();
    } catch (error) {
      console.error('Error deleting vlog:', error);
      alert('Failed to delete vlog');
    }
  };

  const startEdit = (vlog: Vlog) => {
    setEditingVlog(vlog);
    setFormData({
      title: vlog.title,
      content: vlog.content,
      excerpt: vlog.excerpt,
      thumbnail_url: vlog.thumbnail_url,
      video_url: vlog.video_url,
      slug: vlog.slug,
      published: vlog.published,
    });
    setThumbnailFile(null);
    setVideoFile(null);
    setIsCreating(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      thumbnail_url: '',
      video_url: '',
      slug: '',
      published: false,
    });
    setThumbnailFile(null);
    setVideoFile(null);
    setIsCreating(false);
    setEditingVlog(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors mb-6"
      >
        <ArrowLeft className="mr-2" /> Back
      </button>

      {!isCreating ? (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Your Vlogs</h2>
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
            >
              <Plus size={20} />
              Create New Vlog
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vlogs.map((vlog) => (
              <div key={vlog.id} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <img
                  src={vlog.thumbnail_url}
                  alt={vlog.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=No+Thumbnail';
                  }}
                />
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{vlog.title}</h3>

                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      vlog.published
                        ? 'bg-green-900/40 text-green-400 border border-green-700'
                        : 'bg-yellow-900/40 text-yellow-400 border border-yellow-700'
                    }`}
                  >
                    {vlog.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {vlog.duration}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{vlog.excerpt}</p>

                <div className="text-gray-500 text-xs mb-4">
                  Views: {vlog.views} • Likes: {vlog.likes}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => startEdit(vlog)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(vlog.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {vlogs.length === 0 && (
              <div className="col-span-full text-center py-16 text-gray-500">
                No vlogs found. Click "Create New Vlog" to get started!
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">
              {editingVlog ? 'Edit Vlog' : 'Create New Vlog'}
            </h2>
            <button
              onClick={resetForm}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg transition"
            >
              <X size={18} />
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-8 space-y-6 border border-gray-800">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setFormData({
                    ...formData,
                    title: newTitle,
                    slug: !editingVlog ? generateSlug(newTitle) : formData.slug,
                  });
                }}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter vlog title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Slug (SEO friendly URL) *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="your-vlog-title-here"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Thumbnail * {editingVlog && '(leave empty to keep existing)'}
              </label>
              <input
                type="file"
                accept="image/*"
                required={!editingVlog}
                onChange={(e) => handleThumbnailUpload(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer file:transition"
              />
              {formData.thumbnail_url && (
                <img
                  src={formData.thumbnail_url}
                  alt="Thumbnail preview"
                  className="mt-4 w-full max-w-xs h-48 object-cover rounded-lg border border-gray-700"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video * {editingVlog && '(leave empty to keep existing)'} — max 50 MB,  25 min
              </label>
              <input
                type="file"
                accept="video/*"
                required={!editingVlog}
                onChange={(e) => handleVideoUpload(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer file:transition"
              />
              {formData.video_url && (
                <div className="mt-4">
                  <video
                    controls
                    className="w-full max-w-2xl h-64 object-cover rounded-lg border border-gray-700"
                  >
                    <source src={formData.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt (short preview) *</label>
              <textarea
                required
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="2-3 sentences summary that appears in listings..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Content *</label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={12}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                placeholder="Write the complete vlog description here..."
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="published" className="text-gray-300 cursor-pointer">
                Publish immediately (make visible to public)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {loading
                ? 'Saving...'
                : editingVlog
                ? 'Update Vlog'
                : 'Create Vlog'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default VlogsManagement;