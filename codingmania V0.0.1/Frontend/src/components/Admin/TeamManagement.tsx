//local file handling 
// import { ChangeEvent, useEffect, useState } from 'react';
// import { Users, Github, Linkedin, Save, ArrowLeft, Plus } from 'lucide-react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import * as THREE from 'three';
// import NET from 'vanta/dist/vanta.net.min';

// interface TeamMember {
//   name: string;
//   role: string;
//   image: string | null;
//   github: string;
//   linkedin: string;
// }

// const TeamManagement = () => {
//   const navigate = useNavigate();
//   const [vantaEffect, setVantaEffect] = useState<any>(null);
//   const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

//   useEffect(() => {
//     if (!vantaEffect) {
//       setVantaEffect(
//         NET({
//           el: '#vanta-bg',
//           THREE,
//           color: 0x0ff0fc,
//           backgroundColor: 0x111827,
//           points: 12,
//           maxDistance: 20,
//           spacing: 15,
//         })
//       );
//     }

//     return () => {
//       if (vantaEffect) vantaEffect.destroy();
//     };
//   }, [vantaEffect]);

//   useEffect(() => {
//     const fetchTeamMembers = async () => {
//       try {
//         const response = await axios.get('http://localhost:5001/api/team/get-team-members');
//         const fetched = response.data;

//         const formatted = fetched.map((member: any) => ({
//           name: member.name || '',
//           role: member.role || '',
//           image: member.image ? `http://localhost:5001${member.image}` : null,
//           github: member.github || '',
//           linkedin: member.linkedin || '',
//         }));

//         setTeamMembers(formatted);
//       } catch (error) {
//         console.error('Error fetching team members:', error);
//       }
//     };

//     fetchTeamMembers();
//   }, []);

//   const handleMemberChange = (index: number, field: keyof TeamMember, value: string | null) => {
//     setTeamMembers(prev =>
//       prev.map((member, i) => (i === index ? { ...member, [field]: value } : member))
//     );
//   };

//   const handleImageUpload = (index: number, event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         handleMemberChange(index, 'image', e.target?.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleAddMember = () => {
//     const newMember: TeamMember = {
//       name: '',
//       role: '',
//       image: null,
//       github: '',
//       linkedin: '',
//     };
//     setTeamMembers([...teamMembers, newMember]);
//   };

//   const handleSave = async () => {
//     try {
//       const formData = new FormData();

//       teamMembers.forEach((member, index) => {
//         formData.append('name', member.name);
//         formData.append('role', member.role);
//         formData.append('github', member.github);
//         formData.append('linkedin', member.linkedin);

//         if (member.image && member.image.startsWith('data:image')) {
//           const base64Data = member.image.split(',')[1];
//           const byteCharacters = atob(base64Data);
//           const byteNumbers = new Array(byteCharacters.length);
//           for (let i = 0; i < byteCharacters.length; i++) {
//             byteNumbers[i] = byteCharacters.charCodeAt(i);
//           }
//           const byteArray = new Uint8Array(byteNumbers);
//           const blob = new Blob([byteArray], { type: 'image/jpeg' });

//           formData.append('image', blob, `profile_${index}.jpg`);
//         }
//       });

//       await axios.post('http://localhost:5001/api/team/add-team-member', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       alert('Team members saved successfully!');
//     } catch (error) {
//       console.error('Error saving team members:', error);
//       alert('Error saving team members. Please try again.');
//     }
//   };

//   return (
//     <div id="vanta-bg" className="min-h-screen relative overflow-hidden p-10 text-white">
//       <div className="relative z-10">
//         <button
//           onClick={() => navigate('/admin')}
//           className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
//         >
//           <ArrowLeft className="mr-2" /> Back
//         </button>

