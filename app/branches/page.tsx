'use client';

import React, { useEffect, useState } from 'react';

type Branch = {
  id: number;
  name: string;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<Branch>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  async function fetchBranches() {
    try {
      const res = await fetch('http://localhost:3001/branches');
      const data = await res.json();
      setBranches(data);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    const payload = {
      name: form.name || '',
      address: form.address || null,
    };

    try {
      if (isEditing && form.id) {
        await fetch(`http://localhost:3001/branches/${form.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('http://localhost:3001/branches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      closeModal();
      fetchBranches();
    } catch (error) {
      console.error('Failed to save branch:', error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this branch?')) return;
    try {
      await fetch(`http://localhost:3001/branches/${id}`, { method: 'DELETE' });
      fetchBranches();
    } catch (error) {
      console.error('Failed to delete branch:', error);
    }
  }

  function openCreateModal() {
    setIsEditing(false);
    setForm({});
    setIsModalOpen(true);
  }

  function openEditModal(branch: Branch) {
    setIsEditing(true);
    setForm(branch);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setForm({});
    setIsEditing(false);
  }

  return (
    <div className="relative">
      <div className={isModalOpen ? 'blur-sm pointer-events-none select-none' : ''}>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Branches</h1>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Add Branch
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Created At</th>
                  <th className="p-3">Updated At</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((branch, index) => (
                  <tr key={branch.id} className="hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{branch.name}</td>
                    <td className="p-3">{branch.address || '-'}</td>
                    <td className="p-3">{new Date(branch.createdAt).toLocaleString()}</td>
                    <td className="p-3">{new Date(branch.updatedAt).toLocaleString()}</td>
                    <td className="p-3">
						<div className="flex space-x-2">
							<button
							className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
							onClick={() => openEditModal(branch)}
							>
							Edit
							</button>
							<button
							className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
							onClick={() => handleDelete(branch.id)}
							>
							Delete
							</button>
						</div>
					</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white w-11/12 sm:w-full max-w-md rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Branch' : 'Add Branch'}</h2>

            <label className="block mb-2 font-semibold" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name ?? ''}
              onChange={handleChange}
              className="w-full mb-3 border p-2 rounded"
              placeholder="Branch name"
              required
            />

            <label className="block mb-2 font-semibold" htmlFor="address">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={form.address ?? ''}
              onChange={handleChange}
              className="w-full mb-4 border p-2 rounded"
              placeholder="Branch address (optional)"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {isEditing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
