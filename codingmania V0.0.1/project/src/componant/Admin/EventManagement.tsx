
// import { useState, useEffect } from 'react';
// import { Calendar, MapPin, Users, Plus, Save, Trash, DollarSign, Tag, Info, FileText, Clock, ArrowLeft } from 'lucide-react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// interface Rule {
//   text: string;
// }

// interface Event {
//   id?: number;
//   title: string;
//   date: string;
//   location: string;
//   participants: string;
//   image: string;
//   prize_pool: string;
//   entry_fee: string;
//   categories: string;
//   about: string;
//   rules_guidelines: Rule[];
//   registration_start: string;
//   registration_end: string;
//   event_start: string;
//   event_end: string;
//   fileId?: string;        // added for completeness (used in your upload/save logic)
// }

// const EventsManagement = () => {
//   const [events, setEvents] = useState<Event[]>([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const fetchEvents = async () => {
//     try {
//       const response = await axios.get('http://localhost:5001/api/events/get-events');
//       const processedEvents = response.data.map((event: any) => ({
//         ...event,
//         rules_guidelines: event.rules_guidelines
//           ? typeof event.rules_guidelines === 'string'
//             ? JSON.parse(event.rules_guidelines)
//             : event.rules_guidelines
//           : [],
//       }));

//       const formatDate = (iso: string) => (iso ? iso.split('T')[0] : '');

//       const finalEvents = processedEvents.map((event: any) => ({
//         ...event,
//         date: formatDate(event.date),
//         registration_start: formatDate(event.registration_start),
//         registration_end: formatDate(event.registration_end),
//         event_start: formatDate(event.event_start),
//         event_end: formatDate(event.event_end),
//       }));

//       setEvents(finalEvents);
//     } catch (error) {
//       console.error('Error fetching events:', error);
//     }
//   };

//   const handleAddEvent = () => {
//     setEvents([
//       ...events,
//       {
//         title: 'New Event',
//         date: '',
//         location: '',
//         participants: '',
//         image: '',
//         prize_pool: '',
//         entry_fee: '',
//         categories: '',
//         about: '',
//         rules_guidelines: [{ text: '' }],
//         registration_start: '',
//         registration_end: '',
//         event_start: '',
//         event_end: '',
//       },
//     ]);
//   };

//   const handleDeleteEvent = async (index: number) => {
//     try {
//       const eventToDelete = events[index];
//       if (eventToDelete.id) {
//         await axios.delete(`http://localhost:5001/api/events/delete-event/${eventToDelete.id}`);
//       }
//       setEvents(events.filter((_, i) => i !== index));
//     } catch (error) {
//       console.error('Error deleting event:', error);
//       alert('Error deleting event. Please try again.');
//     }
//   };

//   const handleEventChange = (index: number, field: keyof Event, value: any) => {
//     const updatedEvents = [...events];
//     updatedEvents[index] = { ...updatedEvents[index], [field]: value };
//     setEvents(updatedEvents);
//   };

//   const handleRuleChange = (eventIndex: number, ruleIndex: number, value: string) => {
//     const updatedEvents = [...events];
//     const updatedRules = [...updatedEvents[eventIndex].rules_guidelines];
//     updatedRules[ruleIndex] = { text: value };
//     updatedEvents[eventIndex].rules_guidelines = updatedRules;
//     setEvents(updatedEvents);
//   };

//   const handleAddRule = (eventIndex: number) => {
//     if (events[eventIndex].rules_guidelines.length < 6) {
//       const updatedEvents = [...events];
//       updatedEvents[eventIndex].rules_guidelines = [
//         ...updatedEvents[eventIndex].rules_guidelines,
//         { text: '' },
//       ];
//       setEvents(updatedEvents);
//     } else {
//       alert('Maximum 6 rules and guidelines allowed.');
//     }
//   };

//   const handleDeleteRule = (eventIndex: number, ruleIndex: number) => {
//     const updatedEvents = [...events];
//     updatedEvents[eventIndex].rules_guidelines = updatedEvents[eventIndex].rules_guidelines.filter(
//       (_, i) => i !== ruleIndex
//     );
//     setEvents(updatedEvents);
//   };

