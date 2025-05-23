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
  BarChart2,
  AlertCircle,
  GraduationCap,
  Plus,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useCourseStore } from "@/lib/stores/course.store";

export default function MyCoursesPage() {
  const router = useRouter();
  const { myCourses, loading, error, fetchMyCourses } = useCourseStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [processedCourses, setProcessedCourses] = useState([]);

  // Fetch courses
  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  // Process courses to add additional metadata
  useEffect(() => {
    if (!myCourses || myCourses.length === 0) return;

    const processed = myCourses.map((course) => {
      // Count total modules and lessons
      const moduleCount = course.modules?.length || 0;

      let lessonCount = 0;
      let totalDuration = 0;

      course.modules?.forEach((module) => {
        lessonCount += module.lessons?.length || 0;

        module.lessons?.forEach((lesson) => {
          lesson.resources?.forEach((resource) => {
            totalDuration += resource.duration || 0;
          });
        });
      });

      // Generate random progress for now (will be implemented properly later)
      const progress = Math.floor(Math.random() * 101);

      // Get total resources
      let resourceCount = 0;
      course.modules?.forEach((module) => {
        module.lessons?.forEach((lesson) => {
          resourceCount += lesson.resources?.length || 0;
        });
      });

      // Extract tags from objectives (for demo purposes)
      const tags =
        course.objectives
          ?.map((obj) => {
            const words = obj.split(" ");
            // Extract key technologies mentioned in objectives
            const techKeywords = [
              "React",
              "Node.js",
              "PostgreSQL",
              "JWT",
              "Authentication",
              "Performance",
            ];
            const foundTags = techKeywords.filter((keyword) =>
              obj.includes(keyword)
            );
            return foundTags.length > 0 ? foundTags[0] : words[0];
          })
          .filter((tag, index, self) => self.indexOf(tag) === index) || [];

      // Determine level based on description content
      let level = "intermediate";
      if (course.description?.toLowerCase().includes("advanced")) {
        level = "advanced";
      } else if (course.description?.toLowerCase().includes("beginner")) {
        level = "beginner";
      }

      return {
        ...course,
        moduleCount,
        lessonCount,
        resourceCount,
        totalDuration,
        progress,
        tags,
        level,
        // For demo purposes, some courses will have last accessed data
        ...(progress > 0 && {
          lastAccessed: new Date(
            Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
          ).toISOString(),
          lastAccessedModule: progress > 0 ? course.modules[0].title : null,
          lastAccessedLesson:
            progress > 0 ? course.modules[0].lessons[0].title : null,
        }),
      };
    });

    setProcessedCourses(processed);
  }, [myCourses]);

  // Filter courses based on search query and active tab
  useEffect(() => {
    if (!processedCourses || processedCourses.length === 0) return;

    let filtered = processedCourses;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title?.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query) ||
          course.objectives?.some((obj) => obj.toLowerCase().includes(query)) ||
          course.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by tab
    if (activeTab === "in-progress") {
      filtered = filtered.filter(
        (course) => course.progress > 0 && course.progress < 100
      );
    } else if (activeTab === "completed") {
      filtered = filtered.filter((course) => course.progress === 100);
    } else if (activeTab === "not-started") {
      filtered = filtered.filter((course) => course.progress === 0);
    }

    setFilteredCourses(filtered);
  }, [searchQuery, activeTab, processedCourses]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format duration
  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  // Continue learning - navigate to the last accessed lesson or first lesson
  const continueLearning = (course) => {
    if (course.lastAccessed) {
      // If the user has already started the course, navigate to the last accessed lesson
      const courseSlug = encodeURIComponent(
        course.title.replace(/\s+/g, "-").toLowerCase()
      );
      router.push(
        `/courses/my-courses/${course.id}/${courseSlug}/lesson/last-accessed`
      );
    } else {
      // If the user hasn't started the course yet, navigate to the first lesson
      const courseSlug = encodeURIComponent(
        course.title.replace(/\s+/g, "-").toLowerCase()
      );
      router.push(
        `/courses/my-courses/${course.id}/${courseSlug}/lesson/first`
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 container max-w-screen-xl mx-auto px-4 py-12 flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  // console.log("myCourses:", myCourses);

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
              <BreadcrumbLink>My Courses</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              My Courses
            </h1>
            <p className="text-muted-foreground">
              Access your enrolled courses and track your progress
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/courses/all-courses">Browse Courses</Link>
            </Button>
            <Button asChild>
              <Link href="/courses/new">
                <Plus className="mr-2 h-4 w-4" />
                Generate New Course
              </Link>
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search your courses..."
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
                <DropdownMenuItem onClick={() => setActiveTab("in-progress")}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("completed")}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("not-started")}>
                  Not Started
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Recently Added</DropdownMenuItem>
                <DropdownMenuItem>Recently Accessed</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="not-started">Not Started</TabsTrigger>
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
                : "You don't have any courses in this category yet."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/courses/all-courses">Browse Courses</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/courses/new">Generate Custom Course</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=400&width=600&text=${encodeURIComponent(
                      course.title.substring(0, 20)
                    )}`}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge
                      className={`capitalize ${
                        course.progress === 100
                          ? "bg-green-500"
                          : course.progress > 0
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {course.progress === 100
                        ? "Completed"
                        : course.progress > 0
                        ? "In Progress"
                        : "Not Started"}
                    </Badge>
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
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-muted-foreground">
                      Progress
                    </div>
                    <div className="text-sm font-medium">
                      {course.progress}%
                    </div>
                  </div>
                  <Progress value={course.progress} className="h-2" />

                  {course.lastAccessed && (
                    <div className="mt-4 text-sm">
                      <p className="text-muted-foreground">
                        Last accessed: {formatDate(course.lastAccessed)}
                      </p>
                      {course.lastAccessedModule &&
                        course.lastAccessedLesson && (
                          <p className="text-muted-foreground mt-1 line-clamp-1">
                            <span className="font-medium">
                              {course.lastAccessedModule}:
                            </span>{" "}
                            {course.lastAccessedLesson}
                          </p>
                        )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4">
                    {course.level && (
                      <Badge variant="outline" className="capitalize">
                        {course.level.replace("-", " ")}
                      </Badge>
                    )}
                    {course.tags &&
                      course.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between items-center">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {course.moduleCount} modules
                    </div>
                    <div className="flex items-center">
                      <BarChart2 className="h-4 w-4 mr-1" />
                      {course.lessonCount} lessons
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      const courseSlug = encodeURIComponent(
                        course.title.replace(/\s+/g, "-").toLowerCase()
                      );
                      const lessonId =
                        course?.modules?.[0]?.lessons?.[0]?.id ?? "dummy";
                      // Optional: Log for debugging
                      // console.log("Navigating to course:", courseSlug);
                      // console.log("Lesson ID:", lessonId);
                      router.push(
                        `/courses/my-courses/${course.id}/${courseSlug}/lesson/${lessonId}`
                      );
                    }}
                  >
                    {course?.progress > 0 ? "Continue" : "Start Learning"}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {filteredCourses.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Ready to learn something new?
            </h2>
            <p className="text-muted-foreground mb-6">
              Browse our course catalog or generate a personalized course
              tailored to your learning goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/courses/all-courses">Browse Courses</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/courses/new">Generate Custom Course</Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
