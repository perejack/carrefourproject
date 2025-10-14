import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobCard } from "@/components/JobCard";
import { ApplicationModal } from "@/components/ApplicationModal";
import { jobListings } from "@/data/jobListings";
import heroImage from "@/assets/hero-team.jpg";
import cashierImage from "@/assets/cashier.jpg";
import warehouseImage from "@/assets/warehouse.jpg";
import chefImage from "@/assets/chef.jpg";
import salesAttendantImage from "@/assets/sales-attendant.jpg";
import cleanerImage from "@/assets/cleaner.jpg";
import loaderImage from "@/assets/loader.jpg";
import storekeeperImage from "@/assets/storekeeper.jpg";
import marketerImage from "@/assets/marketer.jpg";
import driverImage from "@/assets/driver.jpg";
import guardImage from "@/assets/guard.jpg";
import receptionistImage from "@/assets/receptionist.jpg";
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  CheckCircle2,
  ArrowRight,
  Shield,
  Heart,
  Award
} from "lucide-react";

const Index = () => {
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApply = (jobTitle: string) => {
    setSelectedJob(jobTitle);
    setIsModalOpen(true);
  };

  // Assign images to specific jobs
  const jobsWithImages = jobListings.map(job => {
    if (job.title === "Accountant & Cashier") return { ...job, image: cashierImage };
    if (job.title === "Warehouse Supervisor") return { ...job, image: warehouseImage };
    if (job.title === "Chef") return { ...job, image: chefImage };
    if (job.title === "Sales Attendant") return { ...job, image: salesAttendantImage };
    if (job.title === "Cleaner") return { ...job, image: cleanerImage };
    if (job.title === "Loader and Off Loader") return { ...job, image: loaderImage };
    if (job.title === "Store Keeper") return { ...job, image: storekeeperImage };
    if (job.title === "Distributor and Marketer") return { ...job, image: marketerImage };
    if (job.title === "Driver") return { ...job, image: driverImage };
    if (job.title === "Guard") return { ...job, image: guardImage };
    if (job.title === "Receptionist") return { ...job, image: receptionistImage };
    return job;
  });

  const qualifications = [
    "Must be Kenyan of 18 years and above",
    "Reliability and trustworthiness",
    "Punctuality, time management and a sense of urgency",
    "Strong communication skills",
    "Good customer service skills",
    "Clean driving record and driving license (for driving positions)",
    "Ability to move and deliver items to recipients (for relevant positions)",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <Badge variant="secondary" className="mb-6 text-base px-6 py-2 animate-fade-in">
            <Briefcase className="w-4 h-4 mr-2" />
            Join Kenya's Leading Retailer
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in [animation-delay:200ms]">
            Build Your Career
            <span className="block text-secondary">
              with Carrefour
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-in [animation-delay:400ms]">
            Discover exciting opportunities across Kenya. Competitive salaries, medical benefits, and room to grow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in [animation-delay:600ms]">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-secondary hover:bg-secondary/90 text-white"
              onClick={() => document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Open Positions
              <ArrowRight className="ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section id="jobs" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Award className="w-4 h-4 mr-2" />
              Open Positions
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Find Your Perfect Role
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore diverse opportunities across all departments. Every role comes with competitive compensation and benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobsWithImages.map((job) => (
              <JobCard
                key={job.id}
                title={job.title}
                salary={job.salary}
                medical={job.medical}
                category={job.category}
                image={job.image}
                onApply={() => handleApply(job.title)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Qualifications Section */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <Shield className="w-4 h-4 mr-2" />
                Requirements
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                What We're Looking For
              </h2>
              <p className="text-xl text-muted-foreground">
                Essential qualifications for all applicants
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {qualifications.map((qual, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border hover:shadow-[var(--shadow-card)] transition-all hover:scale-[1.02]"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-foreground">{qual}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our team of passionate professionals and build a rewarding career with Carrefour Kenya.
          </p>
          <Button 
            size="lg" 
            variant="outline"
            className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90"
            onClick={() => document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Browse All Positions
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Carrefour Kenya. All rights reserved.</p>
        </div>
      </footer>

      <ApplicationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobTitle={selectedJob}
      />
    </div>
  );
};

export default Index;
