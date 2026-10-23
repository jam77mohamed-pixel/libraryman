import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { toast } from 'react-toastify';

const CategoryManagement = () => {
  const navigate = useNavigate();
  const { categories, books, addCategory, updateCategory, deleteCategory } = useLibrary();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      color: 'indigo',
    },
  });

  const openAddModal = () => {
    setEditingCategory(null);
    reset({ name: '', description: '', color: 'indigo' });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    reset({
      name: cat.name,
      description: cat.description || '',
      color: cat.color || 'indigo',
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data) => {
    try {
      if (editingCategory) {
        updateCategory(editingCategory.id, data);
        toast.success(`Category "${data.name}" updated successfully.`);
      } else {
        addCategory(data);
        toast.success(`Category "${data.name}" created successfully.`);
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save category.');
    }
  };

  const handleDelete = () => {
    if (!deletingCategory) return;
    try {
      deleteCategory(deletingCategory.id);
      toast.success(`Category "${deletingCategory.name}" removed.`);
      setDeletingCategory(null);
    } catch (err) {
      toast.error(err.message || 'Cannot delete category.');
    }
  };

  const colorOptions = [
    { label: 'Indigo', value: 'indigo' },
    { label: 'Purple', value: 'purple' },
    { label: 'Emerald', value: 'emerald' },
    { label: 'Cyan', value: 'cyan' },
    { label: 'Amber', value: 'amber' },
    { label: 'Rose', value: 'rose' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize catalog genres, classification tags, and filter books by category
          </p>
        </div>

        <Button variant="primary" size="sm" icon={Plus} onClick={openAddModal}>
          Add New Category
        </Button>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const bookCount = books.filter((b) => b.category === cat.name).length;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingCategory(cat)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900 mt-4">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {cat.description || 'No detailed description provided for this classification.'}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  {bookCount} {bookCount === 1 ? 'Book' : 'Books'}
                </span>

                <button
                  onClick={() => navigate(`/books?category=${encodeURIComponent(cat.name)}`)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer group"
                >
                  <span>Filter Books</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
        subtitle="Catalog classification and taxonomy"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Artificial Intelligence, Biographies"
            required
            {...register('name', { required: 'Category name is required' })}
            error={errors.name?.message}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Brief summary of books included in this classification..."
              className="w-full text-sm p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('description')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Color Palette</label>
            <select
              className="w-full text-sm p-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('color')}
            >
              {colorOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDelete}
        title="Delete Category?"
        message={`Are you sure you want to delete "${deletingCategory?.name}"? You cannot delete categories that currently contain active books.`}
        confirmText="Confirm Delete"
      />
    </div>
  );
};

export default CategoryManagement;
