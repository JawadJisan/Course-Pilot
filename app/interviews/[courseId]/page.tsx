// app/interviews/[courseId]/page.tsx
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Agent from "@/components/Agent";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useInterviewStore } from "@/lib/stores/interview.store";
import { LoadingSpinner } from "@/components/loading-spinner";
import { formatDistanceToNow } from "date-fns";
import { useCourseStore } from "@/lib/stores/course.store";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const InterviewPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { courseId } = useParams();
  const {
    currentInterview,
    status,
    checkInterviewStatus,
    generateInterview,
    loading: interviewLoading,
  } = useInterviewStore();
  const { fetchCourseDetails, courseDetails, courseLoading, courseError } =
    useCourseStore();

  useEffect(() => {
    const initialize = async () => {
      if (courseId && user?.uid) {
        await checkInterviewStatus(courseId);
      }
    };
    initialize();
  }, [courseId, user?.uid]);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails(courseId as string);
    }
  }, [courseId, fetchCourseDetails]);

  const handleViewFeedback = () => {
    if (status?.feedbackId) {
      router.push(`/interviews/${courseId}/feedback/${status.feedbackId}`);
    }
  };

  if (interviewLoading || !status || courseLoading) {
    return <LoadingSpinner />;
  }

  console.log("status:", status);

  const renderContent = () => {
    switch (status.status) {
      case "pending":
        return (
          <Agent
            userName={user?.name!}
            userId={user?.uid}
            profileImage={user?.profileURL}
            courseId={courseId as string}
            interviewId={currentInterview?.id}
            mode="resume"
          />
        );
      case "completed":
        return (
          <>
            {status.canRetake ? (
              <Agent
                userName={user?.name!}
                userId={user?.uid}
                profileImage={user?.profileURL}
                courseId={courseId as string}
                interviewId={currentInterview?.id}
                courseName={courseDetails.title}
                mode="retake"
              />
            ) : (
              <div className="bg-card p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Interview Results</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-muted-foreground">Score</p>
                    <p className="text-3xl font-bold">{status.score}/100</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="text-xl font-semibold capitalize">
                      {status.status}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleViewFeedback}
                    size="lg"
                    className="w-full"
                  >
                    View Detailed Feedback
                  </Button>

                  {status.retakeAvailableDate && (
                    <p className="text-sm text-muted-foreground text-center">
                      Next retake available{" "}
                      {formatDistanceToNow(
                        new Date(status.retakeAvailableDate),
                        {
                          addSuffix: true,
                        }
                      )}
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        );

      default:
        return (
          <Agent
            userName={user?.name!}
            userId={user?.uid}
            profileImage={user?.profileURL}
            courseId={courseId as string}
            interviewId={currentInterview?.id}
            mode="new"
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30">
      {/* show route header */}
      <div className="bg-background border-b z-10 sticky top-0">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="#">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-medium truncate max-w-md">
                {courseDetails?.title}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          {status.exists && status.status === "pending" && (
            <p className="text-lg text-muted-foreground animate-fade-in-up delay-200">
              You have an interview in progress
            </p>
          )}
        </div>

        {renderContent()}

        {/* <Agent
          userName={user?.name!}
          userId={user?.uid}
          profileImage={user?.profileURL}
          courseId={courseId as string}
          interviewId={currentInterview?.id}
          courseName={courseDetails.title}
          mode="retake"
        /> */}
      </div>
    </div>
  );
};

export default InterviewPage;
