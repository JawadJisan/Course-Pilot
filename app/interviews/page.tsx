"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronLeft,
  Calendar,
  Clock,
  MessageSquare,
  BarChart,
  Plus,
  Search,
  Filter,
  ChevronDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { useInterviewStore } from "@/lib/stores/interview.store";

// Mock data - would be fetched from API in a real application
const mockInterviews = {
  upcoming: [
    {
      id: "int-1",
      courseTitle: "Full-Stack Development",
      courseThumbnail: "/placeholder.svg?height=80&width=120",
      date: "May 18, 2025",
      time: "2:00 PM",
      duration: "45 minutes",
      status: "scheduled",
      description:
        "Technical interview covering React, Node.js, and database concepts",
    },
    {
      id: "int-2",
      courseTitle: "Advanced TypeScript",
      courseThumbnail: "/placeholder.svg?height=80&width=120",
      date: "May 25, 2025",
      time: "10:30 AM",
      duration: "30 minutes",
      status: "scheduled",
      description:
        "Interview focusing on TypeScript generics, utility types, and advanced patterns",
    },
  ],
  past: [
    {
      id: "int-3",
      courseTitle: "React Hooks in Depth",
      courseThumbnail: "/placeholder.svg?height=80&width=120",
      date: "April 10, 2025",
      time: "3:15 PM",
      duration: "40 minutes",
      status: "completed",
      score: 92,
      feedback:
        "Excellent understanding of React hooks. Could improve on custom hooks implementation.",
    },
    {
      id: "int-4",
      courseTitle: "JavaScript Fundamentals",
      courseThumbnail: "/placeholder.svg?height=80&width=120",
      date: "March 15, 2025",
      time: "1:00 PM",
      duration: "35 minutes",
      status: "completed",
      score: 88,
      feedback: "Good grasp of core concepts. Work on async/await patterns.",
    },
    {
      id: "int-5",
      courseTitle: "CSS Grid and Flexbox Mastery",
      courseThumbnail: "/placeholder.svg?height=80&width=120",
      date: "February 20, 2025",
      time: "11:30 AM",
      duration: "30 minutes",
      status: "completed",
      score: 95,
      feedback:
        "Outstanding knowledge of layout techniques. Perfect score on responsive design section.",
    },
    {
      id: "int-6",
      courseTitle: "Node.js API Development",
      courseThumbnail: "/placeholder.svg?height=80&width=120",
      date: "January 25, 2025",
      time: "2:45 PM",
      duration: "45 minutes",
      status: "missed",
      feedback: "Interview was missed. Please reschedule.",
    },
  ],
};

