import { useEffect, useRef, useState } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { connectSocket, getSocket } from '../../socket/socket';

interface NotificationItem {
  id?: number;
  type: string;
  title: string;
  message?: string | null;
  link?: string | null;
  read: boolean;
  created_at: string;
}

interface NotificationBellProps {
  // Called when a notification with a `link` is clicked, so the parent
  // dashboard can switch to the relevant tab.
  onNavigate?: (link: string) => void;
}

const timeAgo = (dateStr: string) => {
  const d = new Date(dateStr).getTime();
  if (isNaN(d)) return '';
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const NotificationBell = ({ onNavigate }: NotificationBellProps) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const API = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('token');

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.notifications || []);
      setUnread(data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  // Initial load + real-time socket subscription
  useEffect(() => {
    fetchNotifications();
    if (!token) return;

    const socket = getSocket() ?? connectSocket(token);
    const handler = (n: NotificationItem) => {
      setItems((prev) => [n, ...prev].slice(0, 50));
      setUnread((prev) => prev + 1);
    };
    socket?.on('notification', handler);
    return () => {
      socket?.off('notification', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const markAllRead = async () => {
    setUnread(0);
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
    try {
      await fetch(`${API}/notifications/read-all`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const onItemClick = async (n: NotificationItem) => {
    if (n.id && !n.read) {
      setItems((prev) => prev.map((i) => (i.id === n.id ? { ...i, read: true } : i)));
      setUnread((prev) => Math.max(0, prev - 1));
      try {
        await fetch(`${API}/notifications/${n.id}/read`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error(err);
      }
    }
    if (n.link && onNavigate) {
      onNavigate(n.link);
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="fixed top-4 right-6 z-[60]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl backdrop-blur-md transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-200" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-red-600 rounded-full">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-[28rem] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white">Notifications</h3>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-[11px] font-medium text-red-400 hover:text-red-300"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-gray-500">
                No notifications yet
              </div>
            ) : (
              items.map((n, idx) => (
                <button
                  key={n.id ?? idx}
                  onClick={() => onItemClick(n)}
                  className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors ${
                    !n.read ? 'bg-red-500/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && <span className="mt-1.5 w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />}
                    <div className={`flex-1 min-w-0 ${n.read ? 'pl-4' : ''}`}>
                      <p className="text-sm font-semibold text-white leading-snug">{n.title}</p>
                      {n.message && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                      )}
                      <p className="text-[10px] text-gray-500 mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                    {n.read && <Check className="w-3.5 h-3.5 text-gray-600 flex-shrink-0 mt-1" />}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
