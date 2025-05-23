import { create } from "zustand";
import axios from "axios";
import { api } from "./auth.store";

export const useCourseStore = create((set) => ({
  courses: [],
  courseDetails: null,
  myCourses: [],
  loading: false,
  error: null,
  // State-managed fetching (auto-updates store)
  fetchAllCourses: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get("/course/all-courses");
      set({ courses: data.data, loading: false });
      return data.data; // Optional: Return data for direct access
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || "Failed to fetch courses"
        : "Network error";
      set({ error: errorMessage, loading: false });
      //   throw errorMessage; // Throw to allow component handling
    }
  },

  // Component-controlled fetching (returns raw response)
  fetchDemo: async () => {
    try {
      const response = await api.get("/course/all-courses");
      return response.data; // Return parsed data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data?.error || "Demo fetch failed";
      }
      throw "Network error";
    }
  },
  fetchCourseDetails: async (courseId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/course/${courseId}`);
      set({ courseDetails: data.data, loading: false });
      return data.data;
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.error || "Failed to fetch course details"
          : "Network error",
        loading: false,
      });
    }
  },
  fetchMyCourses: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get("/course/my-courses");
      set({ myCourses: data.data, loading: false });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.error || "Failed to fetch your courses"
          : "Network error",
        loading: false,
      });
    }
  },
}));
