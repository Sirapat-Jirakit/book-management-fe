'use client';

import React, { useEffect, useState } from 'react';

type Inventory = {
  id: number;
  bookId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  branch: {
    name: string;
  };
  book: {
    title: string;
  };
  branchId: number;
};

export default function InventoriesPage() {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<Inventory>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchInventories();
  }, []);

  async function fetchInventories() {
    try {
      const res = await fetch('http://localhost:3001/inventories');
      const data = await res.json();
      setInventories(data);
    } catch (error) {
      console.error('Failed to fetch inventories:', error);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    const payload = {
      bookId: Number(form.bookId),
      branchId: Number(form.branchId),
      quantity: Number(form.quantity),
    };

    try {
      if (isEditing && form.id) {
        await fetch(`http://localhost:3001/inventories/${form.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('http://localhost:3001/inventories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      closeModal();
      fetchInventories();
    } catch (error) {
      console.error('Failed to save inventory:', error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this inventory?')) return;
    try {
      await fetch(`http://localhost:3001/inventories/${id}`, { method: 'DELETE' });
      fetchInventories();
    } catch (error) {
      console.error('Failed to delete inventory:', error);
    }
  }

  function openCreateModal() {
    setIsEditing(false);
    setForm({});
    setIsModalOpen(true);
  }

  function openEditModal(inv: Inventory) {
    setIsEditing(true);
    setForm(inv);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setForm({});
    setIsEditing(false);
  }

  return (
    <div className="relative">
      {/* Blur background when modal is open */}
      <div className={isModalOpen ? 'blur-sm pointer-events-none select-none' : ''}>
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Inventories</h1>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Add Inventory
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Book Name</th>
                  <th className="p-3">Branch Name</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Created At</th>
                  <th className="p-3">Updated At</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventories.map((inv, index) => (
                  <tr key={inv.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{inv.book?.title || '-'}</td>
                    <td className="p-3">{inv.branch?.name || '-'}</td>
                    <td className="p-3">{inv.quantity}</td>
                    <td className="p-3">{new Date(inv.createdAt).toLocaleString()}</td>
                    <td className="p-3">{new Date(inv.updatedAt).toLocaleString()}</td>
                    <td className="p-3 space-x-2">
                      <button
                        className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                        onClick={() => openEditModal(inv)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDelete(inv.id)}
                      >
                        Delete
                      </button>
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
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Inventory' : 'Add Inventory'}
            </h2>

            <label className="block mb-2 font-semibold" htmlFor="bookId">
              Book ID
            </label>
            <input
              type="number"
              id="bookId"
              name="bookId"
              value={form.bookId ?? ''}
              onChange={handleChange}
              className="w-full mb-3 border p-2 rounded"
              placeholder="Enter Book ID"
            />

            <label className="block mb-2 font-semibold" htmlFor="branchId">
              Branch ID
            </label>
            <input
              type="number"
              id="branchId"
              name="branchId"
              value={form.branchId ?? ''}
              onChange={handleChange}
              className="w-full mb-3 border p-2 rounded"
              placeholder="Enter Branch ID"
            />

            <label className="block mb-2 font-semibold" htmlFor="quantity">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={form.quantity ?? ''}
              onChange={handleChange}
              className="w-full mb-4 border p-2 rounded"
              placeholder="Enter Quantity"
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
