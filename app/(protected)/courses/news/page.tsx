"use client";
import Link from "next/link";
import { use } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  BookmarkPlus,
  CheckCircle,
  Clock,
  FileText,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckSquare,
  Play,
  Bookmark,
  MessageSquare,
  Edit3,
  Save,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Video,
  Search,
  X,
  ArrowLeft,
  MoreHorizontal,
  Info,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RichTextEditor from "./rich-text-editor";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";

// Rich text editor
const RichTextEditorComponent = dynamic(() => import("./rich-text-editor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[200px] rounded-md border border-input bg-muted/20 p-4">
      <Skeleton className="h-4 w-2/3 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  ),
});

// Zod schema for course data
const ResourceSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  url: z.string(),
  source: z.string(),
  duration: z.number().optional(),
});

const LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  resources: z.array(ResourceSchema),
});

const ModuleSchema = z.object({
  id: z.string(),
  title: z.string(),
  lessons: z.array(LessonSchema),
});

const CourseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  description: z.string(),
  objectives: z.array(z.string()),
  createdAt: z.string(),
  modules: z.array(ModuleSchema),
});

type Course = z.infer<typeof CourseSchema>;
type Module = z.infer<typeof ModuleSchema>;
type Lesson = z.infer<typeof LessonSchema>;
type Resource = z.infer<typeof ResourceSchema>;

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCourseStore } from "@/lib/stores/course.store";
import { useProgressStore } from "@/lib/stores/progress.store";

export default function CourseContentPage({
  params,
}: {
  params: Promise<{ courseId: string; courseTitle: string; lessonId: string }>;
}) {
  const { courseId, courseTitle, lessonId } = use(params);

  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<
    Record<string, boolean>
  >({});
  const [fullscreen, setFullscreen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [bookmarkedLessons, setBookmarkedLessons] = useState<string[]>([]);

  // Accordion state
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    {
      moduleIndex: number;
      lessonIndex: number;
      moduleTitle: string;
      lessonTitle: string;
      lessonId: string;
    }[]
  >([]);

  // Current lesson state
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("content");
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [currentResource, setCurrentResource] = useState<Resource | null>(null);
  const {
    loading,
    courseDetails,
    fetchCourseDetails,
    error: apiError,
  } = useCourseStore();

  const { fetchCourseProgress, currentCourseProgress } = useProgressStore();

  // Refs for scrolling
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Fetch course data
  useEffect(() => {
    fetchCourseDetails(courseId);
  }, [fetchCourseDetails, courseId]);

  // Fetch courrent course progress
  useEffect(() => {
    fetchCourseProgress(courseId);
  }, [fetchCourseProgress, courseId]);

  console.log("currentCourseProgress:", currentCourseProgress);

  // Process course data when it's available
  useEffect(() => {
    const processCourseData = async () => {
      try {
        // Check if courseDetails exists and has the required structure
        if (
          !courseDetails ||
          !courseDetails.modules ||
          !courseDetails.modules.length
        ) {
          return; // Exit early if data is not ready
        }

        // Set the course data
        setCourse(courseDetails);

        // Load completed lessons from localStorage
        const savedProgress = localStorage.getItem(
          `course-progress-${courseId}`
        );
        if (savedProgress) {
          setCompletedLessons(JSON.parse(savedProgress));
        }

        // Load saved notes from localStorage
        const savedNotesData = localStorage.getItem(`course-notes-${courseId}`);
        if (savedNotesData) {
          setSavedNotes(JSON.parse(savedNotesData));
        }

        // Load bookmarked lessons from localStorage
        const savedBookmarks = localStorage.getItem(
          `course-bookmarks-${courseId}`
        );
        if (savedBookmarks) {
          setBookmarkedLessons(JSON.parse(savedBookmarks));
        }

        // Determine which lesson to show based on the lessonId parameter
        let initialModuleIndex = 0;
        let initialLessonIndex = 0;

        if (lessonId === "last-accessed") {
          // Find the last accessed lesson from localStorage
          const lastAccessed = localStorage.getItem(
            `last-accessed-${courseId}`
          );
          if (lastAccessed) {
            const { moduleIndex, lessonIndex } = JSON.parse(lastAccessed);
            initialModuleIndex = moduleIndex;
            initialLessonIndex = lessonIndex;
          }
        } else if (lessonId === "first") {
          // Start with the first lesson
          initialModuleIndex = 0;
          initialLessonIndex = 0;
        } else {
          // Try to find the lesson by ID
          let found = false;
          courseDetails.modules.forEach((module, moduleIndex) => {
            module.lessons.forEach((lesson, lessonIndex) => {
              if (lesson.id === lessonId) {
                initialModuleIndex = moduleIndex;
                initialLessonIndex = lessonIndex;
                found = true;
              }
            });
          });

          // If not found, default to the first lesson
          if (!found) {
            initialModuleIndex = 0;
            initialLessonIndex = 0;
          }
        }

        setCurrentModuleIndex(initialModuleIndex);
        setCurrentLessonIndex(initialLessonIndex);

        // Initialize expanded module with the current module
        if (courseDetails.modules[initialModuleIndex]) {
          setExpandedModule(courseDetails.modules[initialModuleIndex].id);
        }
      } catch (err) {
        console.error("Error processing course data:", err);
        setError("Failed to process course data. Please try again later.");
      }
    };

    processCourseData();
  }, [courseDetails, courseId, lessonId]);

  // Update video URL when current lesson changes
  useEffect(() => {
    if (!course || !course.modules || !course.modules[currentModuleIndex])
      return;

    const currentModule = course.modules[currentModuleIndex];
    if (!currentModule.lessons || !currentModule.lessons[currentLessonIndex])
      return;

    const currentLesson = currentModule.lessons[currentLessonIndex];
    if (currentLesson) {
      const videoResource = currentLesson.resources.find(
        (resource) => resource.type === "video"
      );
      if (videoResource) {
        // Convert YouTube watch URLs to embed URLs
        let embedUrl = videoResource.url;
        if (embedUrl.includes("youtube.com/watch")) {
          const videoId = new URL(embedUrl).searchParams.get("v");
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (embedUrl.includes("youtu.be/")) {
          const videoId = embedUrl.split("youtu.be/")[1].split("?")[0];
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
        setCurrentVideoUrl(embedUrl);
        setCurrentResource(videoResource);
        setShowVideo(true);
      } else {
        setShowVideo(false);
        const firstResource = currentLesson.resources[0];
        if (firstResource) {
          setCurrentResource(firstResource);
        }
      }

      // Load saved notes for this lesson
      if (savedNotes[currentLesson.id]) {
        setNotes(savedNotes[currentLesson.id]);
      } else {
        setNotes("");
      }

      // Save the current lesson as the last accessed lesson
      localStorage.setItem(
        `last-accessed-${courseId}`,
        JSON.stringify({
          moduleIndex: currentModuleIndex,
          lessonIndex: currentLessonIndex,
        })
      );

      // Set the current module as expanded
      const currentModuleId = course.modules[currentModuleIndex].id;
      setExpandedModule(currentModuleId);
    }
  }, [course, currentModuleIndex, currentLessonIndex, courseId, savedNotes]);

  // Handle search functionality
  useEffect(() => {
    if (!course || !searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: {
      moduleIndex: number;
      lessonIndex: number;
      moduleTitle: string;
      lessonTitle: string;
      lessonId: string;
    }[] = [];

    course.modules.forEach((module, moduleIndex) => {
      // Check if module title matches
      const moduleMatches = module.title.toLowerCase().includes(query);

      module.lessons.forEach((lesson, lessonIndex) => {
        // Check if lesson title or description matches
        const lessonMatches =
          lesson.title.toLowerCase().includes(query) ||
          lesson.description.toLowerCase().includes(query);

        if (moduleMatches || lessonMatches) {
          results.push({
            moduleIndex,
            lessonIndex,
            moduleTitle: module.title,
            lessonTitle: lesson.title,
            lessonId: lesson.id,
          });
        }
      });
    });

    setSearchResults(results);
  }, [searchQuery, course]);

  // Calculate progress
  const calculateProgress = () => {
    if (!course) return 0;

    let totalLessons = 0;
    let completedCount = 0;

    course.modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        totalLessons++;
        if (completedLessons[lesson.id]) {
          completedCount++;
        }
      });
    });

    return totalLessons > 0
      ? Math.round((completedCount / totalLessons) * 100)
      : 0;
  };

  // Calculate module progress
  const calculateModuleProgress = (moduleIndex: number) => {
    if (!course || !course.modules[moduleIndex]) return 0;

    const module = course.modules[moduleIndex];
    if (!module) return 0;

    let completedCount = 0;
    module.lessons.forEach((lesson) => {
      if (completedLessons[lesson.id]) {
        completedCount++;
      }
    });

    return module.lessons.length > 0
      ? Math.round((completedCount / module.lessons.length) * 100)
      : 0;
  };

  // Check if a module is fully completed
  const isModuleCompleted = (moduleIndex: number) => {
    if (!course || !course.modules[moduleIndex]) return false;

    const module = course.modules[moduleIndex];
    if (!module) return false;

    return module.lessons.every((lesson) => completedLessons[lesson.id]);
  };

  // Handle marking a lesson as complete
  const toggleLessonCompletion = (lessonId: string) => {
    const updatedCompletedLessons = {
      ...completedLessons,
      [lessonId]: !completedLessons[lessonId],
    };
    setCompletedLessons(updatedCompletedLessons);

    // Save to localStorage
    localStorage.setItem(
      `course-progress-${courseId}`,
      JSON.stringify(updatedCompletedLessons)
    );
  };

  // Toggle bookmark for a lesson
  const toggleLessonBookmark = (lessonId: string) => {
    let updatedBookmarks;
    if (bookmarkedLessons.includes(lessonId)) {
      updatedBookmarks = bookmarkedLessons.filter((id) => id !== lessonId);
    } else {
      updatedBookmarks = [...bookmarkedLessons, lessonId];
    }
    setBookmarkedLessons(updatedBookmarks);

    // Save to localStorage
    localStorage.setItem(
      `course-bookmarks-${courseId}`,
      JSON.stringify(updatedBookmarks)
    );
  };

  // Save notes for current lesson
  const saveNotes = () => {
    if (!course) return;

    const currentLesson =
      course.modules[currentModuleIndex]?.lessons[currentLessonIndex];
    if (!currentLesson) return;

    const updatedNotes = {
      ...savedNotes,
      [currentLesson.id]: notes,
    };
    setSavedNotes(updatedNotes);
    setIsEditingNotes(false);

    // Save to localStorage
    localStorage.setItem(
      `course-notes-${courseId}`,
      JSON.stringify(updatedNotes)
    );
  };

  // Format duration in minutes to a readable format
  const formatDuration = (minutes?: number) => {
    if (!minutes) return "Unknown duration";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours} hr ${remainingMinutes} min`
      : `${hours} hr`;
  };

  // Get resource badge color
  const getResourceBadgeColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "article":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "doc":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  // Navigate to next lesson
  const goToNextLesson = () => {
    if (!course || !course.modules[currentModuleIndex]) return;

    let nextModuleIndex = currentModuleIndex;
    let nextLessonIndex = currentLessonIndex + 1;

    // Check if we need to move to the next module
    if (nextLessonIndex >= course.modules[currentModuleIndex].lessons.length) {
      nextModuleIndex++;
      nextLessonIndex = 0;
    }

    // Check if we've reached the end of the course
    if (nextModuleIndex >= course.modules.length) {
      return;
    }

    setCurrentModuleIndex(nextModuleIndex);
    setCurrentLessonIndex(nextLessonIndex);

    // Update URL
    const courseSlug = encodeURIComponent(
      course.title.replace(/\s+/g, "-").toLowerCase()
    );
    const nextLessonId =
      course.modules[nextModuleIndex].lessons[nextLessonIndex].id;
    router.push(
      `/courses/my-courses/${course.id}/${courseSlug}/lesson/${nextLessonId}`
    );

    // Scroll to top of content
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth" });
    }

    // Set the next module as expanded if we're moving to a new module
    if (nextModuleIndex !== currentModuleIndex) {
      setExpandedModule(course.modules[nextModuleIndex].id);
    }
  };

  // Navigate to previous lesson
  const goToPreviousLesson = () => {
    if (!course || !course.modules[currentModuleIndex]) return;

    let prevModuleIndex = currentModuleIndex;
    let prevLessonIndex = currentLessonIndex - 1;

    // Check if we need to move to the previous module
    if (prevLessonIndex < 0) {
      prevModuleIndex--;
      if (prevModuleIndex >= 0) {
        prevLessonIndex = course.modules[prevModuleIndex].lessons.length - 1;
      }
    }

    // Check if we've reached the beginning of the course
    if (prevModuleIndex < 0) {
      return;
    }

    setCurrentModuleIndex(prevModuleIndex);
    setCurrentLessonIndex(prevLessonIndex);

    // Update URL
    const courseSlug = encodeURIComponent(
      course.title.replace(/\s+/g, "-").toLowerCase()
    );
    const prevLessonId =
      course.modules[prevModuleIndex].lessons[prevLessonIndex].id;
    router.push(
      `/courses/my-courses/${course.id}/${courseSlug}/lesson/${prevLessonId}`
    );

    // Scroll to top of content
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth" });
    }

    // Set the previous module as expanded if we're moving to a different module
    if (prevModuleIndex !== currentModuleIndex) {
      setExpandedModule(course.modules[prevModuleIndex].id);
    }
  };

  // Navigate to specific lesson
  const goToLesson = (moduleIndex: number, lessonIndex: number) => {
    if (
      !course ||
      !course.modules[moduleIndex] ||
      !course.modules[moduleIndex].lessons[lessonIndex]
    )
      return;

    setCurrentModuleIndex(moduleIndex);
    setCurrentLessonIndex(lessonIndex);

    // Update URL
    const courseSlug = encodeURIComponent(
      course.title.replace(/\s+/g, "-").toLowerCase()
    );
    const lessonId = course.modules[moduleIndex].lessons[lessonIndex].id;
    router.push(
      `/courses/my-courses/${course.id}/${courseSlug}/lesson/${lessonId}`
    );

    // Scroll to top of content
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth" });
    }

    // Set the module as expanded
    setExpandedModule(course.modules[moduleIndex].id);
  };

  // Select a specific resource
  const selectResource = (resource: Resource) => {
    setCurrentResource(resource);
    if (resource.type === "video") {
      // Convert YouTube watch URLs to embed URLs
      let embedUrl = resource.url;
      if (embedUrl.includes("youtube.com/watch")) {
        const videoId = new URL(embedUrl).searchParams.get("v");
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (embedUrl.includes("youtu.be/")) {
        const videoId = embedUrl.split("youtu.be/")[1].split("?")[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      setCurrentVideoUrl(embedUrl);
      setShowVideo(true);
    } else {
      setShowVideo(false);
    }
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;

    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Get total course duration
  const getTotalCourseDuration = () => {
    if (!course) return 0;

    let totalMinutes = 0;
    course.modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        lesson.resources.forEach((resource) => {
          if (resource.duration) {
            totalMinutes += resource.duration;
          }
        });
      });
    });

    return totalMinutes;
  };

  // Handle accordion toggle
  const toggleAccordion = (moduleId: string) => {
    setExpandedModule((prev) => (prev === moduleId ? null : moduleId));
  };

  // Get resource icon
  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "doc":
      case "article":
        return <FileText className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  // Get source icon
  const getSourceIcon = (source: string) => {
    switch (source) {
      case "youtube":
        return "/placeholder.svg?height=16&width=16";
      case "mdn":
        return "/placeholder.svg?height=16&width=16";
      case "devto":
        return "/placeholder.svg?height=16&width=16";
      default:
        return "/placeholder.svg?height=16&width=16";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-medium">Loading your course</h2>
            <p className="text-muted-foreground mt-2">
              Preparing your learning experience...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (apiError || !courseDetails || !courseDetails.modules) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="max-w-md w-full">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Course</AlertTitle>
              <AlertDescription>
                {apiError || "Failed to load course data. Please try again."}
              </AlertDescription>
            </Alert>
            <Button asChild className="w-full">
              <Link href="/courses/my-courses">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to My Courses
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!course || !course.modules || !course.modules.length) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="max-w-md w-full">
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Course Data Not Ready</AlertTitle>
              <AlertDescription>
                The course data is still being processed. Please wait a moment
                and try again.
              </AlertDescription>
            </Alert>
            <Button asChild className="w-full">
              <Link href="/courses/my-courses">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to My Courses
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Safety check for current module and lesson
  if (
    !course.modules[currentModuleIndex] ||
    !course.modules[currentModuleIndex].lessons[currentLessonIndex]
  ) {
    // Reset to first module and lesson if current indices are invalid
    setCurrentModuleIndex(0);
    setCurrentLessonIndex(0);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const progress = calculateProgress();
  const currentModule = course.modules[currentModuleIndex];
  const currentLesson = currentModule.lessons[currentLessonIndex];
  const isFirstLesson = currentModuleIndex === 0 && currentLessonIndex === 0;
  const isLastLesson =
    currentModuleIndex === course.modules.length - 1 &&
    currentLessonIndex ===
      course.modules[currentModuleIndex].lessons.length - 1;
  const totalDuration = getTotalCourseDuration();
  const isBookmarked = bookmarkedLessons.includes(currentLesson.id);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-background border-b z-10 sticky top-0">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/courses/my-courses">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-medium truncate max-w-md">
                {course.title}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center">
              <div className="flex -space-x-2 mr-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Avatar
                    key={i}
                    className="h-7 w-7 border-2 border-background"
                  >
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {String.fromCharCode(65 + i)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                +248 enrolled
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => toggleLessonBookmark(currentLesson.id)}
                >
                  {isBookmarked ? (
                    <>
                      <Bookmark className="mr-2 h-4 w-4" />
                      Remove Bookmark
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="mr-2 h-4 w-4" />
                      Bookmark Lesson
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/courses/${course.id}`}>
                    <Info className="mr-2 h-4 w-4" />
                    Course Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 container max-w-screen-xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div ref={contentRef} className="h-full flex flex-col">
              {/* Video/Content player */}
              <div
                ref={playerContainerRef}
                className={`bg-black relative ${
                  fullscreen ? "fixed inset-0 z-50" : ""
                }`}
              >
                {showVideo ? (
                  <div className="aspect-video w-full relative group">
                    <iframe
                      ref={videoRef}
                      src={`${currentVideoUrl}${muted ? "?mute=1" : ""}`}
                      title={currentLesson.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>

                    {/* Video controls overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
                            onClick={() => setMuted(!muted)}
                          >
                            {muted ? (
                              <VolumeX className="h-4 w-4" />
                            ) : (
                              <Volume2 className="h-4 w-4" />
                            )}
                          </Button>
                          <div className="text-xs text-white/80">
                            {currentResource?.title.substring(0, 30)}...
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
                            onClick={toggleFullscreen}
                          >
                            {fullscreen ? (
                              <Minimize2 className="h-4 w-4" />
                            ) : (
                              <Maximize2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                    {currentResource ? (
                      <div className="text-center p-6">
                        <FileText className="h-16 w-16 mx-auto mb-4 text-primary/70" />
                        <h3 className="text-xl font-medium text-white mb-2">
                          {currentResource.title}
                        </h3>
                        <p className="text-gray-300 mb-4">
                          This resource is available as an external document or
                          article.
                        </p>
                        <Button asChild>
                          <a
                            href={currentResource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open Resource
                          </a>
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <BookOpen className="h-16 w-16 mx-auto mb-4 text-primary/70" />
                        <h3 className="text-xl font-medium text-white mb-2">
                          No Media Selected
                        </h3>
                        <p className="text-gray-300">
                          Select a resource from the list below to begin
                          learning.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Lesson title and controls */}
              <div className="border-b p-4 bg-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        Module {currentModuleIndex + 1} • Lesson{" "}
                        {currentLessonIndex + 1}
                      </Badge>
                      {isBookmarked && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        >
                          <Bookmark className="h-3 w-3 mr-1" />
                          Bookmarked
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-xl font-bold truncate">
                      {currentLesson.title}
                    </h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={
                              completedLessons[currentLesson.id]
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              toggleLessonCompletion(currentLesson.id)
                            }
                            className="min-w-[130px]"
                          >
                            {completedLessons[currentLesson.id] ? (
                              <>
                                <CheckSquare className="mr-1 h-4 w-4" />
                                Completed
                              </>
                            ) : (
                              <>
                                <CheckSquare className="mr-1 h-4 w-4" />
                                Mark Complete
                              </>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {completedLessons[currentLesson.id]
                            ? "Mark this lesson as incomplete"
                            : "Mark this lesson as complete"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleLessonBookmark(currentLesson.id)}
                    >
                      {isBookmarked ? (
                        <Bookmark className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <BookmarkPlus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Resources list */}
              <div className="p-4 border-b bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-medium">Lesson Resources</h2>
                  <Badge variant="outline" className="text-xs">
                    {currentLesson.resources.length} resources
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentLesson.resources.map((resource) => (
                    <button
                      key={resource.id}
                      onClick={() => selectResource(resource)}
                      className={`flex items-start p-3 rounded-md border hover:border-primary hover:bg-primary/5 transition-colors group ${
                        currentResource?.id === resource.id
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50 hover:bg-muted"
                      }`}
                    >
                      <div
                        className={`h-10 w-10 rounded-md flex items-center justify-center mr-3 flex-shrink-0 ${
                          currentResource?.id === resource.id
                            ? "bg-primary/20"
                            : "bg-muted"
                        }`}
                      >
                        {resource.type === "video" ? (
                          <Play
                            className={`h-4 w-4 ${
                              currentResource?.id === resource.id
                                ? "text-primary"
                                : ""
                            }`}
                          />
                        ) : resource.type === "article" ? (
                          <FileText
                            className={`h-4 w-4 ${
                              currentResource?.id === resource.id
                                ? "text-primary"
                                : ""
                            }`}
                          />
                        ) : (
                          <BookOpen
                            className={`h-4 w-4 ${
                              currentResource?.id === resource.id
                                ? "text-primary"
                                : ""
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate max-w-[200px]">
                          {resource.title}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Badge
                              variant="secondary"
                              className={`text-xs capitalize ${getResourceBadgeColor(
                                resource.type
                              )}`}
                            >
                              {resource.type}
                            </Badge>
                          </div>
                          {resource.duration && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDuration(resource.duration)}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lesson content tabs */}
              <div className="flex-1 overflow-y-auto">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <div className="border-b sticky top-0 bg-background z-10">
                    <div className="container mx-auto">
                      <TabsList className="h-12 w-full justify-start rounded-none border-b bg-transparent p-0">
                        <TabsTrigger
                          value="content"
                          className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                          Lesson Content
                        </TabsTrigger>
                        <TabsTrigger
                          value="notes"
                          className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                          My Notes
                        </TabsTrigger>
                        <TabsTrigger
                          value="discussion"
                          className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                          Discussion
                        </TabsTrigger>
                        <TabsTrigger
                          value="resources"
                          className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                          Additional Resources
                        </TabsTrigger>
                      </TabsList>
                    </div>
                  </div>
                  <div className="container mx-auto p-4 md:p-6">
                    <TabsContent value="content" className="mt-0 border-0 p-0">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <h2>Description</h2>
                        <p>{currentLesson.description}</p>

                        <h2>Learning Objectives</h2>
                        <ul>
                          {course.objectives.map((objective, index) => (
                            <li key={index}>{objective}</li>
                          ))}
                        </ul>

                        <h2>Key Takeaways</h2>
                        <p>
                          Authentication is the process of verifying who a user
                          is, while authorization is the process of verifying
                          what they have access to. JSON Web Tokens (JWTs)
                          provide a secure way to transmit information between
                          parties as a JSON object. This information can be
                          verified and trusted because it is digitally signed.
                        </p>
                        <p>
                          When implementing authentication in your applications,
                          it's important to consider security best practices
                          such as using HTTPS, securely storing tokens, an
                          security best practices such as using HTTPS, securely
                          storing tokens, and implementing proper token
                          validation. Understanding these concepts is essential
                          for building secure and robust authentication systems
                          in your applications.
                        </p>

                        <h2>Additional Resources</h2>
                        <ul>
                          <li>
                            <a
                              href="https://jwt.io/introduction"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              JWT.io Introduction
                            </a>{" "}
                            - Comprehensive guide to JSON Web Tokens
                          </li>
                          <li>
                            <a
                              href="https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Refresh Tokens: When to Use Them and How They
                              Interact with JWTs
                            </a>{" "}
                            - In-depth article on refresh token implementation
                          </li>
                        </ul>
                      </div>
                      {/* {allLessonsCompleted() && ( */}
                      <div className="mt-8 p-6 border rounded-lg bg-primary/5 text-center">
                        <h3 className="text-xl font-semibold mb-2">
                          Congratulations! 🎉
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          You've completed all lessons in this course. Ready to
                          test your knowledge?
                        </p>
                        <Button asChild>
                          <Link href={`/interview?courseId=${course.id}`}>
                            Start Interview
                            <Play className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      {/* )} */}
                    </TabsContent>
                    <TabsContent value="notes" className="mt-0 border-0 p-0">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-medium">
                          My Notes for This Lesson
                        </h3>
                        {!isEditingNotes && savedNotes[currentLesson.id] ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditingNotes(true)}
                          >
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit Notes
                          </Button>
                        ) : null}
                      </div>

                      {isEditingNotes || !savedNotes[currentLesson.id] ? (
                        <div className="space-y-4">
                          <RichTextEditor value={notes} onChange={setNotes} />
                          <div className="flex justify-end gap-2">
                            {savedNotes[currentLesson.id] && (
                              <Button
                                variant="outline"
                                onClick={() => setIsEditingNotes(false)}
                              >
                                Cancel
                              </Button>
                            )}
                            <Button onClick={saveNotes}>
                              <Save className="mr-2 h-4 w-4" />
                              Save Notes
                            </Button>
                          </div>
                        </div>
                      ) : savedNotes[currentLesson.id] ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none border rounded-md p-4 bg-card">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: savedNotes[currentLesson.id],
                            }}
                          />
                        </div>
                      ) : (
                        <div className="bg-muted/30 rounded-lg p-6 text-center">
                          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-lg font-medium mb-2">
                            Your Notes
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            You haven't added any notes for this lesson yet.
                            Notes are a great way to reinforce your learning and
                            keep track of important concepts.
                          </p>
                          <Button onClick={() => setIsEditingNotes(true)}>
                            Add Your First Note
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent
                      value="discussion"
                      className="mt-0 border-0 p-0"
                    >
                      <div className="bg-muted/30 rounded-lg p-6 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">
                          Discussion Forum
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Join the conversation! Ask questions, share insights,
                          and connect with other learners in this lesson's
                          discussion forum.
                        </p>
                        <Button>Start a Discussion</Button>
                      </div>
                    </TabsContent>
                    <TabsContent
                      value="resources"
                      className="mt-0 border-0 p-0"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">
                              Related Documentation
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              <li>
                                <a
                                  href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline flex items-center"
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  HTTP Authentication - MDN Web Docs
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://datatracker.ietf.org/doc/html/rfc7519"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline flex items-center"
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  RFC 7519: JSON Web Token (JWT)
                                </a>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">
                              Further Reading
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              <li>
                                <a
                                  href="https://owasp.org/www-project-top-ten/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline flex items-center"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  OWASP Top Ten - Security Risks
                                </a>
                              </li>
                              <li>
                                <a
                                  href="https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Scripting_Prevention_Cheat_Sheet.html"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline flex items-center"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  XSS Prevention Cheat Sheet - OWASP
                                </a>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>

            {/* Navigation controls */}
            <div className="border-t p-4 flex justify-between items-center bg-card">
              <Button
                variant="outline"
                onClick={goToPreviousLesson}
                disabled={isFirstLesson}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Lesson
              </Button>
              <div className="hidden sm:block">
                <Badge variant="outline" className="text-xs">
                  {currentModuleIndex + 1}/{course.modules.length} •{" "}
                  {currentLessonIndex + 1}/{currentModule.lessons.length}
                </Badge>
              </div>
              <Button onClick={goToNextLesson} disabled={isLastLesson}>
                Next Lesson
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="top-20 space-y-6">
              <Card>
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium">Course Progress</div>
                    <div className="text-sm font-medium">{progress}%</div>
                  </div>
                  <Progress value={progress} className="h-2 mb-4" />

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Card className="bg-muted/50">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            Completed
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {
                              Object.values(completedLessons).filter(Boolean)
                                .length
                            }
                          </Badge>
                        </div>
                        <div className="text-lg font-semibold mt-1">
                          {
                            Object.values(completedLessons).filter(Boolean)
                              .length
                          }{" "}
                          /{" "}
                          {course.modules.reduce(
                            (acc, module) => acc + module.lessons.length,
                            0
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            Duration
                          </div>
                          <Clock className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <div className="text-lg font-semibold mt-1">
                          {formatDuration(totalDuration)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">
                      Bookmarked Lessons
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {bookmarkedLessons.length}
                    </Badge>
                  </div>

                  {bookmarkedLessons.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      {bookmarkedLessons.map((lessonId) => {
                        // Find the lesson and its indices
                        let foundLesson: {
                          lesson: Lesson;
                          moduleIndex: number;
                          lessonIndex: number;
                        } | null = null;

                        course.modules.forEach((module, moduleIndex) => {
                          module.lessons.forEach((lesson, lessonIndex) => {
                            if (lesson.id === lessonId) {
                              foundLesson = {
                                lesson,
                                moduleIndex,
                                lessonIndex,
                              };
                            }
                          });
                        });

                        if (!foundLesson) return null;

                        return (
                          <button
                            key={lessonId}
                            onClick={() =>
                              goToLesson(
                                foundLesson!.moduleIndex,
                                foundLesson!.lessonIndex
                              )
                            }
                            className="w-full flex items-center p-2 text-left text-sm rounded-md hover:bg-muted/50 border border-muted"
                          >
                            <Bookmark className="h-3 w-3 text-yellow-500 mr-2 flex-shrink-0" />
                            <span className="truncate">
                              {foundLesson.lesson.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground mb-4">
                      No bookmarked lessons yet. Click the bookmark icon to save
                      lessons for quick access.
                    </div>
                  )}
                </div>
              </Card>
            </div>
            <div className="mt-5">
              <h2 className="text-lg font-medium mb-4">Course Content</h2>

              {/* Search bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search modules and lessons..."
                  className="pl-10 pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Search results */}
              {searchQuery && searchResults.length > 0 && (
                <div className="mb-4 border rounded-md p-3 bg-muted/20">
                  <h3 className="text-sm font-medium mb-2">
                    Search Results ({searchResults.length})
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          goToLesson(result.moduleIndex, result.lessonIndex);
                          setSearchQuery("");
                        }}
                        className="w-full flex items-start p-2 text-left text-sm rounded-md hover:bg-muted/50 border border-muted"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {result.lessonTitle}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            Module {result.moduleIndex + 1}:{" "}
                            {result.moduleTitle}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No search results message */}
              {searchQuery && searchResults.length === 0 && (
                <div className="mb-4 border rounded-md p-3 bg-muted/20 text-center">
                  <p className="text-sm text-muted-foreground">
                    No results found for "{searchQuery}"
                  </p>
                </div>
              )}

              <ScrollArea className="h-[calc(100vh-150px)]">
                <div className="space-y-4">
                  {course.modules.map((module, moduleIndex) => {
                    const moduleProgress = calculateModuleProgress(moduleIndex);
                    const isModuleComplete = isModuleCompleted(moduleIndex);
                    const isCurrentModule = moduleIndex === currentModuleIndex;
                    const isExpanded = expandedModule === module.id;

                    return (
                      <div
                        key={module.id}
                        className={`border rounded-lg overflow-hidden ${
                          isModuleComplete ? "border-green-500" : ""
                        }`}
                      >
                        {/* Module header */}
                        <div
                          className="px-6 py-4 hover:bg-muted/50 cursor-pointer"
                          onClick={() => toggleAccordion(module.id)}
                        >
                          <div className="flex items-center gap-3 text-left">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                isModuleComplete
                                  ? "bg-green-500/20 text-green-500"
                                  : isCurrentModule
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {moduleIndex + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate hover:text-primary transition-colors">
                                {module.title}
                              </h3>
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={moduleProgress}
                                  className="h-1 w-24"
                                />
                                <p className="text-xs text-muted-foreground">
                                  {moduleProgress}% • {module.lessons.length}{" "}
                                  lesson
                                  {module.lessons.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <ChevronRight
                                className={`h-5 w-5 transition-transform ${
                                  isExpanded ? "rotate-90" : ""
                                }`}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Module content */}
                        {isExpanded && (
                          <div className="divide-y border-t">
                            {module.lessons.map((lesson, lessonIndex) => {
                              const isCurrentLesson =
                                currentModuleIndex === moduleIndex &&
                                currentLessonIndex === lessonIndex;
                              const isBookmarked = bookmarkedLessons.includes(
                                lesson.id
                              );
                              const isCompleted = completedLessons[lesson.id];

                              return (
                                <div
                                  key={lesson.id}
                                  className={`p-6 space-y-4 ${
                                    isCurrentLesson
                                      ? "bg-primary/5 border-l-2 border-l-primary"
                                      : "hover:bg-muted/50 border-l-2 border-l-transparent"
                                  }`}
                                >
                                  <div
                                    onClick={() =>
                                      goToLesson(moduleIndex, lessonIndex)
                                    }
                                    className="flex items-start justify-between cursor-pointer"
                                  >
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <h4 className="font-medium">
                                          {moduleIndex + 1}.{lessonIndex + 1}{" "}
                                          {lesson.title}
                                        </h4>
                                        {isCompleted && (
                                          <CheckCircle className="h-4 w-4 text-green-500" />
                                        )}
                                        {isBookmarked && (
                                          <Bookmark className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    <h5 className="text-sm font-medium">
                                      Resources
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {lesson.resources.map((resource) => (
                                        <div
                                          key={resource.id}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            goToLesson(
                                              moduleIndex,
                                              lessonIndex
                                            );
                                            // Wait for lesson to load before selecting resource
                                            setTimeout(
                                              () => selectResource(resource),
                                              100
                                            );
                                          }}
                                          className="flex items-start p-3 rounded-md border hover:border-primary hover:bg-primary/5 transition-colors group cursor-pointer"
                                        >
                                          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                                            {getResourceIcon(resource.type)}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <h6 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                                              {resource.title}
                                            </h6>
                                            <div className="flex items-center gap-3 mt-1">
                                              <div className="flex items-center text-xs text-muted-foreground">
                                                <Image
                                                  src={
                                                    getSourceIcon(
                                                      resource.source
                                                    ) || "/placeholder.svg"
                                                  }
                                                  alt={resource.source}
                                                  width={16}
                                                  height={16}
                                                  className="mr-1"
                                                />
                                                {resource.source}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
