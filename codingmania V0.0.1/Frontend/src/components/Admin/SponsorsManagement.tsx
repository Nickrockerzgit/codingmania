
//imgkit version
// import { useState, useEffect, useRef, ChangeEvent } from 'react';
// import { Plus, Save, Trash, ArrowLeft } from 'lucide-react';
// import * as THREE from 'three';
// import NET from 'vanta/dist/vanta.net.min';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// interface Sponsor {
//   id?: number;
//   name: string;
//   logo: File | string | null; // File (new) OR ImageKit URL (string)
//   website: string;
// }

// const SponsorsManagement = () => {
//   const [sponsors, setSponsors] = useState<Sponsor[]>([]);
//   const vantaRef = useRef<HTMLDivElement | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const effect = NET({
//       el: vantaRef.current,
//       THREE,
//       color: 0x0ff0fc,
//       backgroundColor: 0x000000,
//       points: 12,
//       maxDistance: 25,
//       spacing: 15
//     });
//     return () => effect.destroy();
//   }, []);

//   const fetchSponsors = async () => {
//     try {
//       const res = await axios.get('http://localhost:5001/api/sponsors/get-sponsors');
//       const formatted = res.data.map((s: any) => ({
//         id: s.id,
//         name: s.name || '',
//         logo: s.logo || null, // ImageKit URL
//         website: s.website || ''
//       }));
//       setSponsors(formatted);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => { fetchSponsors(); }, []);

//   const handleChange = (index: number, field: keyof Sponsor, value: string) => {
//     const updated = [...sponsors];
//     updated[index] = { ...updated[index], [field]: value };
//     setSponsors(updated);
//   };

//   const handleLogoChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
//     if (!event.target.files?.length) return;
//     const file = event.target.files[0];
//     const updated = [...sponsors];
//     updated[index].logo = file;
//     setSponsors(updated);
//   };

//   const handleAddSponsor = () => {
//     setSponsors([...sponsors, { name: '', logo: null, website: '' }]);
//   };

//   const handleDeleteSponsor = (index: number) => {
//     setSponsors(sponsors.filter((_, i) => i !== index));
//   };

//   const handleSave = async () => {
//     try {
//       const formData = new FormData();

//       sponsors.forEach(s => {
//         formData.append('name', s.name);
//         formData.append('website', s.website);
//         if (s.logo instanceof File) {
//           formData.append('logos', s.logo);
//         }
//       });

//       await axios.post('http://localhost:5001/api/sponsors/add-sponsors', formData);
//       alert('Sponsors updated successfully!');
//       fetchSponsors(); // reload fresh ImageKit URLs
//     } catch (error) {
//       console.error(error);
//       alert('Error saving sponsors');
//     }
//   };

//   return (
//     <div ref={vantaRef} className="min-h-screen p-6 relative text-white">
//       <div className="absolute inset-0 bg-black/60"></div>

//       <div className="relative z-10">
//         <div className="flex justify-between items-center mb-6">
//           <button
//             onClick={() => navigate('/admin')}
//             className="flex items-center px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
//           >
//             <ArrowLeft className="mr-2" /> Back
//           </button>

//           <div className="flex gap-3">
//             <button
//               onClick={handleAddSponsor}
//               className="flex items-center px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
//             >
//               <Plus className="mr-2" /> Add Sponsor
//             </button>
//             <button
//               onClick={handleSave}
//               className="flex items-center px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
//             >
//               <Save className="mr-2" /> Save Changes
//             </button>
//           </div>
//         </div>

//         <h2 className="text-2xl font-bold mb-6">Sponsors Management</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {sponsors.map((sponsor, index) => (
//             <div key={index} className="bg-white/5 backdrop-blur-sm p-6 rounded-lg relative">
//               <button
//                 onClick={() => handleDeleteSponsor(index)}
//                 className="absolute top-4 right-4 text-red-500 hover:text-red-400"
//               >
//                 <Trash className="h-5 w-5" />
//               </button>

//               <div>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => handleLogoChange(index, e)}
//                   className="w-full text-white"
//                 />
//                 {sponsor.logo && (
//                   <img
//                     src={sponsor.logo instanceof File ? URL.createObjectURL(sponsor.logo) : sponsor.logo}
//                     alt={sponsor.name}
//                     className="h-20 mt-3 object-contain"
//                   />
//                 )}
//               </div>

//               <div className="space-y-4">
//                 <input
//                   type="text"
//                   value={sponsor.name}
//                   onChange={(e) => handleChange(index, 'name', e.target.value)}
//                   placeholder="Company Name"
//                   className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white"
//                 />

                

//                 <input
//                   type="text"
//                   value={sponsor.website}
//                   onChange={(e) => handleChange(index, 'website', e.target.value)}
//                   placeholder="Website URL"
//                   className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white"
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SponsorsManagement;
















