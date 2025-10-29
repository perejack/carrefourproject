import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, TrendingUp } from "lucide-react";

interface JobCardProps {
  title: string;
  salary: string;
  medical: string;
  category: string;
  image?: string;
  onApply: () => void;
}

export const JobCard = ({ title, salary, medical, category, image, onApply }: JobCardProps) => {
  return (
    <Card className="group overflow-hidden border-border hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:scale-[1.02] bg-gradient-to-b from-card to-muted/20">
      {image && (
        <div className="h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Badge variant="secondary" className="mb-2">
            <Briefcase className="w-3 h-3 mr-1" />
            {category}
          </Badge>
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">{salary}</span>
            <span>per month</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-secondary" />
            <span>Medical Allowance: <span className="font-semibold text-foreground">{medical}</span></span>
          </div>
        </div>

        <Button 
          onClick={onApply}
          className="w-full bg-secondary hover:bg-secondary/90"
        >
          Apply Now
        </Button>
      </CardContent>
    </Card>
  );
};
