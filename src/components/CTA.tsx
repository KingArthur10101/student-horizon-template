import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-secondary to-accent p-1">
          <div className="bg-background rounded-3xl p-12 md:p-16">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium">Start Your Journey</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Ready to Plan Your{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Bright Future?
                </span>
              </h2>
              
              <p className="text-xl text-muted-foreground">
                Join thousands of students who are already mapping their path to success. 
                Your future self will thank you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                  Create Your Plan
                </Button>
                <Button size="lg" variant="outline" className="border-2">
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