// without vanta code — per-sponsor add / update / delete
import { useState, useEffect, ChangeEvent } from 'react';
import { Plus, Save, Trash, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Sponsor {
  id: number;
  name: string;
  logo: string | null; // existing ImageKit URL
  website: string;
  newLogo?: File | null; // pending replacement image (not yet saved)
}

interface NewSponsor {
  name: string;
  website: string;
  logo: File | null;
}

const SponsorsManagement = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [newSponsor, setNewSponsor] = useState<NewSponsor>({ name: '', website: '', logo: null });
  const [savingId, setSavingId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_BASE_URL;

  const fetchSponsors = async () => {
    try {
      const res = await axios.get(`${API}/sponsors/get-sponsors`);
      const formatted: Sponsor[] = res.data.map((s: any) => ({
        id: s.id,
        name: s.name || '',
        logo: s.logo || null,
        website: s.website || '',
        newLogo: null
      }));
      setSponsors(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  // ---- Existing sponsor handlers ----
  const handleChange = (index: number, field: 'name' | 'website', value: string) => {
    const updated = [...sponsors];
    updated[index] = { ...updated[index], [field]: value };
    setSponsors(updated);
  };

  const handleLogoChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    const updated = [...sponsors];
    updated[index] = { ...updated[index], newLogo: event.target.files[0] };
    setSponsors(updated);
  };

  const handleUpdate = async (index: number) => {
    const s = sponsors[index];
    try {
      setSavingId(s.id);
      const formData = new FormData();
      formData.append('name', s.name);
      formData.append('website', s.website);
      if (s.newLogo) formData.append('logos', s.newLogo);

      await axios.put(`${API}/sponsors/update-sponsor/${s.id}`, formData);
      await fetchSponsors();
    } catch (error) {
      console.error(error);
      alert('Error updating sponsor');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this sponsor?')) return;
    try {
      setSavingId(id);
      await axios.delete(`${API}/sponsors/delete-sponsor/${id}`);
      await fetchSponsors();
    } catch (error) {
      console.error(error);
      alert('Error deleting sponsor');
    } finally {
      setSavingId(null);
    }
  };

  // ---- New sponsor handlers ----
  const handleAddSponsor = async () => {
    if (!newSponsor.name || !newSponsor.website || !newSponsor.logo) {
      alert('Please add a name, website and logo image.');
      return;
    }
    try {
      setAdding(true);
      const formData = new FormData();
      formData.append('name', newSponsor.name);
      formData.append('website', newSponsor.website);
      formData.append('logos', newSponsor.logo);

      await axios.post(`${API}/sponsors/add-sponsor`, formData);
      setNewSponsor({ name: '', website: '', logo: null });
      await fetchSponsors();
    } catch (error) {
      console.error(error);
      alert('Error adding sponsor');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
        >
          <ArrowLeft className="mr-2" /> Back
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6">Sponsors Management</h2>

      {/* Add new sponsor */}
      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Plus className="mr-2" /> Add New Sponsor
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={newSponsor.name}
            onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
            placeholder="Company Name"
            className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white"
          />
          <input
            type="text"
            value={newSponsor.website}
            onChange={(e) => setNewSponsor({ ...newSponsor, website: e.target.value })}
            placeholder="Website URL"
            className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewSponsor({ ...newSponsor, logo: e.target.files?.[0] || null })}
            className="w-full text-white"
          />
          {newSponsor.logo && (
            <img
              src={URL.createObjectURL(newSponsor.logo)}
              alt="preview"
              className="h-20 object-contain"
            />
          )}
        </div>
        <button
          onClick={handleAddSponsor}
          disabled={adding}
          className="mt-4 flex items-center px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus className="mr-2" /> {adding ? 'Adding...' : 'Add Sponsor'}
        </button>
      </div>

      {/* Existing sponsors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sponsors.map((sponsor, index) => (
          <div key={sponsor.id} className="bg-white/5 backdrop-blur-sm p-6 rounded-lg relative border border-white/10">
            <button
              onClick={() => handleDelete(sponsor.id)}
              disabled={savingId === sponsor.id}
              className="absolute top-4 right-4 text-red-500 hover:text-red-400 disabled:opacity-50"
            >
              <Trash className="h-5 w-5" />
            </button>

            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleLogoChange(index, e)}
                className="w-full text-white"
              />
              {(sponsor.newLogo || sponsor.logo) && (
                <img
                  src={sponsor.newLogo ? URL.createObjectURL(sponsor.newLogo) : (sponsor.logo as string)}
                  alt={sponsor.name}
                  className="h-20 mt-3 object-contain"
                />
              )}
            </div>

            <div className="space-y-4 mt-4">
              <input
                type="text"
                value={sponsor.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
                placeholder="Company Name"
                className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white"
              />

              <input
                type="text"
                value={sponsor.website}
                onChange={(e) => handleChange(index, 'website', e.target.value)}
                placeholder="Website URL"
                className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white"
              />

              <button
                onClick={() => handleUpdate(index)}
                disabled={savingId === sponsor.id}
                className="flex items-center px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Save className="mr-2" /> {savingId === sponsor.id ? 'Saving...' : 'Update'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SponsorsManagement;