//         <div className="flex justify-between items-center mb-6 gap-4 mt-4">
//           <h2 className="text-2xl font-bold">Team Management</h2>
//           <div className="flex gap-2">
//             <button
//               onClick={handleAddMember}
//               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//             >
//               <Plus className="mr-2" /> Add Member
//             </button>
//             <button
//               onClick={handleSave}
//               className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//             >
//               <Save className="mr-2" /> Save Changes
//             </button>
//           </div>
//         </div>

//         <div className="space-y-6">
//           {teamMembers.map((member, index) => (
//             <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-200 mb-2">Profile Image</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => handleImageUpload(index, e)}
//                     className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white"
//                   />
//                   {member.image && (
//                     <div className="mt-4">
//                       <img
//                         src={member.image}
//                         alt={member.name}
//                         className="w-32 h-32 object-cover rounded-full"
//                       />
//                     </div>
//                   )}
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center">
//                       <Users className="mr-2" /> Name
//                     </label>
//                     <input
//                       type="text"
//                       value={member.name}
//                       onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
//                       className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-200 mb-2">Role</label>
//                     <input
//                       type="text"
//                       value={member.role}
//                       onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
//                       className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center">
//                       <Github className="mr-2" /> GitHub URL
//                     </label>
//                     <input
//                       type="text"
//                       value={member.github}
//                       onChange={(e) => handleMemberChange(index, 'github', e.target.value)}
//                       className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center">
//                       <Linkedin className="mr-2" /> LinkedIn URL
//                     </label>
//                     <input
//                       type="text"
//                       value={member.linkedin}
//                       onChange={(e) => handleMemberChange(index, 'linkedin', e.target.value)}
//                       className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeamManagement;













//imagkit version
// import { ChangeEvent, useEffect, useState } from 'react';
// import { Users, Github, Linkedin, Save, ArrowLeft, Plus } from 'lucide-react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import * as THREE from 'three';
// import NET from 'vanta/dist/vanta.net.min';

// interface TeamMember {
//   name: string;
//   role: string;
//   image: File | string | null; // File (new) OR ImageKit URL (string)
//   github: string;
//   linkedin: string;
// }

// const TeamManagement = () => {
//   const navigate = useNavigate();
//   const [vantaEffect, setVantaEffect] = useState<any>(null);
//   const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

//   useEffect(() => {
//     if (!vantaEffect) {
//       setVantaEffect(
//         NET({
//           el: '#vanta-bg',
//           THREE,
//           color: 0x0ff0fc,
//           backgroundColor: 0x111827,
//           points: 12,
//           maxDistance: 20,
//           spacing: 15,
//         })
//       );
//     }
//     return () => { if (vantaEffect) vantaEffect.destroy(); };
//   }, [vantaEffect]);

//   const fetchTeamMembers = async () => {
//     try {
//       const res = await axios.get('http://localhost:5001/api/team/get-team-members');
//       const formatted = res.data.map((m: any) => ({
//         name: m.name || '',
//         role: m.role || '',
//         image: m.image || null, // ImageKit URL
//         github: m.github || '',
//         linkedin: m.linkedin || ''
//       }));
//       setTeamMembers(formatted);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => { fetchTeamMembers(); }, []);

//   const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
//     const updated = [...teamMembers];
//     updated[index] = { ...updated[index], [field]: value };
//     setTeamMembers(updated);
//   };

//   const handleImageUpload = (index: number, e: ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files?.length) return;
//     const file = e.target.files[0];
//     const updated = [...teamMembers];
//     updated[index].image = file; // store File object
//     setTeamMembers(updated);
//   };

//   const handleAddMember = () => {
//     setTeamMembers([...teamMembers, { name: '', role: '', image: null, github: '', linkedin: '' }]);
//   };

//   const handleSave = async () => {
//     try {
//       const formData = new FormData();

//       teamMembers.forEach(member => {
//         formData.append('name', member.name);
//         formData.append('role', member.role);
//         formData.append('github', member.github);
//         formData.append('linkedin', member.linkedin);

//         if (member.image instanceof File) {
//           formData.append('image', member.image);
//         }
//       });

