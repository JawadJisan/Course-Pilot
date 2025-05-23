"use client";

import { useParams } from "next/navigation";
import Agent from "@/components/Agent";
import { useAuthStore } from "@/lib/stores/auth.store";

const Page = () => {
  const { user } = useAuthStore();
  const { courseId } = useParams();

  console.log("user:", user);
  console.log("courseId:", courseId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-fade-in-up">
            AI Interview Assistant
          </h1>
          <p className="text-lg text-muted-foreground animate-fade-in-up delay-200">
            Experience the future of interview preparation
          </p>
        </div>

        <Agent
          userName={user?.name!}
          userId={user?.uid}
          profileImage={user?.profileURL}
          type="generate"
          courseId={courseId}
        />
      </div>
    </div>
  );
};

export default Page;
