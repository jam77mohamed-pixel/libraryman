import axiosClient from '../api/axiosClient';
import { INITIAL_MEMBERS } from '../data/initialData';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { generateMembershipId } from '../utils/formatters';

const MEMBERS_STORAGE_KEY = 'library_members_v1';
const DELETED_MEMBERS_KEY = 'library_deleted_members_v1';

const mapDummyUserToMember = (user, index) => {
  return {
    id: `m-ext-${user.id}`,
    apiId: user.id,
    membershipId: `LIB-2024-${2000 + user.id}`,
    fullName: `${user.firstName} ${user.lastName}`,
    email: user.email,
    mobileNumber: user.phone || `+1 (555) 019-${1000 + index}`,
    address: user.address ? `${user.address.address}, ${user.address.city}, ${user.address.state}` : '104 Main Street, Suite 400',
    membershipDate: '2024-02-15',
    status: user.id % 7 === 0 ? 'Suspended' : 'Active',
    avatar: user.image || `https://i.pravatar.cc/150?u=${user.id}`,
    isExternal: true,
  };
};

export const memberService = {
  // Fetch members combining initial seeds and DummyJSON users
  async getMembers() {
    const localSaved = getStorageItem(MEMBERS_STORAGE_KEY, null);
    const deletedIds = new Set(getStorageItem(DELETED_MEMBERS_KEY, []));

    if (localSaved && localSaved.length > 0) {
      return localSaved.filter((m) => !deletedIds.has(m.id));
    }

    try {
      // Real network call to DummyJSON
      const response = await axiosClient.get('/users?limit=10&select=id,firstName,lastName,email,phone,address,image');
      let apiMembers = [];
      if (response.data && Array.isArray(response.data.users)) {
        apiMembers = response.data.users.map(mapDummyUserToMember);
      }

      const combined = [...INITIAL_MEMBERS, ...apiMembers].filter((m) => !deletedIds.has(m.id));
      setStorageItem(MEMBERS_STORAGE_KEY, combined);
      return combined;
    } catch (err) {
      console.warn('DummyJSON user fetch fallback:', err);
      const fallback = INITIAL_MEMBERS.filter((m) => !deletedIds.has(m.id));
      setStorageItem(MEMBERS_STORAGE_KEY, fallback);
      return fallback;
    }
  },

  async addMember(memberData) {
    let dummyRes = null;
    try {
      // Real network call to DummyJSON users/add
      const names = (memberData.fullName || '').split(' ');
      dummyRes = await axiosClient.post('/users/add', {
        firstName: names[0] || 'New',
        lastName: names.slice(1).join(' ') || 'Member',
        email: memberData.email,
        phone: memberData.mobileNumber,
      });
    } catch (err) {
      console.warn('DummyJSON add user simulated:', err);
    }

    const newMember = {
      ...memberData,
      id: `m-${Date.now()}`,
      membershipId: memberData.membershipId || generateMembershipId(),
      membershipDate: memberData.membershipDate || new Date().toISOString().split('T')[0],
      status: memberData.status || 'Active',
      avatar: memberData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(memberData.fullName)}&background=4f46e5&color=fff`,
      apiId: dummyRes?.data?.id,
    };

    const currentMembers = getStorageItem(MEMBERS_STORAGE_KEY, INITIAL_MEMBERS);
    const updated = [newMember, ...currentMembers];
    setStorageItem(MEMBERS_STORAGE_KEY, updated);
    return newMember;
  },

  async updateMember(id, memberData) {
    try {
      if (memberData.apiId) {
        await axiosClient.put(`/users/${memberData.apiId}`, {
          email: memberData.email,
          phone: memberData.mobileNumber,
        });
      }
    } catch (err) {
      console.warn('DummyJSON user PUT simulated:', err);
    }

    const currentMembers = getStorageItem(MEMBERS_STORAGE_KEY, INITIAL_MEMBERS);
    const updated = currentMembers.map((m) => (m.id === id ? { ...m, ...memberData } : m));
    setStorageItem(MEMBERS_STORAGE_KEY, updated);
    return updated.find((m) => m.id === id);
  },

  async deleteMember(id, apiId = null) {
    try {
      if (apiId) {
        await axiosClient.delete(`/users/${apiId}`);
      }
    } catch (err) {
      console.warn('DummyJSON user DELETE simulated:', err);
    }

    const deletedIds = getStorageItem(DELETED_MEMBERS_KEY, []);
    setStorageItem(DELETED_MEMBERS_KEY, [...deletedIds, id]);

    const currentMembers = getStorageItem(MEMBERS_STORAGE_KEY, INITIAL_MEMBERS);
    const updated = currentMembers.filter((m) => m.id !== id);
    setStorageItem(MEMBERS_STORAGE_KEY, updated);
    return true;
  },
};
