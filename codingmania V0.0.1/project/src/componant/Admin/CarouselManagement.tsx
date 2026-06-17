
// // without Vanta.js effect
// import { useState, useEffect, useRef, ChangeEvent } from 'react';
// import { Save, ArrowLeft } from 'lucide-react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// interface Slide {
//   title: string;
//   description: string;
//   image: File | string; // string = ImageKit URL
// }

// const CarouselManagement = () => {
//   const [slides, setSlides] = useState<Slide[]>([
//     { title: '', description: '', image: '' },
//     { title: '', description: '', image: '' },
//     { title: '', description: '', image: '' }
//   ]);

//   const fileInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null]);
//   const navigate = useNavigate();

//   // 🔥 Fetch slides correctly
//   const fetchSlides = async () => {
//     try {
//       const res = await axios.get("http://localhost:5001/api/carousel/get-slides");

//       const sorted = res.data.sort((a: any, b: any) => a.id - b.id); // FIX ORDER

//       const formatted: Slide[] = sorted.map((slide: any) => ({
//         title: slide.title,
//         description: slide.description,
//         image: slide.image // already full ImageKit URL
//       }));

//       while (formatted.length < 3) {
//         formatted.push({ title: '', description: '', image: '' });
//       }

//       setSlides(formatted);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchSlides();
//   }, []);

//   const handleSlideChange = (index: number, field: string, value: string) => {
//     const updated = [...slides];
//     updated[index] = { ...updated[index], [field]: value };
//     setSlides(updated);
//   };

//   const handleImageUpload = (index: number, e: ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files?.length) return;
//     const file = e.target.files[0];
//     const updated = [...slides];
//     updated[index].image = file;
//     setSlides(updated);
//   };

//   const handleSave = async () => {
//     try {
//       const isValid = slides.every(s => s.title && s.description && s.image);
//       if (!isValid) return alert("Fill all fields");

//       const formData = new FormData();

//       slides.forEach(s => {
//         if (s.image instanceof File) formData.append("image", s.image);
//       });

//       formData.append("slides", JSON.stringify(
//         slides.map(s => ({ title: s.title, description: s.description }))
//       ));

//       await axios.post("http://localhost:5001/api/carousel/upload-slide", formData);

//       alert("Slides updated!");
//       fetchSlides(); // reload from DB

//       fileInputRefs.current.forEach(ref => { if (ref) ref.value = ''; });

//     } catch (err) {
//       console.error(err);
//       alert("Upload failed");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black p-6 text-white">
//       <button
//         onClick={() => navigate('/admin')}
//         className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg mb-6 transition-colors"
//       >
//         <ArrowLeft className="mr-2" /> Back
//       </button>

//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-2xl font-bold">Carousel Management</h2>
//         <button
//           onClick={handleSave}
//           className="flex items-center px-5 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
//         >
//           <Save className="mr-2 h-5 w-5" /> Save Changes
//         </button>
//       </div>

//       <div className="space-y-6">
//         {slides.map((slide, index) => (
//           <div
//             key={index}
//             className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800 grid md:grid-cols-2 gap-6"
//           >
//             {/* Left: Image Upload + Preview */}
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-300">
//                 Slide {index + 1} Image
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => handleImageUpload(index, e)}
//                 ref={el => fileInputRefs.current[index] = el}
//                 className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
//               />

//               {slide.image && (
//                 <div className="mt-3">
//                   <img
//                     src={slide.image instanceof File ? URL.createObjectURL(slide.image) : slide.image}
//                     alt={`Slide ${index + 1} preview`}
//                     className="w-full h-56 object-cover rounded-lg border border-gray-700 shadow-sm"
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Right: Title + Description */}
//             <div className="space-y-5">
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
//                 <input
//                   type="text"
//                   value={slide.title}
//                   onChange={e => handleSlideChange(index, 'title', e.target.value)}
//                   className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
//                   placeholder="Enter slide title"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
//                 <textarea
//                   value={slide.description}
//                   onChange={e => handleSlideChange(index, 'description', e.target.value)}
//                   className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 min-h-[120px]"
//                   placeholder="Enter slide description"
//                 />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CarouselManagement;













