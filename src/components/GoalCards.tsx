import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Briefcase, Target, TrendingUp } from "lucide-react";

const goals = [
  {
    title: "Academic Excellence",
    description: "Plan your courses, track assignments, and achieve your educational milestones",
    icon: GraduationCap,
    color: "from-primary to-primary/80",
  },
  {
    title: "Career Development",
    description: "Explore career paths, build your resume, and prepare for your dream job",
    icon: Briefcase,
    color: "from-secondary to-secondary/80",
  },
  {
    title: "Personal Growth",
    description: "Set personal goals, develop new habits, and become your best self",
    icon: Target,
    color: "from-accent to-accent/80",
  },
  {
    title: "Skill Building",
    description: "Identify key skills, track your progress, and stay competitive",
    icon: TrendingUp,
    color: "from-primary to-secondary",
  },
];

export const GoalCards = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Plan Every Aspect of Your{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Future
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive platform to organize your goals and track your progress
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {goals.map((goal, index) => {
            const Icon = goal.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:scale-105 cursor-pointer overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${goal.color}`} />
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${goal.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{goal.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {goal.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
