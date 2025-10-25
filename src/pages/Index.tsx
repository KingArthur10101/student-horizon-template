import { Hero } from "@/components/Hero";
import { GoalCards } from "@/components/GoalCards";
import { Timeline } from "@/components/Timeline";
import { Features } from "@/components/Features";
import { CTA } from "@/components/CTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <GoalCards />
      <Timeline />
      <Features />
      <CTA />
    </div>
  );
};

export default Index;