export default function InterviewsPage() {
  const { fetchUserInterviews, interviews } = useInterviewStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Filter past interviews based on search query and status
  const filteredPastInterviews = mockInterviews.past.filter((interview) => {
    const matchesSearch = interview.courseTitle
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || interview.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleReschedule = (id: string, title: string) => {
    toast({
      title: "Interview rescheduled",
      description: `Your ${title} interview has been rescheduled`,
    });
  };

  const handleCancel = (id: string, title: string) => {
    toast({
      title: "Interview cancelled",
      description: `Your ${title} interview has been cancelled`,
      variant: "destructive",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-500 border-blue-500/20"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Scheduled
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-500 border-green-500/20"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "missed":
        return (
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-500 border-red-500/20"
          >
            <XCircle className="h-3 w-3 mr-1" />
            Missed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-orange-500/10 text-orange-500 border-orange-500/20"
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    fetchUserInterviews();
  }, []);
  console.log("All interviews:", interviews);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto">
                <ChevronLeft className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Interviews</h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage your interview sessions
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Input
              placeholder="Search interviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-[250px] pl-9"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Link href="/interviews/new">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Upcoming</span>
            <Badge variant="secondary" className="ml-1">
              {mockInterviews.upcoming.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Past Interviews</span>
            <Badge variant="secondary" className="ml-1">
              {mockInterviews.past.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="m-0">
          {mockInterviews.upcoming.length > 0 ? (
            <div className="space-y-6">
              {mockInterviews.upcoming.map((interview) => (
                <Card key={interview.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-[120px] h-[80px] rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={interview.courseThumbnail || "/placeholder.svg"}
                          alt={interview.courseTitle}
                          width={120}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h3 className="text-xl font-semibold">
                            {interview.courseTitle} Interview
                          </h3>
                          {getStatusBadge(interview.status)}
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {interview.description}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{interview.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{interview.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span>{interview.duration}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          <Link href={`/interviews/${interview.id}`}>
                            <Button>Go to Interview</Button>
                          </Link>
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleReschedule(
                                interview.id,
                                interview.courseTitle
                              )
                            }
                          >
                            Reschedule
                          </Button>
                          <Button
                            variant="outline"
                            className="text-destructive hover:text-destructive"
                            onClick={() =>
                              handleCancel(interview.id, interview.courseTitle)
                            }
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="bg-muted/30 p-4 rounded-full mb-4">
                <Calendar className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                No upcoming interviews
              </h3>
              <p className="text-muted-foreground max-w-md mb-6">
                You don't have any interviews scheduled. Schedule an interview
                to practice your skills.
              </p>
              <Link href="/interviews/new">
                <Button>Schedule Interview</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="m-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Interview History</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                    <span
                      className={filterStatus === "all" ? "font-medium" : ""}
                    >
                      All Interviews
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterStatus("completed")}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    <span
                      className={
                        filterStatus === "completed" ? "font-medium" : ""
                      }
                    >
                      Completed
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("missed")}>
                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                    <span
                      className={filterStatus === "missed" ? "font-medium" : ""}
                    >
                      Missed
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterStatus("cancelled")}
                  >
                    <AlertCircle className="h-4 w-4 mr-2 text-orange-500" />
                    <span
                      className={
                        filterStatus === "cancelled" ? "font-medium" : ""
                      }
                    >
                      Cancelled
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {filteredPastInterviews.length > 0 ? (
            <div className="space-y-6">
              {filteredPastInterviews.map((interview) => (
                <Card key={interview.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-[120px] h-[80px] rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={interview.courseThumbnail || "/placeholder.svg"}
                          alt={interview.courseTitle}
                          width={120}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h3 className="text-xl font-semibold">
                            {interview.courseTitle} Interview
                          </h3>
                          {getStatusBadge(interview.status)}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{interview.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{interview.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span>{interview.duration}</span>
                          </div>
                        </div>

                        {interview.status === "completed" && (
                          <>
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">
                                  Score
                                </span>
                                <span className="text-sm">
                                  {interview.score}/100
                                </span>
                              </div>
                              <Progress
                                value={interview.score}
                                className="h-2"
                                indicatorClassName={
                                  interview.score >= 90
                                    ? "bg-green-500"
                                    : interview.score >= 70
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }
                              />
                            </div>
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-1">
                                Feedback
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {interview.feedback}
                              </p>
                            </div>
                          </>
                        )}

                        <div className="flex flex-wrap gap-2 mt-4">
                          {interview.status === "completed" ? (
                            <Link href={`/interviews/${interview.id}/feedback`}>
                              <Button variant="outline">
                                View Detailed Feedback
                                <ArrowUpRight className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                          ) : interview.status === "missed" ? (
                            <Button
                              onClick={() =>
                                handleReschedule(
                                  interview.id,
                                  interview.courseTitle
                                )
                              }
                            >
                              Reschedule Interview
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="bg-muted/30 p-4 rounded-full mb-4">
                <BarChart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                No past interviews found
              </h3>
              <p className="text-muted-foreground max-w-md mb-6">
                {searchQuery
                  ? `No interviews matching "${searchQuery}"`
                  : "You haven't taken any interviews yet. Schedule an interview to practice your skills."}
              </p>
              <Link href="/interviews/new">
                <Button>Schedule Your First Interview</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
