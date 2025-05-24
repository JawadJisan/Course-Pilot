"use client";

import { useParams } from "next/navigation";
import { useFeedbackStore } from "@/lib/stores/feedback.store";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInterviewStore } from "@/lib/stores/interview.store";
import { useCourseStore } from "@/lib/stores/course.store";
import {
  Star,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

const FeedbackPage = () => {
  const { courseId, feedbackId } = useParams();
  const { getFeedbackById, currentFeedback, feedbackLoading, feedbackError } =
    useFeedbackStore();
  const { generateInterview, status } = useInterviewStore();
  const { fetchCourseDetails, courseDetails, courseLoading, courseError } =
    useCourseStore();

  useEffect(() => {
    if (feedbackId) {
      getFeedbackById(feedbackId as string);
    }
  }, [feedbackId, getFeedbackById]);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails(courseId as string);
    }
  }, [courseId, fetchCourseDetails]);

  const isLoading = feedbackLoading || courseLoading;
  const hasError = feedbackError || courseError;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 max-w-5xl mx-auto max-sm:px-4 text-lg leading-7 min-h-screen">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading feedback...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className="flex flex-col gap-8 max-w-5xl mx-auto max-sm:px-4 text-lg leading-7 min-h-screen">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-destructive text-center">
            Error loading feedback. Please try again later.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // No data state
  if (!currentFeedback || !courseDetails) {
    return (
      <div className="flex flex-col gap-8 max-w-5xl mx-auto max-sm:px-4 text-lg leading-7 min-h-screen">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground text-center">
            No feedback data found.
          </p>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    if (score >= 40) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <TrendingUp className="w-5 h-5 text-yellow-600" />;
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  };

  return (
    <section className="flex flex-col gap-8 max-w-5xl mx-auto max-sm:px-4 text-lg leading-7 py-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Interview Feedback
        </h1>
        <p className="text-xl text-muted-foreground">
          <span className="capitalize font-semibold">
            {courseDetails.title}
          </span>
        </p>
      </div>

      {/* Score Overview */}
      <Card className="bg-gradient-to-r from-background to-secondary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            {/* Overall Score */}
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow-500" />
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">Overall Score</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-2xl font-bold px-3 py-1 rounded-full ${getScoreColor(
                      currentFeedback.totalScore
                    )}`}
                  >
                    {currentFeedback.totalScore}
                  </span>
                  <span className="text-xl text-muted-foreground">/100</span>
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-500" />
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">Interview Date</p>
                <p className="font-semibold">
                  {formatDate(currentFeedback.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Final Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">
            {currentFeedback.finalAssessment}
          </p>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentFeedback.categoryScores &&
              Object.entries(currentFeedback.categoryScores).map(
                ([category, score], index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border bg-secondary/20"
                  >
                    <div className="flex items-center gap-3">
                      {getScoreIcon(score as number)}
                      <div>
                        <p className="font-semibold capitalize">
                          {category.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Category {index + 1}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={getScoreColor(score as number)}
                    >
                      {score}/100
                    </Badge>
                  </div>
                )
              )}
          </div>
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentFeedback.strengths && currentFeedback.strengths.length > 0 ? (
            <ul className="space-y-2">
              {currentFeedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                  <p>{strength}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground italic">
              No specific strengths identified.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Areas for Improvement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <AlertCircle className="w-5 h-5" />
            Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentFeedback.areasForImprovement &&
          currentFeedback.areasForImprovement.length > 0 ? (
            <ul className="space-y-2">
              {currentFeedback.areasForImprovement.map((area, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <p>{area}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground italic">
              No specific areas for improvement identified.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex w-full justify-evenly gap-4 max-sm:flex-col max-sm:items-center">
        <Button variant="outline" className="flex-1" asChild>
          <Link
            href="/"
            className="flex w-full justify-center items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-semibold text-center">
              Back to Dashboard
            </span>
          </Link>
        </Button>

        <Button className="flex-1" asChild>
          <Link
            href={`/interviews/${courseId}`}
            className="flex w-full justify-center items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm font-semibold text-center">
              Retake Interview
            </span>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default FeedbackPage;
