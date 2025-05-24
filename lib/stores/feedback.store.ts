// stores/feedback.store.ts
import { create } from "zustand";
import { api } from "./auth.store";
import { useInterviewStore } from "./interview.store";

export const useFeedbackStore = create((set) => ({
  feedbacks: [],
  currentFeedback: null,
  loading: false,
  error: null,

  generateFeedback: async ({ interviewId, transcript }) => {
    set({ loading: true });
    try {
      const { data } = await api.post("/feedback/generate", {
        interviewId,
        transcript,
      });
      console.log("Generated feedback data:", data);
      // Update interview store status
      useInterviewStore.getState().updateInterviewStatus({
        exists: true,
        status: "completed",
        feedbackId: data.data.id,
        score: data.data.totalScore,
        canRetake: data.data.retakeEligibility?.required || false,
        retakeAvailableDate: data.data.retakeEligibility?.availableDate,
      });
      set((state) => ({
        feedbacks: [...state.feedbacks, data.data],
        currentFeedback: data.data,
        loading: false,
      }));
      return data.data; // Return for immediate access
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Feedback generation failed",
        loading: false,
      });
    }
  },

  getFeedbackById: async (id) => {
    set({ loading: true });
    try {
      const { data } = await api.get(`/feedback/${id}`);
      set({ currentFeedback: data.data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Feedback not found",
        loading: false,
      });
    }
  },

  fetchUserFeedback: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/feedback/user/all");
      set({ feedbacks: data.data, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch feedback",
        loading: false,
      });
    }
  },

  clearFeedback: () => set({ currentFeedback: null, error: null }),
}));
