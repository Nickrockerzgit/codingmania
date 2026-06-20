import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, X, Check, CreditCard } from 'lucide-react';
import axios from 'axios';

interface EventDetail {
  id: number;
  title: string;
  categories: string;
  entry_fee: string;
}

interface TeamMember {
  name: string;
  email: string;
  role: string;
}

// Load the Razorpay checkout script once
const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

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
  const [collegeName, setCollegeName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [members, setMembers] = useState<TeamMember[]>([{ name: '', email: '', role: '' }]);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/events/get-event/${id}`);
        setEvent(response.data);

        if (response.data.categories) {
          const categoryList = response.data.categories.split(',').map((cat: string) => cat.trim());
          setCategories(categoryList);
          if (categoryList.length > 0) setCategory(categoryList[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setError('Failed to load event details. Please try again later.');
        setLoading(false);
      }
    };

    if (id) fetchEventDetails();
  }, [id]);

  const addTeamMember = () => setMembers([...members, { name: '', email: '', role: '' }]);

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

  const finishSuccess = () => {
    setSuccess(true);
    setSubmitting(false);
    setTimeout(() => navigate('/'), 4000);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!teamName || !collegeName || !leaderName || !leaderEmail || !category) {
      setError('Please fill in all required fields');
      return;
    }
    const validMembers = members.filter((m) => m.name && m.email);
    if (validMembers.length === 0) {
      setError('Please add at least one valid team member');
      return;
    }

    setSubmitting(true);
    setError('');

    const registrationData = {
      eventId: id,
      teamName,
      collegeName,
      leaderName,
      leaderEmail,
      leaderPhone,
      members: JSON.stringify(validMembers),
      category,
    };

    try {
      // 1) Create an order on the backend (amount = event entry fee)
      const orderRes = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/events/create-order`, {
        eventId: id,
      });
      const order = orderRes.data;

      // Free event → register directly, no payment
      if (order.free) {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/events/verify-payment`, {
          ...registrationData,
          free: true,
        });
        finishSuccess();
        return;
      }

      // 2) Load Razorpay checkout
      const ok = await loadRazorpayScript();
      if (!ok) {
        setError('Could not load payment gateway. Please check your internet and try again.');
        setSubmitting(false);
        return;
      }

      // 3) Open Razorpay checkout popup
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Technoverse',
        description: `Registration: ${order.eventTitle}`,
        order_id: order.orderId,
        prefill: { name: leaderName, email: leaderEmail, contact: leaderPhone },
        theme: { color: '#dc2626' },
        handler: async (response: any) => {
          try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/events/verify-payment`, {
              ...registrationData,
              free: false,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            finishSuccess();
          } catch (err) {
            console.error(err);
            setError('Payment succeeded but registration failed to save. Please contact support.');
            setSubmitting(false);
          }
        },
        modal: { ondismiss: () => setSubmitting(false) },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', () => {
        setError('Payment failed. Please try again.');
        setSubmitting(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err?.response?.data?.error || 'Something went wrong. Please try again later.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-lg text-gray-300">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Back to Events
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white/[0.04] backdrop-blur-md border border-white/10 p-8 rounded-2xl max-w-md w-full text-center shadow-[0_0_40px_rgba(220,38,38,0.2)]"
        >
          <div className="mx-auto w-16 h-16 bg-red-500/15 border border-red-500/40 rounded-full flex items-center justify-center mb-6">
            <Check className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Registration Successful! 🎉</h2>
          <p className="text-gray-300 mb-6">
            Thank you for registering for <span className="text-red-400 font-semibold">{event?.title}</span>.
            A confirmation email with your event details has been sent to <span className="text-white">{leaderEmail}</span>.
          </p>
          <p className="text-gray-500 text-sm mb-6">Redirecting you to the home page…</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Go to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(`/event/${id}`)}
          className="flex items-center text-red-400 hover:text-red-300 mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Event Details
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
        >
          <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Register for <span className="text-red-500">{event?.title}</span>
            </h1>
            <p className="text-gray-400 mb-8">Fill out the form below and complete the payment to register your team.</p>

            {error && (
              <div className="bg-red-500/15 border border-red-500/40 text-red-300 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handlePayment} className="space-y-8">
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
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="collegeName" className="block text-sm font-medium text-gray-300 mb-1">
                      College Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="collegeName"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Your college / institute name"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    >
                      {categories.map((cat, index) => (
                        <option key={index} value={cat} className="bg-gray-900">{cat}</option>
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
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="leaderPhone" className="block text-sm font-medium text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="leaderPhone"
                      value={leaderPhone}
                      onChange={(e) => setLeaderPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                    className="flex items-center text-sm bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 px-3 py-1 rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Member
                  </button>
                </div>

                {members.map((member, index) => (
                  <div key={index} className="bg-white/[0.04] border border-white/10 rounded-lg p-4 mb-4">
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
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => updateMember(index, 'role', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="e.g., Developer, Designer"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment button */}
              <div className="flex flex-col items-center pt-4">
                {event?.entry_fee && (
                  <p className="text-gray-400 mb-3 text-sm">
                    Entry Fee: <span className="text-red-400 font-semibold">{event.entry_fee}</span>
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 px-10 rounded-lg shadow-[0_0_25px_rgba(220,38,38,0.4)] transform transition-all duration-300 hover:scale-105 ${
                    submitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing…
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Pay &amp; Register
                    </span>
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
