import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { useLibrary } from '../../context/LibraryContext';
import { generateISBN } from '../../utils/formatters';
import { toast } from 'react-toastify';

const CURRENT_YEAR = 2024;

const BookFormModal = ({ isOpen, onClose, bookToEdit = null }) => {
  const { categories, addBook, updateBook } = useLibrary();

  const isEdit = !!bookToEdit;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      category: '',
      publishedYear: CURRENT_YEAR,
      totalCopies: 5,
      availableCopies: 5,
      coverImage: '',
      description: '',
    },
  });

  useEffect(() => {
    if (bookToEdit) {
      reset({
        title: bookToEdit.title || '',
        author: bookToEdit.author || '',
        isbn: bookToEdit.isbn || '',
        publisher: bookToEdit.publisher || '',
        category: bookToEdit.category || '',
        publishedYear: bookToEdit.publishedYear || new Date().getFullYear(),
        totalCopies: bookToEdit.totalCopies || 5,
        availableCopies: bookToEdit.availableCopies || 5,
        coverImage: bookToEdit.coverImage || '',
        description: bookToEdit.description || '',
      });
    } else {
      reset({
        title: '',
        author: '',
        isbn: generateISBN(),
        publisher: '',
        category: categories[0]?.name || '',
        publishedYear: new Date().getFullYear(),
        totalCopies: 5,
        availableCopies: 5,
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        description: '',
      });
    }
  }, [bookToEdit, isOpen, reset, categories]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        publishedYear: Number(data.publishedYear),
        totalCopies: Number(data.totalCopies),
        availableCopies: Number(data.availableCopies),
        coverImage:
          data.coverImage ||
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      };

      if (payload.availableCopies > payload.totalCopies) {
        toast.error('Available copies cannot exceed total copies.');
        return;
      }

      if (isEdit) {
        await updateBook(bookToEdit.id, payload);
        toast.success(`Book "${payload.title}" updated successfully!`);
      } else {
        await addBook(payload);
        toast.success(`Book "${payload.title}" added to library catalog!`);
      }
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save book. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Book Details' : 'Add New Book'}
      subtitle={isEdit ? 'Modify library catalog entry' : 'Catalog a new accession into the library'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <Input
          label="Book Title"
          placeholder="e.g. Clean Architecture"
          required
          {...register('title', {
            required: 'Book title is required',
            minLength: { value: 2, message: 'Title must be at least 2 characters' },
          })}
          error={errors.title?.message}
        />

        {/* Author & ISBN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Author Name"
            placeholder="e.g. Robert C. Martin"
            required
            {...register('author', { required: 'Author is required' })}
            error={errors.author?.message}
          />

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-slate-700">
                ISBN Number <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setValue('isbn', generateISBN())}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
              >
                Auto-generate
              </button>
            </div>
            <Input
              placeholder="978-X-XX-XXXXXX-X"
              {...register('isbn', { required: 'ISBN is required' })}
              error={errors.isbn?.message}
            />
          </div>
        </div>

        {/* Publisher & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Publisher"
            placeholder="e.g. Prentice Hall, O'Reilly"
            required
            {...register('publisher', { required: 'Publisher is required' })}
            error={errors.publisher?.message}
          />

          <Select
            label="Category"
            required
            options={categories.map((c) => ({ value: c.name, label: c.name }))}
            {...register('category', { required: 'Please select a category' })}
            error={errors.category?.message}
          />
        </div>

        {/* Published Year, Total Copies, Available Copies */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Published Year"
            type="number"
            required
            {...register('publishedYear', {
              required: 'Published year is required',
              min: { value: 1400, message: 'Invalid year' },
              max: { value: CURRENT_YEAR + 1, message: 'Year cannot be in future' },
            })}
            error={errors.publishedYear?.message}
          />

          <Input
            label="Total Copies"
            type="number"
            required
            {...register('totalCopies', {
              required: 'Total copies is required',
              min: { value: 1, message: 'At least 1 copy required' },
            })}
            error={errors.totalCopies?.message}
          />

          <Input
            label="Available Copies"
            type="number"
            required
            {...register('availableCopies', {
              required: 'Available copies is required',
              min: { value: 0, message: 'Cannot be negative' },
            })}
            error={errors.availableCopies?.message}
          />
        </div>

        {/* Cover Image URL */}
        <Input
          label="Cover Image URL"
          placeholder="https://images.unsplash.com/..."
          helperText="Direct image link for book jacket thumbnail"
          {...register('coverImage')}
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Book Synopsis & Description
          </label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-slate-300 p-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Overview of topics, key chapters, target audience..."
            {...register('description')}
          />
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEdit ? 'Save Changes' : 'Catalog Book'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BookFormModal;
