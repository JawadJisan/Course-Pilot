import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import EnhancedFeatures from "@/components/enhanced-features";
import StatsSection from "@/components/stats-section";
import AIInterviewPractice from "@/components/ai-interview-practice";
import HowItWorks from "@/components/how-it-works";
import CourseGallery from "@/components/course-gallery";
import InterviewShowcase from "@/components/interview-showcase";
import Testimonials from "@/components/testimonials";
import FAQ from "@/components/faq";
import Newsletter from "@/components/newsletter";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Background gradients - fixed and subtle */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <EnhancedFeatures />
        <StatsSection />
        <AIInterviewPractice />
        <HowItWorks />
        <CourseGallery />
        <InterviewShowcase />
        <Testimonials />
        <FAQ />
        <Newsletter />
        <Footer />
      </div>
    </div>
  );
}