//       await axios.post('http://localhost:5001/api/team/add-team-member', formData);
//       alert('Team updated successfully!');
//       fetchTeamMembers(); // reload fresh CDN URLs
//     } catch (error) {
//       console.error(error);
//       alert('Error saving team members');
//     }
//   };

//   return (
//     <div id="vanta-bg" className="min-h-screen relative overflow-hidden p-10 text-white">
//       <div className="relative z-10">
//         <button
//           onClick={() => navigate('/admin')}
//           className="flex items-center px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
//         >
//           <ArrowLeft className="mr-2" /> Back
//         </button>

//         <div className="flex justify-between items-center mb-6 gap-4 mt-4">
//           <h2 className="text-2xl font-bold">Team Management</h2>
//           <div className="flex gap-2">
//             <button onClick={handleAddMember} className="flex items-center px-4 py-2 bg-blue-600 rounded-lg">
//               <Plus className="mr-2" /> Add Member
//             </button>
//             <button onClick={handleSave} className="flex items-center px-4 py-2 bg-green-600 rounded-lg">
//               <Save className="mr-2" /> Save Changes
//             </button>
//           </div>
//         </div>

//         <div className="space-y-6">
//           {teamMembers.map((member, index) => (
//             <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-200 mb-2">Profile Image</label>
//                   <input type="file" accept="image/*" onChange={(e) => handleImageUpload(index, e)} />
//                   {member.image && (
//                     <div className="mt-4">
//                       <img
//                         src={member.image instanceof File ? URL.createObjectURL(member.image) : member.image}
//                         className="w-32 h-32 object-cover rounded-full"
//                       />
//                     </div>
//                   )}
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center">
//                       <Users className="mr-2" /> Name
//                     </label>
//                     <input
//                       type="text"
//                       value={member.name}
//                       onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
//                       className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-200 mb-2">Role</label>
//                     <input
//                       type="text"
//                       value={member.role}
//                       onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
//                       className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white"
//                     />
//                   </div>


//                   <div>
//                     <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center">
//                       <Github className="mr-2" /> GitHub URL
//                     </label>
//                     <input
//                       type="text"
//                       value={member.github}
//                       onChange={(e) => handleMemberChange(index, 'github', e.target.value)}
//                       className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center">
//                       <Linkedin className="mr-2" /> LinkedIn URL
//                     </label>
//                     <input
//                       type="text"
//                       value={member.linkedin}
//                       onChange={(e) => handleMemberChange(index, 'linkedin', e.target.value)}
//                       className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white"
//                     />
//                   </div>

//                   {/* <input type="text" value={member.name} onChange={(e) => handleMemberChange(index, 'name', e.target.value)} placeholder="Name" className="w-full bg-white/10 p-2 rounded" />
//                   <input type="text" value={member.role} onChange={(e) => handleMemberChange(index, 'role', e.target.value)} placeholder="Role" className="w-full bg-white/10 p-2 rounded" />
//                   <input type="text" value={member.github} onChange={(e) => handleMemberChange(index, 'github', e.target.value)} placeholder="GitHub URL" className="w-full bg-white/10 p-2 rounded" />
//                   <input type="text" value={member.linkedin} onChange={(e) => handleMemberChange(index, 'linkedin', e.target.value)} placeholder="LinkedIn URL" className="w-full bg-white/10 p-2 rounded" /> */}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeamManagement;
















// without vanta effect
import { ChangeEvent, useEffect, useState } from 'react';
import { Users, Github, Linkedin, Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface TeamMember {
  id: number | null; // DB id (null = not saved yet)
  name: string;
  role: string;
  image: File | string | null; // File (new) OR ImageKit URL (string)
  fileId: string | null; // ImageKit fileId for existing image
  github: string;
  linkedin: string;
}

const TeamManagement = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const fetchTeamMembers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/team/get-team-members`);
      const formatted = res.data.map((m: any) => ({
        id: m.id ?? null,
        name: m.name || '',
        role: m.role || '',
        image: m.image || null, // ImageKit URL
        fileId: m.fileId || null,
        github: m.github || '',
        linkedin: m.linkedin || ''
      }));
      setTeamMembers(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const handleImageUpload = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const updated = [...teamMembers];
    updated[index].image = file; // store File object
    setTeamMembers(updated);
  };

  const handleAddMember = () => {
    if (teamMembers.length >= 7) {
      alert('You can add up to 7 team members only.');
      return;
    }
    setTeamMembers([
      ...teamMembers,
      { id: null, name: '', role: '', image: null, fileId: null, github: '', linkedin: '' }
    ]);
  };

  // Save / update a SINGLE member (per-member button)
  const handleSaveMember = async (index: number) => {
    const member = teamMembers[index];
    try {
      const formData = new FormData();
      if (member.id) formData.append('id', String(member.id));
      formData.append('name', member.name);
      formData.append('role', member.role);
      formData.append('github', member.github);
      formData.append('linkedin', member.linkedin);

      // Only send the image if the admin picked a new file for this member
      if (member.image instanceof File) {
        formData.append('image', member.image);
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/team/save-member`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const saved = res.data.member;
      // Sync this member with the saved DB record (id + fresh image URL)
      setTeamMembers(prev =>
        prev.map((m, i) =>
          i === index
            ? {
                ...m,
                id: saved.id,
                image: saved.image || null,
                fileId: saved.fileId || null
              }
            : m
        )
      );

      alert(`${member.name || 'Member'} ${member.id ? 'updated' : 'saved'} successfully!`);
    } catch (error) {
      console.error(error);
      alert('Error saving member. Please try again.');
    }
  };

  // Delete a SINGLE member
  const handleDeleteMember = async (index: number) => {
    const member = teamMembers[index];
    if (!window.confirm(`Remove ${member.name || 'this member'}?`)) return;

    try {
      if (member.id) {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/team/delete-member/${member.id}`
        );
      }
      setTeamMembers(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error(error);
      alert('Error removing member. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black p-8 md:p-10 text-white">
      <div>
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors mb-8"
        >
          <ArrowLeft className="mr-2" /> Back
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Team Management</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAddMember}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Plus className="mr-2 h-5 w-5" /> Add Member
            </button>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-gray-900/70 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-gray-800"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left column - Image */}
                <div className="flex flex-col items-center sm:items-start">
                  <label className="block text-sm font-medium text-gray-300 mb-3 self-start">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, e)}
                    className="w-full max-w-xs text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-700 file:text-white hover:file:bg-gray-600 file:cursor-pointer cursor-pointer"
                  />

                  {member.image && (
                    <div className="mt-5">
                      <img
                        src={member.image instanceof File ? URL.createObjectURL(member.image) : member.image}
                        alt={`${member.name || 'Team member'} profile`}
                        className="w-40 h-40 object-cover rounded-full border-2 border-gray-700 shadow-md"
                      />
                    </div>
                  )}
                </div>

                {/* Right column - Fields */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                      <Users className="mr-2 h-4 w-4" /> Name
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Role / Position</label>
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g. Full Stack Developer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                      <Github className="mr-2 h-4 w-4" /> GitHub
                    </label>
                    <input
                      type="text"
                      value={member.github}
                      onChange={(e) => handleMemberChange(index, 'github', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="https://github.com/username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                      <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                    </label>
                    <input
                      type="text"
                      value={member.linkedin}
                      onChange={(e) => handleMemberChange(index, 'linkedin', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
              </div>

              {/* Per-member actions */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-800">
                <button
                  onClick={() => handleDeleteMember(index)}
                  className="flex items-center px-4 py-2 bg-red-600/90 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <Trash2 className="mr-2 h-5 w-5" /> Remove
                </button>
                <button
                  onClick={() => handleSaveMember(index)}
                  className="flex items-center px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  <Save className="mr-2 h-5 w-5" /> {member.id ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;