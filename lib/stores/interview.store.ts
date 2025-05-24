// stores/interview.store.ts
import { create } from "zustand";
import { api } from "./auth.store";

export const useInterviewStore = create((set, get) => ({
  interviews: [],
  currentInterview: null,
  status: null,
  loading: false,
  error: null,

  generateInterview: async (courseId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/interviews/generate", { courseId });
      console.log("Generated interview data:", data);
      set({
        currentInterview: data.data,
        interviews: [data.data, ...get().interviews],
        loading: false,
      });
      return data.data;
    } catch (error) {
      // Handle cooldown errors
      if (error.response?.data?.code === "RETAKE_COOLDOWN") {
        set({
          error: `Retake available on ${new Date(
            error.response.data.retakeDate
          ).toLocaleDateString()}`,
          loading: false,
        });
      } else {
        set({
          error: error instanceof Error ? error.message : "Generation failed",
          loading: false,
        });
      }
    }
  },

  checkInterviewStatus: async (courseId) => {
    set({ loading: true });
    try {
      const { data } = await api.get(`/interviews/status/${courseId}`);
      set({ status: data, loading: false });
      return data;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Status check failed",
        loading: false,
      });
    }
  },

  fetchUserInterviews: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/interviews/user");
      set({ interviews: data.data, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch interviews",
        loading: false,
      });
    }
  },

  resetInterview: () =>
    set({ currentInterview: null, status: null, error: null }),
  updateInterviewStatus: (statusData) => set({ status: statusData }),
}));