//   const handleImageUpload = async (index: number, file: File) => {
//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       const res = await axios.post("http://localhost:5001/api/events/upload-event-image", formData);
//       const updated = [...events];
//       updated[index].image = res.data.imageUrl;
//       updated[index].fileId = res.data.fileId;
//       setEvents(updated);
//     } catch (err) {
//       console.error("Image upload failed:", err);
//       alert("Failed to upload image");
//     }
//   };

//   const handleSave = async () => {
//     const formatted = events.map((e) => ({
//       ...e,
//       imageUrl: e.image,
//       fileId: e.fileId,
//       rules_guidelines: JSON.stringify(e.rules_guidelines),
//     }));

//     try {
//       await axios.post("http://localhost:5001/api/events/update-events", { events: formatted });
//       alert("Saved!");
//       fetchEvents();
//     } catch (err) {
//       console.error("Save failed:", err);
//       alert("Failed to save events");
//     }
//   };

//   return (
//     <div className="min-h-screen p-6 bg-black text-white">
//       <div className="max-w-7xl mx-auto">
//         <button
//           onClick={() => navigate('/admin')}
//           className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors mb-6"
//         >
//           <ArrowLeft className="mr-2" /> Back
//         </button>

//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-3xl font-bold">Events Management</h2>
//           <div className="flex space-x-4">
//             <button
//               onClick={handleAddEvent}
//               className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//             >
//               <Plus className="mr-2 h-5 w-5" /> Add Event
//             </button>
//             <button
//               onClick={handleSave}
//               className="flex items-center px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//             >
//               <Save className="mr-2 h-5 w-5" /> Save Changes
//             </button>
//           </div>
//         </div>

//         <div className="space-y-8">
//           {events.map((event, index) => (
//             <div
//               key={index}
//               className="bg-gray-900/70 backdrop-blur-sm p-6 rounded-xl border border-gray-800 relative"
//             >
//               <button
//                 onClick={() => handleDeleteEvent(index)}
//                 className="absolute top-5 right-5 text-red-500 hover:text-red-400 transition-colors"
//                 title="Delete event"
//               >
//                 <Trash className="h-6 w-6" />
//               </button>

