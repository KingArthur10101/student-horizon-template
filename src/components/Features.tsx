import { Card } from "@/components/ui/card";
import { Calendar, BarChart3, BookOpen, Users } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Smart Planning",
    description: "Organize your schedule and stay on top of deadlines with intelligent planning tools",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Visualize your growth with detailed analytics and milestone tracking",
  },
  {
    icon: BookOpen,
    title: "Resource Library",
    description: "Access curated resources, guides, and learning materials for your journey",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Connect with mentors and peers who share your ambitions and goals",
  },
];

export const Features = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you plan, track, and achieve your goals
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="p-8 hover:shadow-xl transition-all duration-300 border-2 group hover:border-primary/50"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
