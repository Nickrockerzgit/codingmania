
import React, { useState } from 'react';
import { Bell, Check, Trash2, Eye, Filter } from 'lucide-react';

interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'task' | 'reminder' | 'update' | 'system' | 'comment';
}

const Notifications: React.FC<NotificationProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Task Assigned",
      message: "You have been assigned a new task: 'Complete project proposal'",
      time: "2025-01-15T10:30:00",
      read: false,
      type: "task"
    },
    {
      id: 2,
      title: "Meeting Reminder",
      message: "Team meeting scheduled for tomorrow at 10:00 AM",
      time: "2025-01-14T15:45:00",
      read: true,
      type: "reminder"
    },
    {
      id: 3,
      title: "Project Update",
      message: "The project 'E-commerce Website' has been updated to 75% completion",
      time: "2025-01-13T09:15:00",
      read: false,
      type: "update"
    },
    {
      id: 4,
      title: "System Maintenance",
      message: "The system will be down for maintenance on Sunday from 2:00 AM to 4:00 AM",
      time: "2025-01-12T11:20:00",
      read: true,
      type: "system"
    },
    {
      id: 5,
      title: "New Comment",
      message: "John Doe commented on your task: 'Great work on this!'",
      time: "2025-01-11T16:10:00",
      read: false,
      type: "comment"
    }
  ]);

  const [filter, setFilter] = useState("all");

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.type === filter;
  });

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? {...notification, read: true} : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({...notification, read: true})));
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getNotificationTypeIcon = (type: string) => {
    switch(type) {
      case "task": return "🔔";
      case "reminder": return "⏰";
      case "update": return "📊";
      case "system": return "🔧";
      case "comment": return "💬";
      default: return "📌";
    }
  };

  const getNotificationTypeColor = (type: string) => {
    switch(type) {
      case "task": return "bg-blue-100 text-blue-800";
      case "reminder": return "bg-yellow-100 text-yellow-800";
      case "update": return "bg-green-100 text-green-800";
      case "system": return "bg-red-100 text-red-800";
      case "comment": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return `Today at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    } else if (diffInDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-semibold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            ×
          </button>
        </div>
        
        <div className="p-6">
          {/* Controls */}
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread</option>
                <option value="task">Tasks</option>
                <option value="reminder">Reminders</option>
                <option value="update">Updates</option>
                <option value="system">System</option>
                <option value="comment">Comments</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                disabled={!notifications.some(n => !n.read)}
              >
                <Check className="w-4 h-4 text-green-500" /> 
                Mark All Read
              </button>
              <button 
                onClick={handleClearAll}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                disabled={notifications.length === 0}
              >
                <Trash2 className="w-4 h-4 text-red-500" /> 
                Clear All
              </button>
            </div>
          </div>
          
          {/* Notifications List */}
          {filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    notification.read 
                      ? 'bg-white border-gray-200' 
                      : 'bg-blue-50 border-blue-200 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-full text-sm ${getNotificationTypeColor(notification.type)}`}>
                        {getNotificationTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{notification.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-500">{formatTime(notification.time)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {!notification.read && (
                        <button 
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                          title="Mark as Read"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors duration-200"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No notifications found.</p>
              <p className="text-gray-400 text-sm">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;