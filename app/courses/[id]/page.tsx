"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import { format } from "date-fns";
import {
  ChevronLeft,
  Clock,
  Users,
  BookOpen,
  CheckCircle,
  Star,
  Play,
  Loader2,
  AlertCircle,
  Calendar,
  Code,
  Database,
  Server,
  Shield,
  Zap,
  User,
  FileText,
  ExternalLink,
  ArrowRight,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useCourseStore } from "@/lib/stores/course.store";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/loading-spinner";
import { withAuth } from "@/components/with-auth";

// Define the course data structure based on the actual API response
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

interface FirebaseTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

interface Course {
  id: string;
  userId: string;
  title: string;
  description: string;
  objectives: string[];
  createdAt: FirebaseTimestamp;
  modules: Module[];
}

// Helper function to format Firebase timestamp
const formatDate = (timestamp: FirebaseTimestamp): string => {
  const date = new Date(timestamp._seconds * 1000);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

// Helper function to count total lessons
const countLessons = (modules: Module[]): number => {
  return modules.reduce((total, module) => total + module.lessons.length, 0);
};

// Helper function to calculate total duration in minutes
const calculateTotalDuration = (modules: Module[]): number => {
  let totalMinutes = 0;
  modules.forEach((module) => {
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

// Helper function to format duration
const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0
    ? `${hours} hr ${remainingMinutes} min`
    : `${hours} hr`;
};

// Helper function to extract tags from course content
const extractTags = (course: Course): string[] => {
  const tags = new Set<string>();

  // Extract from title and description
  const titleAndDesc = `${course.title} ${course.description}`.toLowerCase();
  if (titleAndDesc.includes("react")) tags.add("React");
  if (titleAndDesc.includes("node")) tags.add("Node.js");
  if (titleAndDesc.includes("postgresql") || titleAndDesc.includes("postgres"))
    tags.add("PostgreSQL");
  if (titleAndDesc.includes("authentication") || titleAndDesc.includes("auth"))
    tags.add("Authentication");
  if (titleAndDesc.includes("jwt")) tags.add("JWT");
  if (titleAndDesc.includes("performance")) tags.add("Performance");
  if (titleAndDesc.includes("full stack") || titleAndDesc.includes("fullstack"))
    tags.add("Full Stack");
  if (titleAndDesc.includes("api")) tags.add("API");
  if (titleAndDesc.includes("database")) tags.add("Database");
  if (titleAndDesc.includes("security")) tags.add("Security");

  // Extract from module titles
  course.modules.forEach((module) => {
    const moduleTitle = module.title.toLowerCase();
    if (moduleTitle.includes("react")) tags.add("React");
    if (moduleTitle.includes("node")) tags.add("Node.js");
    if (moduleTitle.includes("postgresql") || moduleTitle.includes("postgres"))
      tags.add("PostgreSQL");
    if (moduleTitle.includes("authentication") || moduleTitle.includes("auth"))
      tags.add("Authentication");
    if (moduleTitle.includes("jwt")) tags.add("JWT");
    if (moduleTitle.includes("performance")) tags.add("Performance");
  });

  return Array.from(tags).slice(0, 5); // Limit to 5 tags
};

// Helper function to determine course level
const getCourseLevel = (course: Course): string => {
  const content = `${course.title} ${course.description}`.toLowerCase();

  if (content.includes("advanced") || content.includes("expert")) {
    return "advanced";
  } else if (content.includes("intermediate")) {
    return "intermediate";
  } else if (
    content.includes("beginner") ||
    content.includes("introduction") ||
    content.includes("basics")
  ) {
    return "beginner";
  } else {
    return "all-levels";
  }
};

// Helper function to generate requirements based on course content
const generateRequirements = (course: Course): string[] => {
  const requirements = [];

  if (
    course.title.toLowerCase().includes("react") ||
    course.description.toLowerCase().includes("react")
  ) {
    requirements.push("Basic knowledge of JavaScript and React fundamentals");
  }

  if (
    course.title.toLowerCase().includes("node") ||
    course.description.toLowerCase().includes("node")
  ) {
    requirements.push("Familiarity with Node.js and Express");
  }

  if (
    course.title.toLowerCase().includes("postgresql") ||
    course.description.toLowerCase().includes("postgresql")
  ) {
    requirements.push("Understanding of SQL and database concepts");
  }

  if (
    course.title.toLowerCase().includes("full stack") ||
    course.description.toLowerCase().includes("full stack")
  ) {
    requirements.push(
      "Experience with web development fundamentals (HTML, CSS, JavaScript)"
    );
  }

  if (requirements.length === 0) {
    requirements.push("Basic programming knowledge");
    requirements.push("Familiarity with web development concepts");
  }

  requirements.push("Willingness to learn and practice");

  return requirements;
};

// Helper function to get appropriate icon for a tag
const getTagIcon = (tag: string): LucideIcon => {
  const tagMap: Record<string, LucideIcon> = {
    React: Code,
    "Node.js": Server,
    PostgreSQL: Database,
    Authentication: Shield,
    JWT: Shield,
    Performance: Zap,
    "Full Stack": Code,
    API: Server,
    Database: Database,
    Security: Shield,
  };

  return tagMap[tag] || FileText;
};

// Helper function to generate a thumbnail URL based on course ID
const generateThumbnail = (courseId: string): string => {
  // Use a consistent image based on the course ID
  const hash = courseId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageNumber = (hash % 10) + 1; // Get a number between 1-10

  // Return a placeholder image or a real image from an image service
  return `https://source.unsplash.com/featured/1200x630?programming,code,${imageNumber}`;
};

// export default function CourseDetailPage({
function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params Promise using React.use()
  const { id } = use(params);

  const router = useRouter();
  const { user } = useAuthStore();
  const { fetchCourseDetails, courseDetails, loading, error } = useCourseStore();
  const [course, setCourse] = useState<Course | null>(null);

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const loadCourse = async () => {
      const courseData = await fetchCourseDetails(id);
      setCourse(courseData);

      // // Check if the course belongs to the current user
      // if (user && courseData.userId === user.uid) {
      //   // If it's the user's course, redirect to the course player
      //   const courseSlug = encodeURIComponent(
      //     courseData.title.replace(/\s+/g, "-").toLowerCase()
      //   );
      //   router.push(
      //     `/courses/my-courses/${courseData.id}/${courseSlug}/lesson/first`
      //   );
      // }
    };

    loadCourse();
  }, [id, fetchCourseDetails, user, router]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Handle creating a personalized course
  const handleCreatePersonalizedCourse = () => {
    if (!user) {
      toast.error("Please log in to create a personalized course");
      return;
    }
    router.push("/courses/new");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 container max-w-screen-xl mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-medium">Loading course details...</h2>
            <p className="text-muted-foreground mt-2">
              Please wait while we fetch the course information
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 container max-w-screen-xl mx-auto px-4 py-12">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error || "Failed to load course data"}
            </AlertDescription>
          </Alert>
          <Button asChild>
            <Link href="/courses/all-courses">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const tags = extractTags(course);
  const level = getCourseLevel(course);
  const requirements = generateRequirements(course);
  const totalLessons = countLessons(course.modules);
  const totalDuration = calculateTotalDuration(course.modules);
  const isOwnCourse = user && user.uid === course.userId;
  // const formattedDate = formatDate(course?.createdAt);
  const formattedDate = course?.createdAt
    ? format(new Date(course.createdAt), "dd MMM yyyy, hh:mm a")
    : "";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="w-full bg-gradient-to-r from-primary/10 to-primary/5 py-8">
        <div className="container max-w-screen-xl mx-auto px-4">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/courses/all-courses">
                  Courses
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>{course.title}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="relative">
            {/* Hero background with gradient overlay */}
            <div className="absolute inset-0 h-[300px] overflow-hidden -z-10">
              <Image
                src={generateThumbnail(course.id) || "/placeholder.svg"}
                alt=""
                fill
                className="object-cover opacity-30 blur-sm"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-background"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-8">
              {/* Left content - Course details */}
              <div className="lg:col-span-7 xl:col-span-8 z-10">
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.slice(0, 3).map((tag) => {
                    const TagIcon = getTagIcon(tag);
                    return (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1 px-3 py-1"
                      >
                        <TagIcon className="h-3 w-3" />
                        {tag}
                      </Badge>
                    );
                  })}
                  <Badge variant="outline" className="capitalize">
                    {level.replace("-", " ")}
                  </Badge>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  {course.title}
                </h1>

                <p className="text-muted-foreground text-lg mb-6 max-w-3xl">
                  {course.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-card rounded-lg p-4 border">
                    <div className="flex items-center text-muted-foreground mb-1">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="text-sm">Students</span>
                    </div>
                    <p className="text-xl font-semibold">24</p>
                  </div>

                  <div className="bg-card rounded-lg p-4 border">
                    <div className="flex items-center text-muted-foreground mb-1">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span className="text-sm">Lessons</span>
                    </div>
                    <p className="text-xl font-semibold">{totalLessons}</p>
                  </div>

                  <div className="bg-card rounded-lg p-4 border">
                    <div className="flex items-center text-muted-foreground mb-1">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">Duration</span>
                    </div>
                    <p className="text-xl font-semibold">
                      {formatDuration(totalDuration)
                        .replace(" hr", "h")
                        .replace(" min", "m")}
                    </p>
                  </div>

                  <div className="bg-card rounded-lg p-4 border">
                    <div className="flex items-center text-muted-foreground mb-1">
                      <Star className="h-4 w-4 mr-2 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm">Rating</span>
                    </div>
                    <p className="text-xl font-semibold">
                      4.0{" "}
                      <span className="text-xs text-muted-foreground">
                        (12)
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                  {isOwnCourse ? (
                    <Button size="lg" className="gap-2" asChild>
                      <Link
                        href={`/courses/my-courses/${
                          course.id
                        }/${encodeURIComponent(
                          course.title.replace(/\s+/g, "-").toLowerCase()
                        )}/lesson/first`}
                      >
                        <BookOpen className="h-5 w-5" />
                        Continue Learning
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      className="gap-2"
                      onClick={handleCreatePersonalizedCourse}
                    >
                      <Sparkles className="h-5 w-5" />
                      Create My Own Course
                    </Button>
                  )}

                  <Button variant="outline" size="lg" className="gap-2">
                    <Play className="h-5 w-5" />
                    Preview Course
                  </Button>
                </div>

                <div className="flex items-center p-4 bg-muted/40 rounded-lg border">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4 bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{course?.user?.name} </p>
                      <Badge variant="outline" className="text-xs">
                        Creator
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Created on {formattedDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right content - Course thumbnail and info card */}
              <div className="lg:col-span-5 xl:col-span-4">
                <Card className="overflow-hidden border-2 shadow-lg">
                  <div className="aspect-video relative">
                    <Image
                      src={generateThumbnail(course.id) || "/placeholder.svg"}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < 4
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-white text-sm">4.0</span>
                        </div>
                        <Badge className="bg-primary/90 hover:bg-primary">
                          Free
                        </Badge>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-4 right-4 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 border-white/20"
                    >
                      <Play className="h-5 w-5 text-white" />
                    </Button>
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">Course Overview</h3>
                        <Badge variant="outline" className="capitalize">
                          {level.replace("-", " ")}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Modules
                          </p>
                          <p className="font-semibold flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-primary" />
                            {course.modules.length}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Lessons
                          </p>
                          <p className="font-semibold flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-primary" />
                            {totalLessons}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Duration
                          </p>
                          <p className="font-semibold flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-primary" />
                            {formatDuration(totalDuration)}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Created
                          </p>
                          <p className="font-semibold flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-primary" />
                            {new Date(
                              course.createdAt._seconds * 1000
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4">
                        {isOwnCourse ? (
                          <Button className="w-full" size="lg" asChild>
                            <Link
                              href={`/courses/my-courses/${
                                course.id
                              }/${encodeURIComponent(
                                course.title.replace(/\s+/g, "-").toLowerCase()
                              )}/lesson/first`}
                            >
                              <BookOpen className="mr-2 h-4 w-4" />
                              Continue Learning
                            </Link>
                          </Button>
                        ) : (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  className="w-full"
                                  size="lg"
                                  onClick={handleCreatePersonalizedCourse}
                                >
                                  <Sparkles className="mr-2 h-4 w-4" />
                                  Create My Own Course
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Create a personalized course tailored to your
                                  needs
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 container max-w-screen-xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                  <p className="text-muted-foreground">{course.description}</p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.objectives.map((objective, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>{objective}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                  <ul className="space-y-2 list-disc pl-5">
                    {requirements.map((requirement, index) => (
                      <li key={index}>{requirement}</li>
                    ))}
                  </ul>
                </div>

                {!isOwnCourse && (
                  <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
                    <h2 className="text-xl font-bold mb-3 flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-primary" />
                      Create Your Personalized Learning Path
                    </h2>
                    <p className="mb-4">
                      This course was created by another user. Would you like to
                      generate your own personalized course tailored to your
                      specific learning goals and preferences?
                    </p>
                    <Button onClick={handleCreatePersonalizedCourse}>
                      Create My Custom Course
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Details</CardTitle>
                    <CardDescription>
                      Key information about this course
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level</span>
                      <span className="font-medium capitalize">
                        {level.replace("-", " ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">
                        {formatDuration(totalDuration)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Modules</span>
                      <span className="font-medium">
                        {course.modules.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lessons</span>
                      <span className="font-medium">{totalLessons}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created</span>
                      <span className="font-medium">{formattedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Language</span>
                      <span className="font-medium">English</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                      const TagIcon = getTagIcon(tag);
                      return (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1 px-3 py-1"
                        >
                          <TagIcon className="h-3 w-3" />
                          {tag}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">
                    Course Progress
                  </h3>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              Overall Completion
                            </span>
                            <span className="text-sm font-medium">0%</span>
                          </div>
                          <Progress value={0} className="h-2" />
                        </div>

                        <div className="text-center pt-2">
                          <p className="text-sm text-muted-foreground mb-3">
                            {isOwnCourse
                              ? "Continue your learning journey"
                              : "Create your own personalized course"}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={
                              isOwnCourse
                                ? () =>
                                    router.push(
                                      `/courses/my-courses/${
                                        course.id
                                      }/${encodeURIComponent(
                                        course.title
                                          .replace(/\s+/g, "-")
                                          .toLowerCase()
                                      )}/lesson/first`
                                    )
                                : handleCreatePersonalizedCourse
                            }
                          >
                            {isOwnCourse
                              ? "Continue Learning"
                              : "Create My Course"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="curriculum" className="mt-6">
            <div>
              <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
              <div className="text-sm text-muted-foreground mb-6">
                {course.modules.length} modules • {totalLessons} lessons •{" "}
                {formatDuration(totalDuration)} total length
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {course.modules.map((module, moduleIndex) => (
                  <AccordionItem
                    key={module.id}
                    value={module.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 group">
                      <div className="flex items-center gap-3 text-left">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {moduleIndex + 1}
                        </div>
                        <div>
                          <h3 className="font-medium group-hover:text-primary transition-colors">
                            {module.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {module.lessons.length} lesson
                            {module.lessons.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pt-0 pb-0">
                      <div className="divide-y border-t">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div key={lesson.id} className="p-6 space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">
                                    {moduleIndex + 1}.{lessonIndex + 1}{" "}
                                    {lesson.title}
                                  </h4>
                                </div>
                                <p className="text-muted-foreground">
                                  {lesson.description}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h5 className="text-sm font-medium">Resources</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {lesson.resources.map((resource) => (
                                  <div
                                    key={resource.id}
                                    className="flex items-start p-3 rounded-md border hover:border-primary hover:bg-primary/5 transition-colors group"
                                  >
                                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                                      {resource.type === "video" ? (
                                        <Play className="h-4 w-4 text-primary" />
                                      ) : resource.type === "article" ? (
                                        <FileText className="h-4 w-4 text-primary" />
                                      ) : (
                                        <BookOpen className="h-4 w-4 text-primary" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h6 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                                        {resource.title}
                                      </h6>
                                      <div className="flex items-center gap-3 mt-1">
                                        <div className="flex items-center text-xs text-muted-foreground">
                                          <span className="capitalize">
                                            {resource.source}
                                          </span>
                                        </div>
                                        {resource.duration && (
                                          <div className="flex items-center text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {formatDuration(resource.duration)}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Resources</CardTitle>
                  <CardDescription>
                    Additional materials to enhance your learning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.modules
                      .flatMap((module) =>
                        module.lessons.flatMap((lesson) =>
                          lesson.resources.filter(
                            (resource) =>
                              resource.type === "doc" ||
                              resource.type === "article"
                          )
                        )
                      )
                      .slice(0, 5)
                      .map((resource) => (
                        <a
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start p-3 rounded-md border hover:border-primary hover:bg-primary/5 transition-colors group"
                        >
                          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                            {resource.type === "article" ? (
                              <FileText className="h-4 w-4 text-primary" />
                            ) : (
                              <BookOpen className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                              {resource.title}
                            </h3>
                            <div className="flex items-center mt-1">
                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {resource.source}
                              </Badge>
                              <ExternalLink className="h-3 w-3 ml-2 text-muted-foreground" />
                            </div>
                          </div>
                        </a>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Video Content</CardTitle>
                  <CardDescription>
                    Video tutorials and demonstrations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.modules
                      .flatMap((module) =>
                        module.lessons.flatMap((lesson) =>
                          lesson.resources.filter(
                            (resource) => resource.type === "video"
                          )
                        )
                      )
                      .slice(0, 5)
                      .map((resource) => (
                        <a
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start p-3 rounded-md border hover:border-primary hover:bg-primary/5 transition-colors group"
                        >
                          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                            <Play className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                              {resource.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {resource.source}
                              </Badge>
                              {resource.duration && (
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatDuration(resource.duration)}
                                </div>
                              )}
                            </div>
                          </div>
                        </a>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to start learning?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {isOwnCourse
              ? "Continue your learning journey with this comprehensive course."
              : "Create your own personalized course tailored to your specific learning goals and preferences."}
          </p>
          <Button
            size="lg"
            onClick={
              isOwnCourse
                ? () =>
                    router.push(
                      `/courses/my-courses/${course.id}/${encodeURIComponent(
                        course.title.replace(/\s+/g, "-").toLowerCase()
                      )}/lesson/first`
                    )
                : handleCreatePersonalizedCourse
            }
          >
            {isOwnCourse ? (
              <>
                <BookOpen className="mr-2 h-4 w-4" />
                Continue Learning
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Create My Custom Course
              </>
            )}
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default withAuth(CourseDetailPage);
