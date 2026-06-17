import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, MapPin, Users, ArrowRight, CalendarOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Event {
    id: number;
    title: string;
    date: string;
    location: string;
    participants: string;
    image: string;
    registration_open: boolean;
}

const Events = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/events/get-events`);

            const sanitizedEvents = response.data.map((event: any) => ({
                ...event,
                date: event.date || "Date not available",
                location: event.location || "Location not provided",
                participants: event.participants || "Unknown",
                registration_open: event.registration_open ?? true,
            }));

            setEvents(sanitizedEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleParticipateClick = (eventId: number) => {
        navigate(`/event/${eventId}`);
    };

    return (
        <div className="bg-[#050505] min-h-screen relative overflow-hidden font-sans selection:bg-red-500/30 selection:text-white pt-32 pb-20">
            
            {/* Background Volumetric Lights and Grid */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-10 pointer-events-none"></div>
            <div className="absolute top-0 w-full h-full pointer-events-none z-0">
                <div className="volumetric-light-red"></div>
                <div className="volumetric-light-secondary opacity-50"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20 md:mb-28"
                >
                    <div className="inline-block px-5 py-2 bg-red-500/10 rounded-full border border-red-500/50 mb-6 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                        <span className="text-red-400 text-sm font-semibold tracking-wider uppercase flex items-center gap-2">
                            <Calendar size={16} />
                            Upcoming Events
                        </span>
                    </div>
                    <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-metallic mb-6 tracking-tighter drop-shadow-2xl">
                        Events
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Join us for exciting events and enhance your skills with hands-on experience.
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-8 rounded-full opacity-80"></div>
                </motion.div>

                {loading ? (
                    <div className="grid md:grid-cols-2 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="glass-panel rounded-2xl overflow-hidden border-t border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                                <div className="h-56 bg-white/5 animate-pulse"></div>
                                <div className="p-6 space-y-4">
                                    <div className="h-8 w-3/4 bg-white/5 rounded animate-pulse"></div>
                                    <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse"></div>
                                    <div className="h-12 bg-white/5 rounded-xl animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20">
                        <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No upcoming events at the moment.</p>
                        <p className="text-gray-600 text-sm mt-2">Check back soon for new events!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {events.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                className="group glass-panel rounded-2xl overflow-hidden border-t border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transform hover:scale-[1.02] hover:shadow-[0_15px_30px_rgba(220,38,38,0.2)] transition-all duration-300 relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={event.image || "/default.jpg"}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent"></div>
                                    
                                    {event.registration_open ? (
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full">
                                            <span className="text-green-400 text-xs font-medium">Open</span>
                                        </div>
                                    ) : (
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full">
                                            <span className="text-red-400 text-xs font-medium">Closed</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="p-6 relative">
                                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-shadow-glow transition-all">
                                        {event.title}
                                    </h3>
                                    
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center text-gray-400">
                                            <Calendar className="h-4 w-4 mr-3 text-red-500" />
                                            <span className="text-sm">{event.date}</span>
                                        </div>
                                        <div className="flex items-center text-gray-400">
                                            <MapPin className="h-4 w-4 mr-3 text-red-500" />
                                            <span className="text-sm">{event.location}</span>
                                        </div>
                                        <div className="flex items-center text-gray-400">
                                            <Users className="h-4 w-4 mr-3 text-red-500" />
                                            <span className="text-sm">{event.participants} Participants</span>
                                        </div>
                                    </div>
                                    
                                    <button
                                        className={`w-full flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-xl transition-all ${
                                            event.registration_open
                                                ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]'
                                                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                        }`}
                                        onClick={() => event.registration_open && handleParticipateClick(event.id)}
                                        disabled={!event.registration_open}
                                    >
                                        {event.registration_open ? (
                                            <>
                                                <span>View Details</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </>
                                        ) : (
                                            <>
                                                <CalendarOff className="h-4 w-4" />
                                                <span>Registration Closed</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
