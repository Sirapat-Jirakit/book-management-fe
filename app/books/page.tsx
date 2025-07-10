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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const fetchBooks = async () => {
    try {
      const res = await fetch('http://localhost:3001/books');
      const data = await res.json();
      setBooks(data);
    } catch {
      setError('Failed to fetch books');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
	  const body = {
		...form,
		published_year: form.published_year ? Number(form.published_year) : null,
	};
      const res = await fetch('http://localhost:3001/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
		
      });
      if (!res.ok) throw new Error('Create failed');
      setForm({});
      fetchBooks();
    } catch {
      setError('Error creating book');
    }
  };

  const handleEdit = (book: Book) => {
    setForm(book);
    setIsEditing(true);
    setEditingId(book.id);
  };

  const handleUpdate = async () => {
    try {
	  const body = {
		...form,
		published_year: form.published_year ? Number(form.published_year) : null,
	  };
      const res = await fetch(`http://localhost:3001/books/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Update failed');
      setForm({});
      setIsEditing(false);
      setEditingId(null);
      fetchBooks();
    } catch {
      setError('Error updating book');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3001/books/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchBooks();
    } catch {
      setError('Error deleting book');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Book Management</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title || ''}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={form.author || ''}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="published_year"
          placeholder="Year"
          value={form.published_year || ''}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button
          className="md:col-span-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={isEditing ? handleUpdate : handleCreate}
        >
          {isEditing ? 'Update Book' : 'Add Book'}
        </button>
      </div>

      <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">Title</th>
            <th className="text-left p-3">Author</th>
            <th className="text-left p-3">Year</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="border-t">
              <td className="p-3">{book.title}</td>
              <td className="p-3">{book.author}</td>
              <td className="p-3">{book.published_year ?? 'N/A'}</td>
              <td className="p-3 space-x-2">
                <button
                  className="text-sm bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                  onClick={() => handleEdit(book)}
                >
                  Edit
                </button>
                <button
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(book.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {books.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                No books found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
