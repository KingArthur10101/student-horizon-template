import { CheckCircle2, Circle } from "lucide-react";

const milestones = [
  {
    title: "Set Your Goals",
    description: "Define what success looks like for you",
    completed: true,
  },
  {
    title: "Create Your Roadmap",
    description: "Break down your goals into actionable steps",
    completed: true,
  },
  {
    title: "Build Your Skills",
    description: "Develop the capabilities you need to succeed",
    completed: false,
  },
  {
    title: "Track Your Progress",
    description: "Monitor achievements and adjust your plan",
    completed: false,
  },
  {
    title: "Achieve Your Dreams",
    description: "Reach your full potential and celebrate success",
    completed: false,
  },
];

export const Timeline = () => {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">Your Journey to Success</h2>
          <p className="text-xl text-muted-foreground">
            Follow a proven path to achieve your goals
          </p>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent/30" />
          
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative flex gap-6 group">
                {/* Icon */}
                <div className="relative z-10 flex-shrink-0">
                  {milestone.completed ? (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-background border-2 border-muted flex items-center justify-center group-hover:border-primary transition-colors">
                      <Circle className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 pb-12">
                  <div className="bg-card border-2 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
