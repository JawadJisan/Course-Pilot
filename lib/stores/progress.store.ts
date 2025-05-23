// lib/stores/progress.store.ts
import { create } from "zustand";
import axios from "axios";
import { api } from "./auth.store";

interface ProgressState {
  // Global progress state
  allProgress: [];
  currentCourseProgress: {} | null;
  loading: boolean;
  error: string | null;

  // API Actions
  fetchAllProgress: () => Promise<void>;
  fetchCourseProgress: (courseId: string) => Promise<void>;
  updateProgress: (courseId: string, lessonId: string) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  allProgress: [],
  currentCourseProgress: null,
  loading: false,
  error: null,

  fetchAllProgress: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get("/progress/courses");
      set({
        allProgress: data.data,
        loading: false,
      });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.error || "Failed to fetch progress"
          : "Network error",
        loading: false,
      });
    }
  },

  fetchCourseProgress: async (courseId: string) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/progress/courses/${courseId}`);
      set({
        currentCourseProgress: data.data.progress,
        loading: false,
      });
    } catch (error) {
      console.log("error:", error);
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.error || "Failed to fetch course progress"
          : "Network error",
        loading: false,
      });
    }
  },

  updateProgress: async (courseId: string, lessonId: string) => {
    try {
      // Optimistic update
      const prevState = get().currentCourseProgress;
      console.log("prevState:", prevState);
      if (prevState) {
        const updatedProgress = updateProgressOptimistically(
          prevState,
          lessonId
        );
        console.log("updatedProgress:", updatedProgress);
        set({ currentCourseProgress: updatedProgress });
      }

      // API call
      const { data } = await api.post(
        `/progress/courses/${courseId}/lessons/${lessonId}`
      );
      console.log("updated res:", data);
      // Merge server response
      set({
        currentCourseProgress: data.data,
        allProgress: get().allProgress.map((cp) =>
          cp.courseId === courseId ? data.data : cp
        ),
      });
    } catch (error) {
      // Revert optimistic update
      console.log("error:", error);
      set({ currentCourseProgress: get().currentCourseProgress });

      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || "Failed to update progress"
        : "Network error";

      set({ error: errorMessage });
    }
  },
}));

// Helper function for optimistic updates
function updateProgressOptimistically(current, lessonId) {
  // 1) Map over your existing modules
  const updatedModules = current.modules.map((module) => {
    // 2) Map over each lesson in the module
    const updatedLessons = module.lessons.map((lesson) => {
      if (lesson.lessonId === lessonId && !lesson.completed) {
        return {
          ...lesson,
          completedResources: lesson.totalResources,
          progress: 100,
          completed: true,
        };
      }
      return lesson;
    });

    // 3) Recompute per-module totals
    const completedLessonsInModule = updatedLessons.filter(
      (l) => l.completed
    ).length;
    const moduleProgress = Math.round(
      (completedLessonsInModule / module.totalLessons) * 100
    );

    return {
      ...module,
      lessons: updatedLessons,
      completedLessons: completedLessonsInModule,
      progress: moduleProgress,
      completed: completedLessonsInModule === module.totalLessons,
    };
  });

  // 4) Recompute overall course totals from the updatedModules
  const totalLessons = current.totalLessons; // ← note: not current.progress.totalLessons
  const completedLessons = updatedModules.reduce(
    (sum, m) => sum + m.completedLessons,
    0
  );
  const completedResources = updatedModules
    .flatMap((m) => m.lessons)
    .reduce((sum, l) => sum + l.completedResources, 0);
  const completedModules = updatedModules.filter((m) => m.completed).length;
  const overallProgress = Math.round((completedLessons / totalLessons) * 100);

  // 5) Return a new progress object
  return {
    ...current,
    overallProgress,
    completedModules,
    completedLessons,
    completedResources,
    modules: updatedModules,
  };
}
