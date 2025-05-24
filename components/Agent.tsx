// components/Agent.tsx
import { useState, useEffect } from "react";
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
import Lottie from "lottie-react";
import { tr } from "date-fns/locale";

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

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
    const onMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setMessages((prev) => [
          ...prev,
          {
            role: message.role,
            content: message.transcript,
          },
        ]);
      }
    };
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => handleError(error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }
  }, [messages]);

  useEffect(() => {
    const handleFinishInterview = async () => {
      if (callStatus === CallStatus.FINISHED && currentInterview?.id) {
        console.log("interview finshed");

        // Convert messages to plain JavaScript array
        const transcript = messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        console.log("Submitting transcript:", {
          interviewId: currentInterview.id,
          transcript: transcript,
        });

        try {
          const feedbackRes = await generateFeedback({
            interviewId: currentInterview.id,
            transcript: transcript,
          });

          router.push(`/interviews/${courseId}/feedback/${feedbackRes.id}`);
        } catch (error) {
          handleError(
            error instanceof Error
              ? error
              : new Error("Feedback generation failed")
          );
        }
      }
    };

    handleFinishInterview();
  }, [callStatus, currentInterview?.id, courseId, router, messages]);

  const handleCall = async () => {
    try {
      setCallStatus(CallStatus.CONNECTING);
      setError(null);
      toast.info("Preparing interview session...");

      if (!courseId || !userId) {
        toast.error("Missing required parameters");
      }

      const interview = await generateInterview(courseId);

      if (!interview?.questions) {
        toast.error("Failed to generate interview questions");
      }

      toast.success("Session ready! Starting interview...");

      const sampleQuestions = [
        "What is the difference between let, const, and var in JavaScript?",
        "Explain how closures work in JavaScript",
        "What is the event loop and how does it work?",
        "How does 'this' keyword work in JavaScript?",
        "Explain the difference between == and ===",
      ];

      const formattedQuestions = interview.questions
        .map((q: string) => `- ${q}`)
        .join("\n");

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
          userName: userName,
          courseName: courseName,
        },
        clientMessages: ["transcript"],
        serverMessages: [],
      });
    } catch (error) {
      handleError(error instanceof Error ? error : new Error("Call failed"));
    }
  };

  console.log("currentInterview:", currentInterview);

  const handleDisconnect = () => {
    try {
      setCallStatus(CallStatus.FINISHED);
      vapi.stop();
    } catch (error) {
      handleError(
        error instanceof Error ? error : new Error("Disconnect error")
      );
    }
  };

  const getStatusBadge = () => {
    switch (callStatus) {
      case CallStatus.CONNECTING:
        return <Badge variant="secondary">Connecting...</Badge>;
      case CallStatus.ACTIVE:
        return <Badge className="bg-green-500">Live</Badge>;
      case CallStatus.FINISHED:
        return <Badge variant="destructive">Call Ended</Badge>;
      default:
        return <Badge variant="outline">Ready</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-2 relative">
      {/* Loading overlay */}
      {generateInterviewLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-lg">
          {/* <div className="w-48 h-48">
            <Lottie animationData={loadingAnimation} loop={true} />
          </div> */}
          <div className="w-32 h-32 mb-4">
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-primary border-t-transparent mx-auto"></div>
          </div>
          <p className="text-lg font-semibold text-muted-foreground">
            {mode === "resume"
              ? "Loading Session..."
              : "Preparing Questions..."}
          </p>
        </div>
      )}

      {/* Status Header */}
      <div className="flex justify-center">{getStatusBadge()}</div>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {interviewType}
        </h2>
        <p className="text-lg text-muted-foreground">{courseName} </p>
        <p className="text-sm text-muted-foreground/30">
          {mode === "review" ? "Previous Attempt" : "Current Session"}
        </p>
      </div>

      {/* Main Interview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* AI Interviewer Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-2 hover:shadow-xl transition-all duration-500 animate-fade-in-up">
          <CardContent className="p-8 text-center">
            <div className="relative mb-6">
              <div
                className={cn(
                  "relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary/20 transition-all duration-300",
                  isSpeaking &&
                    callStatus === CallStatus.ACTIVE &&
                    "border-primary border-8 shadow-lg shadow-primary/20"
                )}
              >
                <div className="w-full h-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <Bot className="w-16 h-16 text-primary-foreground" />
                </div>
                {isSpeaking && callStatus === CallStatus.ACTIVE && (
                  <>
                    <div className="absolute -inset-4 border-2 border-primary/30 rounded-full animate-ping" />
                    <div className="absolute -inset-8 border border-primary/20 rounded-full animate-ping animation-delay-75" />
                  </>
                )}
              </div>

              {callStatus === CallStatus.ACTIVE && (
                <div className="absolute -top-2 -right-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Mic className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>

            <h3 className="text-2xl font-bold mb-2 text-primary">
              AI Interviewer
            </h3>
            <p className="text-muted-foreground mb-4">
              Powered by advanced AI technology
            </p>

            {callStatus === CallStatus.ACTIVE && (
              <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Speaking...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Profile Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-secondary/50 to-accent/30 border-2 hover:shadow-xl transition-all duration-500 animate-fade-in-up animation-delay-200">
          <CardContent className="p-8 text-center">
            <div className="relative mb-6">
              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-secondary">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center">
                    <User className="w-16 h-16 text-secondary-foreground" />
                  </div>
                )}
              </div>

              {callStatus === CallStatus.ACTIVE && (
                <div className="absolute -top-2 -right-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <MicOff className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>

            <h3 className="text-2xl font-bold mb-2">{userName}</h3>
            <p className="text-muted-foreground mb-4">Interview Candidate</p>

            {callStatus === CallStatus.ACTIVE && (
              <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span>Listening...</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transcript Section */}
      {messages.length > 0 && (
        <Card className="animate-fade-in-up bg-gradient-to-r from-muted/50 to-muted/30 border-dashed">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span>Latest Message</span>
            </h4>
            <div className="bg-background/80 rounded-lg p-4 border-l-4 border-primary">
              <p className="text-foreground animate-fade-in-up italic">
                "{lastMessage}"
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call Control Button */}
      <div className="flex justify-center py-2">
        {callStatus !== CallStatus.ACTIVE ? (
          <Button
            onClick={handleCall}
            disabled={
              callStatus === CallStatus.CONNECTING || generateInterviewLoading
            }
            size="lg"
            className={cn(
              "relative px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300",
              "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary",
              "shadow-lg hover:shadow-xl hover:scale-105",
              callStatus === CallStatus.CONNECTING && "animate-pulse"
            )}
          >
            {callStatus === CallStatus.CONNECTING && (
              <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping" />
            )}
            <div className="flex items-center space-x-3">
              <PhoneCall className="w-6 h-6" />
              <span>
                {callStatus === CallStatus.INACTIVE ||
                callStatus === CallStatus.FINISHED
                  ? "Start Interview"
                  : "Connecting..."}
              </span>
            </div>
          </Button>
        ) : (
          <Button
            onClick={handleDisconnect}
            variant="destructive"
            size="lg"
            className="px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <Phone className="w-6 h-6" />
              <span>End Interview</span>
            </div>
          </Button>
        )}
      </div>

      {/* Connection Status */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {callStatus === CallStatus.INACTIVE &&
            "Ready to start your AI interview"}
          {callStatus === CallStatus.CONNECTING &&
            "Establishing secure connection..."}
          {callStatus === CallStatus.ACTIVE &&
            "Interview in progress - Speak clearly"}
          {callStatus === CallStatus.FINISHED &&
            "Interview completed successfully"}
        </p>
      </div>
    </div>
  );
};

export default Agent;
