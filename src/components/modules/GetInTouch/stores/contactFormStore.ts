import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

// Interface para el estado del formulario
interface FormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  interests: string[];
  budget: string;
  message: string;
  attachment: File | null;
}

// Interface para el estado UI
interface UIState {
  focusedField: string | null;
  isHovered: boolean;
  isSubmitting: boolean;
}

// Interface completa del store
interface ContactFormStore {
  // Form data
  formData: FormData;
  
  // UI state
  uiState: UIState;
  
  // Actions para form data
  setField: (field: keyof FormData, value: any) => void;
  toggleInterest: (interest: string) => void;
  selectBudget: (budget: string) => void;
  setAttachment: (file: File | null) => void;
  resetForm: () => void;
  
  // Actions para UI state
  setFocusedField: (field: string | null) => void;
  setIsHovered: (hovered: boolean) => void;
  setIsSubmitting: (submitting: boolean) => void;
}

// Estado inicial
const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  country: '',
  interests: [],
  budget: '',
  message: '',
  attachment: null
};

const initialUIState: UIState = {
  focusedField: null,
  isHovered: false,
  isSubmitting: false
};

// Store Zustand con acciones optimizadas
export const useContactFormStore = create<ContactFormStore>((set, get) => ({
  // Estado inicial
  formData: initialFormData,
  uiState: initialUIState,
  
  // Actions para form data
  setField: (field, value) => 
    set((state) => ({
      formData: { ...state.formData, [field]: value }
    })),
  
  toggleInterest: (interest) =>
    set((state) => ({
      formData: {
        ...state.formData,
        interests: state.formData.interests.includes(interest)
          ? state.formData.interests.filter(i => i !== interest)
          : [...state.formData.interests, interest]
      }
    })),
  
  selectBudget: (budget) =>
    set((state) => ({
      formData: {
        ...state.formData,
        budget: state.formData.budget === budget ? '' : budget
      }
    })),
  
  setAttachment: (file) =>
    set((state) => ({
      formData: { ...state.formData, attachment: file }
    })),
  
  resetForm: () =>
    set(() => ({
      formData: initialFormData
    })),
  
  // Actions para UI state
  setFocusedField: (field) =>
    set((state) => ({
      uiState: { ...state.uiState, focusedField: field }
    })),
  
  setIsHovered: (hovered) =>
    set((state) => ({
      uiState: { ...state.uiState, isHovered: hovered }
    })),
  
  setIsSubmitting: (submitting) =>
    set((state) => ({
      uiState: { ...state.uiState, isSubmitting: submitting }
    }))
}));

// Selectores optimizados con shallow para evitar re-renders
export const useFormData = () => 
  useContactFormStore((state) => state.formData);

export const useUIState = () => 
  useContactFormStore((state) => state.uiState);

export const useFormActions = () => 
  useContactFormStore((state) => ({
    setField: state.setField,
    toggleInterest: state.toggleInterest,
    selectBudget: state.selectBudget,
    setAttachment: state.setAttachment,
    resetForm: state.resetForm
  }));

export const useUIActions = () => 
  useContactFormStore((state) => ({
    setFocusedField: state.setFocusedField,
    setIsHovered: state.setIsHovered,
    setIsSubmitting: state.setIsSubmitting
  }));
