'use client';

import { useEffect, useState } from 'react';

interface Book {
  id: number;
  title: string;
  author: string;
  published_year: number | null;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState<Partial<Book>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchBooks = async () => {
    const res = await fetch('http://localhost:3001/books');
    const data = await res.json();
    setBooks(data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const openCreateModal = () => {
    setForm({});
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setForm(book);
    setIsEditing(true);
    setEditingId(book.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm({});
    setIsEditing(false);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      published_year: form.published_year
        ? Number(form.published_year)
        : null,
    };

    const res = await fetch(
      isEditing
        ? `http://localhost:3001/books/${editingId}`
        : 'http://localhost:3001/books',
      {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    if (res.ok) {
      closeModal();
      fetchBooks();
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`http://localhost:3001/books/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) fetchBooks();
  };

  return (
  <div className="relative">
    {/* Main content with blur when modal is open */}
    <div className={isModalOpen ? 'blur-sm pointer-events-none select-none' : ''}>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Books</h1>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Book
          </button>
        </div>

        <div className="overflow-x-auto shadow">
          <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
				<th className="p-3">#</th>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Author</th>
                <th className="text-left p-3">Year</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={book.id} className="border-t">
				  <td className="p-3">{index + 1}</td>	
                  <td className="p-3">{book.title}</td>
                  <td className="p-3">{book.author}</td>
                  <td className="p-3">{book.published_year ?? 'N/A'}</td>
                  <td className="p-3 space-x-2">
                    <button
                      className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                      onClick={() => openEditModal(book)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(book.id)}
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
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-200 ease-in-out">
        <div className="bg-white w-11/12 sm:w-full max-w-md rounded-lg p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-4">
            {isEditing ? 'Edit Book' : 'Add Book'}
          </h2>

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title || ''}
            onChange={handleChange}
            className="w-full mb-3 border p-2 rounded"
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={form.author || ''}
            onChange={handleChange}
            className="w-full mb-3 border p-2 rounded"
          />
          <input
            type="number"
            name="published_year"
            placeholder="Published Year"
            value={form.published_year ?? ''}
            onChange={handleChange}
            className="w-full mb-4 border p-2 rounded"
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