import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EnrollmentState } from '@/lib/schemas';

interface StoreState {
  formData: Partial<EnrollmentState>;
  updateData: (data: Partial<EnrollmentState>) => void;
  resetForm: () => void;
}

export const useEnrollmentStore = create<StoreState>()(
  persist(
    (set) => ({
      formData: {
        // Default values to avoid uncontrolled input warnings
        isScholarship: false,
        subjects: [],
      },
      updateData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      resetForm: () => set({ formData: {} }),
    }),
    {
      name: 'enrollment-storage', // Key for localStorage
    }
  )
);