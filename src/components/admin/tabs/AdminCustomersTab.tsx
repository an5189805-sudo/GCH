/**
 * Gondal Clothes House - Admin Customers Tab
 * Customer CRM, registered profiles, order history & address management
 */

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Coins,
  Calendar,
  Eye,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { storeService } from '../../../services/storeService';
import { User, Order } from '../../../types';

interface AdminCustomersTabProps {
  onOpenOrder: (orderId: string) => void;
}

export const AdminCustomersTab: React.FC<AdminCustomersTabProps> = ({
  onOpenOrder,
}) => {
  const { showToast } = useStore();
  const users = storeService.getUsers();
  const orders = storeService.getOrders();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

  // Group orders by customer phone or email or id
  const customerStats = useMemo(() => {
    return users.map((u) => {
      const userOrders = orders.filter(
        (o) =>
          o.customerId === u.id ||
          o.customerPhone === u.phone ||
          (u.email && o.customerEmail?.toLowerCase() === u.email.toLowerCase())
      );
      const totalSpent = userOrders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0);

      return {
        user: u,
        ordersCount: userOrders.length,
        totalSpent,
        recentOrder: userOrders[0] || null,
        orders: userOrders,
      };
    });
  }, [users, orders]);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customerStats;
    const q = searchQuery.toLowerCase();
    return customerStats.filter(
      (c) =>
        c.user.name.toLowerCase().includes(q) ||
        c.user.phone.toLowerCase().includes(q) ||
        (c.user.email && c.user.email.toLowerCase().includes(q)) ||
        (c.user.address && c.user.address.city.toLowerCase().includes(q))
    );
  }, [customerStats, searchQuery]);

  const formatPKR = (amount: number) => `Rs. ${amount.toLocaleString('en-PK')}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold font-serif text-white">Customer Relationship Directory</h1>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Registered customer accounts, purchasing history, VIP spenders, and shipping profiles.
          </p>
        </div>

        <div className="text-xs text-stone-400">
          <span className="text-amber-400 font-bold text-base">{users.length}</span> registered accounts
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 shadow-xl">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers by name, phone (+92...), email, or city..."
            className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl shadow-xl overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Users className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-stone-300">No customers found</h3>
            <p className="text-xs text-stone-500 mt-1">
              Shoppers registering accounts or placing boutique orders will be listed here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-950/40 text-stone-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 font-medium">Customer</th>
                  <th className="py-3.5 px-4 font-medium">Contact Details</th>
                  <th className="py-3.5 px-4 font-medium">Location</th>
                  <th className="py-3.5 px-4 font-medium">Total Orders</th>
                  <th className="py-3.5 px-4 font-medium">Lifetime Spend</th>
                  <th className="py-3.5 px-4 font-medium">Registered</th>
                  <th className="py-3.5 px-4 font-medium text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {filteredCustomers.map(({ user, ordersCount, totalSpent, orders: customerOrders }) => (
                  <tr
                    key={user.id}
                    onClick={() => setSelectedCustomer(user)}
                    className="hover:bg-stone-850/50 transition-colors cursor-pointer"
                  >
                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-stone-200">{user.name}</div>
                          {totalSpent > 30000 && (
                            <span className="inline-block text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                              VIP Patron
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <div className="text-stone-300 font-mono flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-stone-500" />
                        <span>{user.phone}</span>
                      </div>
                      {user.email && (
                        <div className="text-[10px] text-stone-500 flex items-center space-x-1 mt-0.5">
                          <Mail className="w-3 h-3 text-stone-600" />
                          <span>{user.email}</span>
                        </div>
                      )}
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4">
                      <div className="text-stone-300">
                        {user.address?.city || 'Not specified'}
                      </div>
                      {user.address?.province && (
                        <div className="text-[10px] text-stone-500">{user.address.province}</div>
                      )}
                    </td>

                    {/* Total orders */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-stone-800 border border-stone-700 text-stone-200 font-medium">
                        {ordersCount} {ordersCount === 1 ? 'order' : 'orders'}
                      </span>
                    </td>

                    {/* Lifetime spend */}
                    <td className="py-3.5 px-4 font-semibold text-amber-400">
                      {formatPKR(totalSpent)}
                    </td>

                    {/* Registered Date */}
                    <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                      {new Date(user.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(user);
                        }}
                        className="p-1.5 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition-colors"
                        title="View Customer Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-sm">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{selectedCustomer.name}</h3>
                  <p className="text-xs text-stone-400 font-mono">{selectedCustomer.phone}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-stone-400 hover:text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Profile Overview */}
            <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-stone-300">
                <span className="text-stone-500">Email:</span>
                <span>{selectedCustomer.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span className="text-stone-500">Registered On:</span>
                <span>{new Date(selectedCustomer.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span className="text-stone-500">Default Shipping Address:</span>
                <span className="text-right max-w-[220px]">
                  {selectedCustomer.address?.address ? (
                    `${selectedCustomer.address.address}, ${selectedCustomer.address.city}`
                  ) : (
                    'None recorded yet'
                  )}
                </span>
              </div>
            </div>

            {/* Customer Orders */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>Customer Order History</span>
              </h4>

              {(() => {
                const userOrders = orders.filter(
                  (o) =>
                    o.customerId === selectedCustomer.id ||
                    o.customerPhone === selectedCustomer.phone
                );

                if (userOrders.length === 0) {
                  return (
                    <div className="text-center py-6 border border-dashed border-stone-800 rounded-xl text-xs text-stone-500">
                      No orders placed by this customer yet.
                    </div>
                  );
                }

                return (
                  <div className="space-y-2">
                    {userOrders.map((ord) => (
                      <div
                        key={ord.id}
                        onClick={() => {
                          setSelectedCustomer(null);
                          onOpenOrder(ord.id);
                        }}
                        className="p-3 bg-stone-950 border border-stone-800 hover:border-amber-500/50 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="font-mono font-bold text-amber-400">{ord.orderNumber}</div>
                          <div className="text-[10px] text-stone-500">
                            {new Date(ord.createdAt).toLocaleDateString()} &bull; {ord.items.length} items
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-semibold text-stone-200">{formatPKR(ord.total)}</div>
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full capitalize ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-950 text-emerald-400'
                                : ord.status === 'shipped'
                                ? 'bg-sky-950 text-sky-400'
                                : 'bg-amber-950 text-amber-400'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-2 rounded-xl text-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
