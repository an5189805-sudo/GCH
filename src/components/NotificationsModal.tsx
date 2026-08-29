import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Bell,
  X,
  CheckCheck,
  Package,
  MessageSquare,
  Star,
  Info,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { CustomerNotification, NotificationType } from '../types';

export const NotificationsModal: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    openOrder,
    openProduct,
    goToContact,
  } = useStore();

  if (!isNotificationsOpen) return null;

  const handleNotificationClick = (n: CustomerNotification) => {
    markNotificationAsRead(n.id);
    setIsNotificationsOpen(false);

    if (n.type === 'order' && n.relatedId) {
      openOrder(n.relatedId);
    } else if (n.type === 'review' && n.relatedId) {
      openProduct(n.relatedId);
    } else if (n.type === 'message') {
      goToContact();
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'order':
        return <Package className="w-4 h-4 text-amber-500" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'review':
        return <Star className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-stone-500" />;
    }
  };

  return (
    <div
      id="notifications-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end"
      onClick={() => setIsNotificationsOpen(false)}
    >
      <div
        id="notifications-drawer"
        className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-stone-100 text-stone-800">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">Notifications</h2>
              <span className="text-[11px] text-stone-500">
                {unreadNotificationCount > 0
                  ? `${unreadNotificationCount} unread update${unreadNotificationCount > 1 ? 's' : ''}`
                  : 'All caught up'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadNotificationCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                className="px-2.5 py-1 text-[11px] font-semibold text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1.5 rounded-xl border border-stone-200 text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List of Notifications */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-stone-100">
          {notifications.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <Bell className="w-6 h-6 stroke-1" />
              </div>
              <p className="text-sm font-bold text-stone-800">No notifications.</p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                When you place orders, send inquiries, or receive updates, they will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const formattedTime = new Date(notif.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 rounded-2xl transition-all cursor-pointer group flex items-start gap-3 my-1 ${
                    !notif.isRead
                      ? 'bg-amber-50/50 hover:bg-amber-50/80 border border-amber-100/80'
                      : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white border border-stone-200 shadow-xs shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`text-xs font-bold truncate ${
                          !notif.isRead ? 'text-stone-950' : 'text-stone-700'
                        }`}
                      >
                        {notif.title}
                      </h3>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-stone-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formattedTime}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-900 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
