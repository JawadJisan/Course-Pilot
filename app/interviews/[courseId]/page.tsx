// app/interviews/[courseId]/page.tsx
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Agent from "@/components/Agent";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useInterviewStore } from "@/lib/stores/interview.store";
import { useFeedbackStore } from "@/lib/stores/feedback.store";
import { LoadingSpinner } from "@/components/loading-spinner";

const InterviewPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { courseId } = useParams();
  const {
    currentInterview,
    status,
    checkInterviewStatus,
    loading: interviewLoading,
  } = useInterviewStore();

  useEffect(() => {
    const checkStatus = async () => {
      await checkInterviewStatus(courseId);
    };

    if (courseId && user?.uid) {
      checkStatus();
    }
  }, [courseId, user?.uid]);

  useEffect(() => {
    if (status?.exists) {
      console.log("status", status);
      // if (status.status === "completed" && status.feedbackId) {
      //   router.push(`/interviews/${courseId}/feedback/${status.feedbackId}`);
      // }
    }
  }, [status, courseId, router]);

  if (interviewLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-fade-in-up">
            {status?.exists ? "Continue Interview" : "Start AI Interview"}
          </h1>
          {status?.exists && status.status === "pending" && (
            <p className="text-lg text-muted-foreground animate-fade-in-up delay-200">
              You have an interview in progress
            </p>
          )}
        </div>

        {!status?.exists || status.status === "pending" ? (
          <Agent
            userName={user?.name!}
            userId={user?.uid}
            profileImage={user?.profileURL}
            courseId={courseId as string}
            interviewId={currentInterview?.id}
          />
        ) : (
          <div className="text-center">
            <p>Redirecting to feedback...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPage;
