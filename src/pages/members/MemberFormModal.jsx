import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { useLibrary } from '../../context/LibraryContext';
import { generateMembershipId } from '../../utils/formatters';
import { toast } from 'react-toastify';

const DEFAULT_MEMBERSHIP_DATE = '2024-03-01';

const MemberFormModal = ({ isOpen, onClose, memberToEdit = null }) => {
  const { addMember, updateMember } = useLibrary();
  const isEdit = !!memberToEdit;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      mobileNumber: '',
      address: '',
      membershipId: '',
      membershipDate: DEFAULT_MEMBERSHIP_DATE,
      status: 'Active',
      avatar: '',
    },
  });

  useEffect(() => {
    if (memberToEdit) {
      reset({
        fullName: memberToEdit.fullName || '',
        email: memberToEdit.email || '',
        mobileNumber: memberToEdit.mobileNumber || '',
        address: memberToEdit.address || '',
        membershipId: memberToEdit.membershipId || '',
        membershipDate: memberToEdit.membershipDate || DEFAULT_MEMBERSHIP_DATE,
        status: memberToEdit.status || 'Active',
        avatar: memberToEdit.avatar || '',
      });
    } else {
      reset({
        fullName: '',
        email: '',
        mobileNumber: '',
        address: '',
        membershipId: generateMembershipId(),
        membershipDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        avatar: '',
      });
    }
  }, [memberToEdit, isOpen, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateMember(memberToEdit.id, data);
        toast.success(`Member ${data.fullName} updated successfully!`);
      } else {
        await addMember(data);
        toast.success(`Member ${data.fullName} registered successfully!`);
      }
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save member.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Member Profile' : 'Enroll New Member'}
      subtitle={isEdit ? 'Update library membership records' : 'Register a new library cardholder'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <Input
          label="Full Name"
          placeholder="e.g. Eleanor Vance"
          required
          {...register('fullName', {
            required: 'Full name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          })}
          error={errors.fullName?.message}
        />

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="eleanor@example.com"
            required
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            error={errors.email?.message}
          />

          <Input
            label="Mobile Number"
            placeholder="+1 (555) 000-0000"
            required
            {...register('mobileNumber', {
              required: 'Mobile number is required',
            })}
            error={errors.mobileNumber?.message}
          />
        </div>

        {/* Membership ID & Joined Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-slate-700">
                Membership ID <span className="text-rose-500">*</span>
              </label>
              {!isEdit && (
                <button
                  type="button"
                  onClick={() => setValue('membershipId', generateMembershipId())}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                >
                  Generate
                </button>
              )}
            </div>
            <Input
              placeholder="LIB-YYYY-XXXX"
              {...register('membershipId', { required: 'Membership ID is required' })}
              error={errors.membershipId?.message}
            />
          </div>

          <Input
            label="Membership Date"
            type="date"
            required
            {...register('membershipDate', { required: 'Date is required' })}
            error={errors.membershipDate?.message}
          />
        </div>

        {/* Status */}
        <Select
          label="Membership Status"
          options={[
            { value: 'Active', label: 'Active - In Good Standing' },
            { value: 'Suspended', label: 'Suspended - Overdue or Blocked' },
            { value: 'Expired', label: 'Expired - Needs Renewal' },
          ]}
          {...register('status')}
        />

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Residential Address <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            className="w-full rounded-lg border border-slate-300 p-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Street address, city, state, postal code..."
            {...register('address', { required: 'Address is required' })}
          />
          {errors.address && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.address.message}</p>
          )}
        </div>

        {/* Avatar link */}
        <Input
          label="Profile Photo URL (Optional)"
          placeholder="https://images.unsplash.com/..."
          helperText="Leave empty to use auto-generated initials avatar"
          {...register('avatar')}
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEdit ? 'Save Changes' : 'Register Member'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default MemberFormModal;