//6 slids code 
// Updated admin/CarouselManagement.jsx
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Slide {
  id: number;
  title: string;
  description: string;
  image: string; // ImageKit URL
}

interface EditableSlide {
  title: string;
  description: string;
  image: File | string;
}

const CarouselManagement = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [newSlide, setNewSlide] = useState<EditableSlide>({ title: '', description: '', image: '' });
  const newFileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const fetchSlides = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/carousel/get-slides");
      setSlides(res.data); // Assuming server sorts by id asc
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleNewChange = (field: 'title' | 'description', value: string) => {
    setNewSlide((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setNewSlide((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleAddSlide = async () => {
    const { title, description, image } = newSlide;
    if (!title || !description || !image || typeof image === 'string') {
      return alert("Please fill all fields and select an image");
    }

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('title', title);
      formData.append('description', description);

      await axios.post("http://localhost:5001/api/carousel/create-slide", formData);
      alert("Slide added!");
      setNewSlide({ title: '', description: '', image: '' });
      if (newFileInputRef.current) newFileInputRef.current.value = '';
      fetchSlides();
    } catch (err) {
      console.error(err);
      alert("Add failed");
    }
  };

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2" /> Back
      </button>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Carousel Management</h2>
      </div>

      <div className="space-y-6">
        {slides.map((slide) => (
          <EditSlideComponent key={slide.id} slide={slide} onUpdate={fetchSlides} />
        ))}
      </div>

      {slides.length < 6 && (
        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800 grid md:grid-cols-2 gap-6 mt-8">
          {/* Add New Slide */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">
              New Slide Image (required)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleNewImageUpload}
              ref={newFileInputRef}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
            />
            {newSlide.image && typeof newSlide.image !== 'string' && (
              <div className="mt-3">
                <img
                  src={URL.createObjectURL(newSlide.image)}
                  alt="New slide preview"
                  className="w-full h-56 object-cover rounded-lg border border-gray-700 shadow-sm"
                />
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
              <input
                type="text"
                value={newSlide.title}
                onChange={(e) => handleNewChange('title', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter slide title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
              <textarea
                value={newSlide.description}
                onChange={(e) => handleNewChange('description', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 min-h-[120px]"
                placeholder="Enter slide description"
              />
            </div>

            <button
              onClick={handleAddSlide}
              className="flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Save className="mr-2 h-5 w-5" /> Add Slide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Subcomponent for editing/deleting each slide
const EditSlideComponent = ({ slide, onUpdate }: { slide: Slide; onUpdate: () => void }) => {
  const [editedSlide, setEditedSlide] = useState<EditableSlide>({
    title: slide.title,
    description: slide.description,
    image: slide.image,
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (field: 'title' | 'description', value: string) => {
    setEditedSlide((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setEditedSlide((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleUpdate = async () => {
    const { title, description, image } = editedSlide;
    if (!title || !description) return alert("Fill all fields");

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (image instanceof File) formData.append('image', image);

      await axios.put(`http://localhost:5001/api/carousel/update-slide/${slide.id}`, formData);
      alert("Slide updated!");
      if (fileInputRef.current) fileInputRef.current.value = '';
      onUpdate();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/carousel/delete-slide/${slide.id}`);
      alert("Slide deleted!");
      onUpdate();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800 grid md:grid-cols-2 gap-6">
      {/* Left: Image Upload + Preview */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-300">
          Slide Image (optional to change)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
        />

        {editedSlide.image && (
          <div className="mt-3">
            <img
              src={typeof editedSlide.image === 'string' ? editedSlide.image : URL.createObjectURL(editedSlide.image)}
              alt="Slide preview"
              className="w-full h-56 object-cover rounded-lg border border-gray-700 shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Right: Title + Description + Actions */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
          <input
            type="text"
            value={editedSlide.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
            placeholder="Enter slide title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
          <textarea
            value={editedSlide.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 min-h-[120px]"
            placeholder="Enter slide description"
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleUpdate}
            className="flex items-center px-5 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <Save className="mr-2 h-5 w-5" /> Update Slide
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center px-5 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <Trash2 className="mr-2 h-5 w-5" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarouselManagement;