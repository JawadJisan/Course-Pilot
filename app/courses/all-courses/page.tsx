"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  BookOpen,
  ChevronRight,
  Loader2,
  Clock,
  Star,
  GraduationCap,
  BookMarked,
  FileText,
  Code,
  Database,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useCourseStore } from "@/lib/stores/course.store";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/stores/auth.store";

// Define the actual course data structure based on what you're receiving
interface Resource {
  id: string;
  type: string;
  title: string;
  url: string;
  source: string;
  duration: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  resources: Resource[];
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  userId: string;
  title: string;
  description: string;
  objectives: string[];
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  modules: Module[];
}

// Helper function to generate random thumbnails
const getCourseThumbnail = (courseId: string) => {
  const options = [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1469&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?q=80&w=1476&auto=format&fit=crop",
  ];

  // Use the course ID to deterministically select a thumbnail
  const hash = courseId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return options[hash % options.length];
};

// Helper function to extract tags from course data
const extractTags = (course: Course): string[] => {
  const tags: string[] = [];

  // Extract keywords from title
  const titleWords = course.title.split(" ");
  titleWords.forEach((word) => {
    if (word.length > 4 && !tags.includes(word) && tags.length < 2) {
      tags.push(word);
    }
  });

  // Add technology tags based on content
  if (course.title.toLowerCase().includes("react")) tags.push("React");
  if (course.title.toLowerCase().includes("node")) tags.push("Node.js");
  if (course.title.toLowerCase().includes("postgresql"))
    tags.push("PostgreSQL");
  if (course.description.toLowerCase().includes("authentication"))
    tags.push("Authentication");
  if (course.description.toLowerCase().includes("performance"))
    tags.push("Performance");

  // Ensure we have at least some tags
  if (tags.length === 0) {
    tags.push("Web Development");
  }

  return tags.slice(0, 3); // Limit to 3 tags
};

// Helper function to determine course level
const getCourseLevel = (
  course: Course
): "beginner" | "intermediate" | "advanced" | "all-levels" => {
  const description = course.description.toLowerCase();

  if (description.includes("beginner") || description.includes("fundamental")) {
    return "beginner";
  } else if (description.includes("advanced")) {
    return "advanced";
  } else if (description.includes("intermediate")) {
    return "intermediate";
  } else {
    return "all-levels";
  }
};

// Helper function to count total lessons
const countLessons = (course: Course): number => {
  return course.modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );
};

// Helper function to format date
const formatDate = (timestamp: {
  _seconds: number;
  _nanoseconds: number;
}): string => {
  const date = new Date(timestamp._seconds * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function AllCoursesPage() {
  const { user } = useAuthStore();
  const { courses, loading, error, fetchAllCourses } = useCourseStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchAllCourses();
  }, [fetchAllCourses]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Filter courses based on search query and active tab
  useEffect(() => {
    if (!courses) return;

    let filtered = [...courses];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.objectives.some((obj) => obj.toLowerCase().includes(query))
      );
    }

    // Filter by tab (simulated since we don't have these properties)
    if (activeTab === "beginner") {
      filtered = filtered.filter(
        (course) => getCourseLevel(course) === "beginner"
      );
    } else if (activeTab === "intermediate") {
      filtered = filtered.filter(
        (course) => getCourseLevel(course) === "intermediate"
      );
    } else if (activeTab === "advanced") {
      filtered = filtered.filter(
        (course) => getCourseLevel(course) === "advanced"
      );
    } else if (activeTab === "popular") {
      // Simulate popular courses (newest courses for now)
      filtered = filtered
        .sort((a, b) => b.createdAt._seconds - a.createdAt._seconds)
        .slice(0, 3);
    } else if (activeTab === "new") {
      // Newest courses
      filtered = filtered.sort(
        (a, b) => b.createdAt._seconds - a.createdAt._seconds
      );
    }

    setFilteredCourses(filtered);
  }, [searchQuery, activeTab, courses]);

  // Handle navigation with auth check
  const handleAuthRequiredNavigation = (path: string) => {
    if (!user) {
      toast.error("Please log in to access this feature");
      return;
    }
    router.push(path);
  };

  // Get course icon based on content
  const getCourseIcon = (course: Course) => {
    const title = course.title.toLowerCase();
    if (title.includes("react") || title.includes("frontend")) {
      return <Code className="h-5 w-5 text-blue-500" />;
    } else if (title.includes("node") || title.includes("backend")) {
      return <Database className="h-5 w-5 text-green-500" />;
    } else if (title.includes("full stack")) {
      return <BookMarked className="h-5 w-5 text-purple-500" />;
    } else {
      return <FileText className="h-5 w-5 text-orange-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 container max-w-screen-xl mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-medium">Loading courses...</h2>
            <p className="text-muted-foreground mt-2">
              Please wait while we fetch available courses
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 container max-w-screen-xl mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>All Courses</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Explore Courses
            </h1>
            <p className="text-muted-foreground">
              Discover our wide range of courses to help you advance your career
            </p>
          </div>
          <div className="flex gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleAuthRequiredNavigation("/courses/my-courses")
                    }
                  >
                    My Courses
                  </Button>
                </TooltipTrigger>
                {!user && <TooltipContent>Login required</TooltipContent>}
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => handleAuthRequiredNavigation("/courses/new")}
                  >
                    Generate Custom Course
                  </Button>
                </TooltipTrigger>
                {!user && <TooltipContent>Login required</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setActiveTab("all")}>
                  All Courses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("popular")}>
                  Popular
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("new")}>
                  New
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Level</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setActiveTab("beginner")}>
                  Beginner
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("intermediate")}>
                  Intermediate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("advanced")}>
                  Advanced
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No courses found</h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "No courses match your search criteria. Try a different search term."
                : "There are no courses in this category yet."}
            </p>
            <Button
              onClick={() => handleAuthRequiredNavigation("/courses/new")}
            >
              Generate Custom Course
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const totalLessons = countLessons(course);
              const level = getCourseLevel(course);
              const tags = extractTags(course);
              const isNew =
                Date.now() / 1000 - course.createdAt._seconds < 604800; // 7 days

              return (
                <Card
                  key={course.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={getCourseThumbnail(course.id) || "/placeholder.svg"}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {activeTab === "popular" && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Popular
                      </div>
                    )}
                    {isNew && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                        New
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < 4
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-400"
                            }`}
                          />
                        ))}
                        <span className="text-white text-sm ml-1">4.0</span>
                        <span className="text-gray-300 text-xs">(New)</span>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="line-clamp-2">
                        {course.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        {getCourseIcon(course)}
                        <span className="ml-2">By {course?.user?.name}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="capitalize">
                        {level.replace("-", " ")}
                      </Badge>
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.modules.length} modules
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {totalLessons} lessons
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      Created {formatDate(course.createdAt)}
                    </div>
                    <Button asChild>
                      <Link href={`/courses/${course.id}`}>
                        View Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {filteredCourses.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Can't find what you're looking for?
            </h2>
            <p className="text-muted-foreground mb-6">
              Generate a personalized course tailored to your specific learning
              goals and preferences.
            </p>
            <Button
              onClick={() => handleAuthRequiredNavigation("/courses/new")}
            >
              Generate Custom Course
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
