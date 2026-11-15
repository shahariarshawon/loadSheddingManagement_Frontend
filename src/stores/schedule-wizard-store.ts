import { create } from "zustand";

export interface ScheduleWizardData {
  zoneId?: string;
  areaId: string;
  title: string;
  type: "PLANNED" | "UNEXPECTED";
  status: "PUBLISHED" | "DRAFT";
  startTime: string;
  endTime: string;
  description: string;
}

interface ScheduleWizardState {
  currentStep: number;
  totalSteps: number;
  formData: ScheduleWizardData;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<ScheduleWizardData>) => void;
  reset: () => void;
}

const initialData: ScheduleWizardData = {
  zoneId: "",
  areaId: "",
  title: "",
  type: "PLANNED",
  status: "PUBLISHED",
  startTime: "",
  endTime: "",
  description: "",
};

export const useScheduleWizardStore = create<ScheduleWizardState>((set) => ({
  currentStep: 1,
  totalSteps: 4,
  formData: initialData,
  setStep: (step) => set({ currentStep: Math.min(Math.max(step, 1), 4) }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  reset: () =>
    set({
      currentStep: 1,
      formData: initialData,
    }),
}));
