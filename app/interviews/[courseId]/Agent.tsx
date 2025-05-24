// components/Agent.tsx
import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Phone, PhoneCall, User, Bot } from "lucide-react";
import { vapi } from "@/lib/vapi.sdk";
import { useRouter } from "next/navigation";
import { interviewer } from "@/constants";
import { useInterviewStore } from "@/lib/stores/interview.store";
import { useFeedbackStore } from "@/lib/stores/feedback.store";
import { toast } from "sonner";
import loadingAnimation from "@/public/loading.json";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  profileImage?: string;
  courseId?: string;
  courseName?: string;
  mode?: "new" | "resume" | "retake" | "review";
}

const Agent = ({
  userName,
  userId,
  interviewId,
  profileImage = "/placeholder.svg",
  courseId,
  courseName = "This Course", // Default fallback
  mode = "new",
}: AgentProps) => {
  const router = useRouter();
  const { 
    generateInterview, 
    currentInterview,
    generateInterviewLoading,
    error: interviewError,
  } = useInterviewStore();
  const { generateFeedback } = useFeedbackStore();

  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const interviewType = {
    new: "Starting New Interview",
    resume: "Resuming Interview",
    retake: "Retaking Interview",
    review: "Reviewing Previous Attempt",
  }[mode];

  const handleError = (error: Error | string) => {
    console.error("Call Error:", error);
    const errorMessage = typeof error === "string" ? error : error.message;
    setError(errorMessage);
    setCallStatus(CallStatus.INACTIVE);
    vapi.stop();
    toast.error("Interview Error", { description: errorMessage });
  };

  // ... (Keep existing useEffect hooks and event listeners)

  const handleCall = async () => {
    try {
      setCallStatus(CallStatus.CONNECTING);
      setError(null);
      toast.info("Preparing interview session...");

      if (!courseId || !userId) {
        throw new Error("Missing required parameters");
      }

      const interview = await generateInterview(courseId);
      
      if (!interview?.questions) {
        throw new Error("Failed to generate interview questions");
      }

      toast.success("Session ready! Starting interview...");
      
      const formattedQuestions = interview.questions
        .map((q: string) => `- ${q}`)
        .join("\n");

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
          userName: userName,
          courseName: courseName, // Use prop value
        },
        clientMessages: ["transcript"],
        serverMessages: [],
      });
    } catch (error) {
      handleError(error instanceof Error ? error : new Error("Call failed"));
    }
  };

  // ... (Keep existing handleFinishInterview useEffect)

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {interviewType}
        </h2>
        <p className="text-lg text-muted-foreground">
          {courseName} • {mode === 'review' ? 'Previous Attempt' : 'Current Session'}
        </p>
      </div>

      {/* Loading overlay */}
      {generateInterviewLoading && (
        <div className="absolute inset-0 bg-background/80 z-50 flex flex-col items-center justify-center rounded-lg">
          <div className="w-48 h-48">
            <Lottie animationData={loadingAnimation} loop={true} />
          </div>
          <p className="text-lg font-semibold text-muted-foreground">
            {mode === 'resume' ? 'Loading Session...' : 'Preparing Questions...'}
          </p>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 bg-destructive/10 z-50 flex items-center justify-center rounded-lg">
          <Card className="max-w-md bg-background/90">
            <CardContent className="p-6 text-center">
              <div className="text-destructive mb-4">
                <Bot className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold mb-2">Session Interrupted</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button 
                variant="destructive"
                onClick={() => setError(null)}
              >
                {mode === 'retake' ? 'Try Retake' : 'Try Again'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Interview UI */}
      <div className={cn(generateInterviewLoading && "opacity-50 pointer-events-none")}>
        {/* Status Badge */}
        <div className="flex justify-center">{getStatusBadge()}</div>

        {/* Interview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* AI Interviewer Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-2">
            <CardContent className="p-8 text-center">
              {/* ... (Keep existing AI card content) */}
            </CardContent>
          </Card>

          {/* User Profile Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-secondary/50 to-accent/30 border-2">
            <CardContent className="p-8 text-center">
              {/* ... (Keep existing user card content) */}
            </CardContent>
          </Card>
        </div>

        {/* Transcript Section */}
        {messages.length > 0 && (
          <Card className="animate-fade-in-up bg-gradient-to-r from-muted/50 to-muted/30 border-dashed">
            <CardContent className="p-6">
              {/* ... (Keep existing transcript content) */}
            </CardContent>
          </Card>
        )}

        {/* Call Controls */}
        <div className="flex justify-center">
          {callStatus !== CallStatus.ACTIVE ? (
            <Button
              onClick={handleCall}
              disabled={callStatus === CallStatus.CONNECTING || generateInterviewLoading}
              size="lg"
              className={cn(
                "relative px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300",
                "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary",
                "shadow-lg hover:shadow-xl hover:scale-105",
                (callStatus === CallStatus.CONNECTING || generateInterviewLoading) && "animate-pulse",
                generateInterviewLoading && "cursor-not-allowed"
              )}
            >
              {/* ... (Keep existing button content) */}
            </Button>
          ) : (
            /* ... (Keep existing end call button) */
          )}
        </div>
      </div>
    </div>
  );
};

export default Agent;