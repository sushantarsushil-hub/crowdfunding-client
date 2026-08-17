'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Trash2, Edit, Coins } from 'lucide-react';
import usersService from '../../../../services/users';
import Badge from '../../../../components/ui/Badge';
import Button from '../../../../components/ui/Button';
import Modal from '../../../../components/modals/Modal';
import Select from '../../../../components/ui/Select';
import TableSkeleton from '../../../../components/common/TableSkeleton';
import EmptyState from '../../../../components/common/EmptyState';
import ErrorState from '../../../../components/common/ErrorState';
import Pagination from '../../../../components/common/Pagination';

export default function AdminManageUsersPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('supporter');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);

  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminUsers', page],
    queryFn: () => usersService.getAdminUsers({ page, limit: 10 }),
  });

  const users =
    response?.data?.users ||
    response?.users ||
    (Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : []);

  const meta = response?.meta || response?.data?.meta || {};
  const totalPages = meta.totalPages || 1;
  const totalItems = meta.total ?? users.length;

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => usersService.updateUserRole(userId, role),
    onSuccess: () => {
      toast.success('User role updated successfully!');
      setRoleModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => toast.error(err.message || 'Failed to update user role.'),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId) => usersService.deleteUser(userId),
    onSuccess: () => {
      toast.success('User account removed.');
      setDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => toast.error(err.message || 'Failed to remove user.'),
  });

  const handleOpenRoleModal = (u) => {
    setSelectedUser(u);
    setNewRole(u.role || 'supporter');
    setRoleModalOpen(true);
  };

  const handleSaveRole = (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    updateRoleMutation.mutate({
      userId: selectedUser._id || selectedUser.id,
      role: newRole,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage Platform Users</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          View registered accounts, modify access permissions, and manage user roles.
        </p>
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : isError ? (
        <ErrorState
          title="Unable to Load User Directory"
          message="Could not retrieve platform user list from the backend server."
          onRetry={refetch}
        />
      ) : users.length === 0 ? (
        <EmptyState title="No users registered" description="No user accounts exist in the directory." />
      ) : (
        <div className="space-y-4">
          {/* Desktop Data Table View */}
          <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Available Credits</th>
                  <th className="p-4">Raised Credits</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {users.map((u, idx) => {
                  const userId = u._id || u.id || idx;
                  const role = (u.role || 'supporter').toLowerCase();

                  return (
                    <tr key={userId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-bold text-slate-900 flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center overflow-hidden shrink-0">
                          {u.photoUrl || u.avatar ? (
                            <img src={u.photoUrl || u.avatar} alt={u.name} className="w-full h-full object-cover" />
                          ) : (
                            u.name?.charAt(0).toUpperCase() || 'U'
                          )}
                        </div>
                        <span>{u.name}</span>
                      </td>
                      <td className="p-4 text-slate-600">{u.email}</td>
                      <td className="p-4">
                        <Badge variant={role === 'admin' ? 'error' : role === 'creator' ? 'info' : 'success'}>
                          {role}
                        </Badge>
                      </td>
                      <td className="p-4 text-emerald-700 font-extrabold">{u.credits ?? 0} Cr</td>
                      <td className="p-4 text-indigo-700 font-extrabold">{u.raisedCredits ?? 0} Cr</td>
                      <td className="p-4 text-slate-500">{new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenRoleModal(u)}
                          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors min-w-[44px] min-h-[44px] inline-flex items-center justify-center"
                          title="Change Role"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setDeletingUserId(userId); setDeleteModalOpen(true); }}
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors min-w-[44px] min-h-[44px] inline-flex items-center justify-center"
                          title="Remove User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Grid View */}
          <div className="md:hidden space-y-3">
            {users.map((u, idx) => {
              const userId = u._id || u.id || idx;
              const role = (u.role || 'supporter').toLowerCase();

              return (
                <div key={userId} className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center overflow-hidden shrink-0">
                        {u.photoUrl || u.avatar ? (
                          <img src={u.photoUrl || u.avatar} alt={u.name} className="w-full h-full object-cover" />
                        ) : (
                          u.name?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{u.name}</h4>
                        <span className="text-[11px] text-slate-500 font-medium block truncate max-w-[180px]">{u.email}</span>
                      </div>
                    </div>
                    <Badge variant={role === 'admin' ? 'error' : role === 'creator' ? 'info' : 'success'}>
                      {role}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 font-semibold">
                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Available</span>
                      <span className="text-emerald-700 font-extrabold">{u.credits ?? 0} Cr</span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Raised</span>
                      <span className="text-indigo-700 font-extrabold">{u.raisedCredits ?? 0} Cr</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-400 text-[11px]">Joined {new Date(u.createdAt || Date.now()).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenRoleModal(u)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 text-xs min-h-[36px] flex items-center space-x-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Role</span>
                      </button>
                      <button
                        onClick={() => { setDeletingUserId(userId); setDeleteModalOpen(true); }}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 font-bold hover:bg-rose-100 text-xs min-h-[36px] flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reusable Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            limit={10}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Change Role Modal */}
      <Modal isOpen={roleModalOpen} onClose={() => setRoleModalOpen(false)} title="Change User Role">
        <form onSubmit={handleSaveRole} className="space-y-4">
          <p className="text-xs text-slate-600">
            Select a new role permission level for <strong>{selectedUser?.name}</strong>.
          </p>

          <Select
            label="Account Role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            required
          >
            <option value="supporter">Supporter</option>
            <option value="creator">Creator</option>
            <option value="admin">Administrator</option>
          </Select>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setRoleModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit" isLoading={updateRoleMutation.isPending}>
              Update Role
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete User Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Remove User Confirmation">
        <div className="space-y-4">
          <p className="text-xs text-slate-600 font-medium">
            Are you sure you want to remove this user account? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={deleteUserMutation.isPending}
              onClick={() => deleteUserMutation.mutate(deletingUserId)}
            >
              Remove User Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
