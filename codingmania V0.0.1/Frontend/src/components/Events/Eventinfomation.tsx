
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Trophy, DollarSign, Tag, Clock, ArrowLeft } from 'lucide-react';
import axios from 'axios';

interface EventDetail {
  id: number;
  title: string;
  date: string;
  location: string;
  participants: string;
  prize_pool: string;
  entry_fee: string;
  categories: string;
  about: string;
  image: string;
  rules_guidelines: string;
  registration_start: string;
  registration_end: string;
  event_start: string;
  event_end: string;
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/events/get-event/${id}`);
        setEvent(response.data);
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

  const handleRegister = () => {
    navigate(`/register/${id}`);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date not available';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-lg">{error || 'Event not found'}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto mt-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-red-400 hover:text-red-300 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Events
        </button>
        {/* Event Details Section (Wrap on Banner) */}
        <div className="relative w-full h-[450px] rounded-xl overflow-hidden">
          <img
            src={event.image?.startsWith('http') ? event.image : `${import.meta.env.VITE_API_BASE_URL}${event.image || "/default.jpg"}`}
            alt={event.title}
            className="w-full h-full object-cover opacity-40"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-b from-[#00ffff] via-[#8000ff] to-transparent blur-xl opacity-50 mix-blend-overlay"></div> */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-700/40 to-transparent blur-xl opacity-60 mix-blend-overlay"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl font-bold text-white mb-4">{event.title}</h1>
            <p className="text-lg font-semibold text-gray-300 tracking-wide leading-relaxed">
              Join us for an exclusive event where innovation meets collaboration, and learning knows no bounds.
            </p>
          </div>
        </div>

        {/* Event Details Section (Wrap on Banner) */}
        <div className="relative bg-white/[0.03] backdrop-blur-md rounded-xl p-8 -mt-20 border border-red-500/30 shadow-[0_8px_40px_rgba(0,0,0,0.6)] w-5/6 mx-auto">
          <div className="grid grid-cols-2 gap-6">
            {[
              ['Date', event.date, Calendar],
              ['Venue', event.location, MapPin],
              ['Prize Pool', event.prize_pool, Trophy],
              ['Entry Fee', event.entry_fee, DollarSign],
              ['Spots', event.participants, Users],
              ['Category', event.categories, Tag]
            ].map(([label, value, Icon], idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 border border-white/10 rounded-lg bg-white/[0.02] transition-all duration-300 hover:border-red-500/50 hover:bg-white/[0.05] hover:shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                <Icon className="h-6 w-6 text-red-500" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{label}</h3>
                  <p className="text-gray-400">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* About Section */}
        <div className="mt-8 p-6 bg-white/[0.03] backdrop-blur-md rounded-lg border border-white/10">
          <h2 className="text-2xl font-semibold text-red-400 mb-4">About</h2>
          {event.about.split("\n").map((paragraph, index) => (
            <p key={index} className="text-gray-300 mb-4">{paragraph}</p>
          ))}
        </div>

        <div className="mt-8 p-6 bg-white/[0.03] backdrop-blur-md rounded-lg border border-white/10">
          <h2 className="text-2xl font-semibold text-red-400 mb-4">Rules & Guidelines</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            {JSON.parse(event.rules_guidelines).map((rule, index) => (
              <li key={index}>{rule.text}</li>
            ))}
          </ul>
        </div>


        {/* Important Dates Section */}
        <div className="mt-8 p-6 bg-white/[0.03] backdrop-blur-md rounded-lg border border-white/10">
          <h2 className="text-2xl font-semibold text-red-400 mb-4">Dates & Timelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Registration Dates */}
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Registration Dates</h3>
              <div className="space-y-4">
                {[
                  ["Registration Start", event.registration_start],
                  ["Registration End", event.registration_end],
                ].map(([label, date], idx) => (
                  <div key={idx} className="bg-white/[0.04] border border-white/10 p-4 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="h-5 w-5 mr-2 text-red-500" />
                      <h3 className="text-md font-semibold text-white">{label}</h3>
                    </div>
                    <p className="text-gray-300">{formatDate(date)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Dates */}
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">Event Dates</h3>
              <div className="space-y-4">
                {[
                  ["Event Start", event.event_start],
                  ["Event End", event.event_end],
                ].map(([label, date], idx) => (
                  <div key={idx} className="bg-white/[0.04] border border-white/10 p-4 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="h-5 w-5 mr-2 text-red-500" />
                      <h3 className="text-md font-semibold text-white">{label}</h3>
                    </div>
                    <p className="text-gray-300">{formatDate(date)}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleRegister}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 px-8 rounded-lg shadow-[0_0_25px_rgba(220,38,38,0.4)] transform transition-all duration-300 hover:scale-105"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