//               {/* Basic Info Section */}
//               <h3 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-3">
//                 Basic Information
//               </h3>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Image</label>
//                   <input
//                     type="text"
//                     value={event.image}
//                     onChange={(e) => handleEventChange(index, 'image', e.target.value)}
//                     className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-400"
//                     placeholder="Paste image URL"
//                   />
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => {
//                       const file = e.target.files?.[0];
//                       if (file) handleImageUpload(index, file);
//                     }}
//                     className="mt-3 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
//                   />
//                   {event.image && (
//                     <div className="mt-5">
//                       <img
//                         src={event.image}
//                         alt={event.title}
//                         className="w-full h-64 object-cover rounded-lg border border-gray-700 shadow-md"
//                         onError={(e) => {
//                           (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x400?text=Image+Not+Found";
//                         }}
//                       />
//                     </div>
//                   )}
//                 </div>

//                 <div className="space-y-5">
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Title</label>
//                     <input
//                       type="text"
//                       value={event.title}
//                       onChange={(e) => handleEventChange(index, 'title', e.target.value)}
//                       className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-2">Date</label>
//                     <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
//                       <Calendar className="mr-3 h-5 w-5 text-gray-400" />
//                       <input
//                         type="date"
//                         value={event.date}
//                         onChange={(e) => handleEventChange(index, 'date', e.target.value)}
//                         className="w-full bg-transparent text-white"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-2">Location</label>
//                     <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
//                       <MapPin className="mr-3 h-5 w-5 text-gray-400" />
//                       <input
//                         type="text"
//                         value={event.location}
//                         onChange={(e) => handleEventChange(index, 'location', e.target.value)}
//                         className="w-full bg-transparent text-white"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-2">Participants</label>
//                     <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
//                       <Users className="mr-3 h-5 w-5 text-gray-400" />
//                       <input
//                         type="text"
//                         value={event.participants}
//                         onChange={(e) => handleEventChange(index, 'participants', e.target.value)}
//                         className="w-full bg-transparent text-white"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Financial Info */}
//               <h3 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-3">
//                 Financial Information
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Prize Pool</label>
//                   <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
//                     <DollarSign className="mr-3 h-5 w-5 text-gray-400" />
//                     <input
//                       type="text"
//                       value={event.prize_pool}
//                       onChange={(e) => handleEventChange(index, 'prize_pool', e.target.value)}
//                       className="w-full bg-transparent text-white"
//                       placeholder="e.g. ₹25,000"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">Entry Fee</label>
//                   <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
//                     <DollarSign className="mr-3 h-5 w-5 text-gray-400" />
//                     <input
//                       type="text"
//                       value={event.entry_fee}
//                       onChange={(e) => handleEventChange(index, 'entry_fee', e.target.value)}
//                       className="w-full bg-transparent text-white"
//                       placeholder="e.g. ₹800 per team"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Categories */}
//               <h3 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-3">Categories</h3>
//               <div className="mb-10">
//                 <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
//                   <Tag className="mr-3 h-5 w-5 text-gray-400" />
//                   <input
//                     type="text"
//                     value={event.categories}
//                     onChange={(e) => handleEventChange(index, 'categories', e.target.value)}
//                     className="w-full bg-transparent text-white"
//                     placeholder="e.g. FPS, MOBA, Robotics, Quiz"
//                   />
//                 </div>
//               </div>

//               {/* About */}
//               <h3 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-3">About Event</h3>
//               <div className="mb-10">
//                 <div className="flex items-start bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white">
//                   <Info className="mr-3 mt-2.5 h-5 w-5 text-gray-400" />
//                   <textarea
//                     value={event.about}
//                     onChange={(e) => handleEventChange(index, 'about', e.target.value)}
//                     className="w-full bg-transparent min-h-[140px] resize-y focus:outline-none"
//                     placeholder="Describe the event, what to expect, who should participate..."
//                   />
//                 </div>
//               </div>

//               {/* Rules & Guidelines */}
//               <h3 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-3 flex items-center justify-between">
//                 <span>Rules & Guidelines</span>
//                 <button
//                   onClick={() => handleAddRule(index)}
//                   className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={event.rules_guidelines.length >= 6}
//                 >
//                   <Plus className="inline h-4 w-4 mr-1" /> Add Rule
//                 </button>
//               </h3>
//               <div className="mb-10 space-y-4">
//                 {event.rules_guidelines.map((rule, ruleIndex) => (
//                   <div key={ruleIndex} className="flex items-start gap-3">
//                     <div className="flex-grow flex items-start bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
//                       <FileText className="mr-3 mt-2 h-5 w-5 text-gray-400" />
//                       <input
//                         type="text"
//                         value={rule.text}
//                         onChange={(e) => handleRuleChange(index, ruleIndex, e.target.value)}
//                         className="w-full bg-transparent text-white placeholder-gray-500"
//                         placeholder={`Rule / Guideline ${ruleIndex + 1}`}
//                       />
//                     </div>
//                     <button
//                       onClick={() => handleDeleteRule(index, ruleIndex)}
//                       className="mt-1.5 text-red-500 hover:text-red-400 transition"
//                     >
//                       <Trash className="h-5 w-5" />
//                     </button>
//                   </div>
//                 ))}

//                 {event.rules_guidelines.length === 0 && (
//                   <p className="text-gray-500 italic text-center py-4">
//                     No rules added yet. Click "Add Rule" (max 6)
//                   </p>
//                 )}
//               </div>

//               {/* Dates & Times */}
//               <h3 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-3">
//                 Dates & Times
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Registration Start</label>
//                   <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
//                     <Clock className="mr-3 h-5 w-5 text-gray-400" />
//                     <input
//                       type="date"
//                       value={event.registration_start}
//                       onChange={(e) => handleEventChange(index, 'registration_start', e.target.value)}
//                       className="w-full bg-transparent text-white"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">Registration End</label>
//                   <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
//                     <Clock className="mr-3 h-5 w-5 text-gray-400" />
//                     <input
//                       type="date"
//                       value={event.registration_end}
//                       onChange={(e) => handleEventChange(index, 'registration_end', e.target.value)}
//                       className="w-full bg-transparent text-white"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">Event Start</label>
//                   <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
//                     <Clock className="mr-3 h-5 w-5 text-gray-400" />
//                     <input
//                       type="date"
//                       value={event.event_start}
//                       onChange={(e) => handleEventChange(index, 'event_start', e.target.value)}
//                       className="w-full bg-transparent text-white"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">Event End</label>
//                   <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
//                     <Clock className="mr-3 h-5 w-5 text-gray-400" />
//                     <input
//                       type="date"
//                       value={event.event_end}
//                       onChange={(e) => handleEventChange(index, 'event_end', e.target.value)}
//                       className="w-full bg-transparent text-white"
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

// export default EventsManagement;



















// EventsManagement.tsx - Updated with registration_open toggle
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Plus, Save, Trash, DollarSign, Tag, Info, FileText, Clock, ArrowLeft, ToggleLeft, ToggleRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Rule {
  text: string;
}

interface Event {
  id?: number;
  title: string;
  date: string;
  location: string;
  participants: string;
  image: string;
  prize_pool: string;
  entry_fee: string;
  categories: string;
  about: string;
  rules_guidelines: Rule[];
  registration_start: string;
  registration_end: string;
  event_start: string;
  event_end: string;
  fileId?: string;
  registration_open: boolean;  // NEW FIELD
}

const EventsManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/events/get-events`);
      const processedEvents = response.data.map((event: any) => ({
        ...event,
        rules_guidelines: event.rules_guidelines
          ? typeof event.rules_guidelines === 'string'
            ? JSON.parse(event.rules_guidelines)
            : event.rules_guidelines
          : [],
        registration_open: event.registration_open ?? true,  // NEW FIELD
      }));

      const formatDate = (iso: string) => (iso ? iso.split('T')[0] : '');

      const finalEvents = processedEvents.map((event: any) => ({
        ...event,
        date: formatDate(event.date),
        registration_start: formatDate(event.registration_start),
        registration_end: formatDate(event.registration_end),
        event_start: formatDate(event.event_start),
        event_end: formatDate(event.event_end),
      }));

      setEvents(finalEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleAddEvent = () => {
    setEvents([
      ...events,
      {
        title: 'New Event',
        date: '',
        location: '',
        participants: '',
        image: '',
        prize_pool: '',
        entry_fee: '',
        categories: '',
        about: '',
        rules_guidelines: [{ text: '' }],
        registration_start: '',
        registration_end: '',
        event_start: '',
        event_end: '',
        registration_open: true,  // NEW FIELD DEFAULT
      },
    ]);
  };

  const handleDeleteEvent = async (index: number) => {
    try {
      const eventToDelete = events[index];
      if (eventToDelete.id) {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/events/delete-event/${eventToDelete.id}`);
      }
      setEvents(events.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event. Please try again.');
    }
  };

  const handleEventChange = (index: number, field: keyof Event, value: any) => {
    const updatedEvents = [...events];
    updatedEvents[index] = { ...updatedEvents[index], [field]: value };
    setEvents(updatedEvents);
  };

  const handleRuleChange = (eventIndex: number, ruleIndex: number, value: string) => {
    const updatedEvents = [...events];
    const updatedRules = [...updatedEvents[eventIndex].rules_guidelines];
    updatedRules[ruleIndex] = { text: value };
    updatedEvents[eventIndex].rules_guidelines = updatedRules;
    setEvents(updatedEvents);
  };

  const handleAddRule = (eventIndex: number) => {
    if (events[eventIndex].rules_guidelines.length < 6) {
      const updatedEvents = [...events];
      updatedEvents[eventIndex].rules_guidelines = [
        ...updatedEvents[eventIndex].rules_guidelines,
        { text: '' },
      ];
      setEvents(updatedEvents);
    } else {
      alert('Maximum 6 rules and guidelines allowed.');
    }
  };

  const handleDeleteRule = (eventIndex: number, ruleIndex: number) => {
    const updatedEvents = [...events];
    updatedEvents[eventIndex].rules_guidelines = updatedEvents[eventIndex].rules_guidelines.filter(
      (_, i) => i !== ruleIndex
    );
    setEvents(updatedEvents);
  };

  const handleImageUpload = async (index: number, file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/events/upload-event-image`, formData);
      const updated = [...events];
      updated[index].image = res.data.imageUrl;
      updated[index].fileId = res.data.fileId;
      setEvents(updated);
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload image");
    }
  };

  const handleSave = async () => {
    const formatted = events.map((e) => ({
      ...e,
      imageUrl: e.image,
      fileId: e.fileId,
      rules_guidelines: JSON.stringify(e.rules_guidelines),
    }));

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/events/update-events`, { events: formatted });
      alert("Saved!");
      fetchEvents();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save events");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors mb-6"
        >
          <ArrowLeft className="mr-2" /> Back
        </button>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Events Management</h2>
          <div className="flex space-x-4">
            <button
              onClick={handleAddEvent}
              className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="mr-2 h-5 w-5" /> Add Event
            </button>
            <button
              onClick={handleSave}
              className="flex items-center px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Save className="mr-2 h-5 w-5" /> Save Changes
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-gray-900/70 backdrop-blur-sm p-6 rounded-xl border border-gray-800 relative"
            >
              <button
                onClick={() => handleDeleteEvent(index)}
                className="absolute top-5 right-5 text-red-500 hover:text-red-400 transition-colors"
                title="Delete event"
              >
                <Trash className="h-6 w-6" />
              </button>

              {/* Basic Info Section */}
              <h3 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-3">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <div>
                  <label className="block text-sm font-medium mb-2">Image</label>
                  <input
                    type="text"
                    value={event.image}
                    onChange={(e) => handleEventChange(index, 'image', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-400"
                    placeholder="Paste image URL"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(index, file);
                    }}
                    className="mt-3 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
                  />
                  {event.image && (
                    <div className="mt-5">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-64 object-cover rounded-lg border border-gray-700 shadow-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x400?text=Image+Not+Found";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={event.title}
                      onChange={(e) => handleEventChange(index, 'title', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
                      <Calendar className="mr-3 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        value={event.date}
                        onChange={(e) => handleEventChange(index, 'date', e.target.value)}
                        className="w-full bg-transparent text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
                      <MapPin className="mr-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={event.location}
                        onChange={(e) => handleEventChange(index, 'location', e.target.value)}
                        className="w-full bg-transparent text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Participants</label>
                    <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
                      <Users className="mr-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={event.participants}
                        onChange={(e) => handleEventChange(index, 'participants', e.target.value)}
                        className="w-full bg-transparent text-white"
                      />
                    </div>
                  </div>

                  {/* NEW: Registration Open Toggle */}
                  {/* <div className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
                    <label className="text-sm font-medium text-gray-300">Registration Open</label>
                    <button
                      onClick={() => handleEventChange(index, 'registration_open', !event.registration_open)}
                      className={`p-1 rounded-full transition-colors ${
                        event.registration_open ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    >
                      {event.registration_open ? <ToggleRight className="h-6 w-6 text-white" /> : <ToggleLeft className="h-6 w-6 text-white" />}
                    </button>
                  </div> */}
                  {/* Registration Toggle */}
<div className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
  <div className="flex items-center">
    <label className="text-sm font-medium text-gray-300 mr-3">Registration Open</label>
    <span className={`text-xs px-2 py-1 rounded-full ${
      event.registration_open ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
    }`}>
      {event.registration_open ? 'Open' : 'Closed'}
    </span>
  </div>
  <button
    onClick={() => handleEventChange(index, 'registration_open', !event.registration_open)}
    className={`p-1 rounded-full transition-all ${
      event.registration_open ? 'bg-green-600' : 'bg-red-600'
    }`}
  >
    {event.registration_open ? (
      <ToggleRight className="h-7 w-7 text-white" />
    ) : (
      <ToggleLeft className="h-7 w-7 text-white" />
    )}
  </button>
</div>
                </div>
              </div>

              {/* Financial Info */}
              <h3 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-3">
                Financial Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div>
                  <label className="block text-sm font-medium mb-2">Prize Pool</label>
                  <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
                    <DollarSign className="mr-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={event.prize_pool}
                      onChange={(e) => handleEventChange(index, 'prize_pool', e.target.value)}
                      className="w-full bg-transparent text-white"
                      placeholder="e.g. ₹25,000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Entry Fee</label>
                  <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
                    <DollarSign className="mr-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={event.entry_fee}
                      onChange={(e) => handleEventChange(index, 'entry_fee', e.target.value)}
                      className="w-full bg-transparent text-white"
                      placeholder="e.g. ₹800 per team"
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <h3 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-3">Categories</h3>
              <div className="mb-10">
                <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
                  <Tag className="mr-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={event.categories}
                    onChange={(e) => handleEventChange(index, 'categories', e.target.value)}
                    className="w-full bg-transparent text-white"
                    placeholder="e.g. FPS, MOBA, Robotics, Quiz"
                  />
                </div>
              </div>

              {/* About */}
              <h3 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-3">About Event</h3>
              <div className="mb-10">
                <div className="flex items-start bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white">
                  <Info className="mr-3 mt-2.5 h-5 w-5 text-gray-400" />
                  <textarea
                    value={event.about}
                    onChange={(e) => handleEventChange(index, 'about', e.target.value)}
                    className="w-full bg-transparent min-h-[140px] resize-y focus:outline-none"
                    placeholder="Describe the event, what to expect, who should participate..."
                  />
                </div>
              </div>

              {/* Rules & Guidelines */}
              <h3 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-3 flex items-center justify-between">
                <span>Rules & Guidelines</span>
                <button
                  onClick={() => handleAddRule(index)}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={event.rules_guidelines.length >= 6}
                >
                  <Plus className="inline h-4 w-4 mr-1" /> Add Rule
                </button>
              </h3>
              <div className="mb-10 space-y-4">
                {event.rules_guidelines.map((rule, ruleIndex) => (
                  <div key={ruleIndex} className="flex items-start gap-3">
                    <div className="flex-grow flex items-start bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
                      <FileText className="mr-3 mt-2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={rule.text}
                        onChange={(e) => handleRuleChange(index, ruleIndex, e.target.value)}
                        className="w-full bg-transparent text-white placeholder-gray-500"
                        placeholder={`Rule / Guideline ${ruleIndex + 1}`}
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteRule(index, ruleIndex)}
                      className="mt-1.5 text-red-500 hover:text-red-400 transition"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                {event.rules_guidelines.length === 0 && (
                  <p className="text-gray-500 italic text-center py-4">
                    No rules added yet. Click "Add Rule" (max 6)
                  </p>
                )}
              </div>

              {/* Dates & Times */}
              <h3 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-3">
                Dates & Times
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Registration Start</label>
                  <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
                    <Clock className="mr-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={event.registration_start}
                      onChange={(e) => handleEventChange(index, 'registration_start', e.target.value)}
                      className="w-full bg-transparent text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Registration End</label>
                  <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
                    <Clock className="mr-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={event.registration_end}
                      onChange={(e) => handleEventChange(index, 'registration_end', e.target.value)}
                      className="w-full bg-transparent text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Event Start</label>
                  <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
                    <Clock className="mr-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={event.event_start}
                      onChange={(e) => handleEventChange(index, 'event_start', e.target.value)}
                      className="w-full bg-transparent text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Event End</label>
                  <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5">
                    <Clock className="mr-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={event.event_end}
                      onChange={(e) => handleEventChange(index, 'event_end', e.target.value)}
                      className="w-full bg-transparent text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsManagement;