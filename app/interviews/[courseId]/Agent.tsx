import { useState, useEffect, use } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Phone, PhoneCall, User, Bot } from "lucide-react";
import { vapi } from "@/lib/vapi.sdk";
import { useRouter } from "next/navigation";
import { interviewer } from "@/constants";

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
  feedbackId?: string;
  type: string;
  questions?: string[];
  profileImage?: string;
  courseId?: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
  profileImage = "/placeholder.svg",
  courseId,
}: AgentProps) => {
  const router = useRouter();

  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  console.log("courseId:", courseId);

  // Enhanced error handler
  const handleError = (error: Error | string) => {
    console.error("Call Error:", error);
    setError(typeof error === "string" ? error : error.message);
    setCallStatus(CallStatus.INACTIVE);
    vapi.stop(); // Ensure clean stop
  };

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      handleError(error);
    };

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

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback section triggered");

      //   const { success, feedbackId: id } = await createFeedback({
      //     interviewId: interviewId!,
      //     userId: userId!,
      //     transcript: messages,
      //     feedbackId,
      //   });

      //   if (success && id) {
      //     router.push(`/interview/${interviewId}/feedback`);
      //   } else {
      //     console.log("Error saving feedback");
      //     router.push("/");
      //   }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        // router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    try {
      setCallStatus(CallStatus.CONNECTING);
      setError(null);

      if (type === "generate") {
        // await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        await vapi.start("1fa83dce-1906-4b8a-b899-5e07d8483813"!, {
          variableValues: {
            username: userName,
            userid: userId,
            courseid: courseId,
          },
          clientMessages: [],
          serverMessages: [],
        });
      } else {
        const formattedQuestions =
          questions?.map((q) => `- ${q}`).join("\n") || "";

        await vapi.start(interviewer, {
          variableValues: { questions: formattedQuestions },
          clientMessages: [],
          serverMessages: [],
        });
      }
    } catch (error) {
      handleError(
        error instanceof Error ? error : new Error("Unknown call error")
      );
    }
  };

  const handleDisconnect = () => {
    try {
      setCallStatus(CallStatus.FINISHED);
      vapi.stop();
      setTimeout(() => setCallStatus(CallStatus.INACTIVE), 3000);
    } catch (error) {
      handleError(
        error instanceof Error ? error : new Error("Disconnect error")
      );
    }
  };

  const getStatusBadge = () => {
    switch (callStatus) {
      case CallStatus.CONNECTING:
        return (
          <Badge variant="secondary" className="animate-pulse">
            Connecting...
          </Badge>
        );
      case CallStatus.ACTIVE:
        return <Badge className="bg-green-500 hover:bg-green-600">Live</Badge>;
      case CallStatus.FINISHED:
        return <Badge variant="destructive">Call Ended</Badge>;
      default:
        return <Badge variant="outline">Ready</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Status Header */}
      <div className="flex justify-center">{getStatusBadge()}</div>

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
      <div className="flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <Button
            onClick={handleCall}
            disabled={callStatus === CallStatus.CONNECTING}
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
