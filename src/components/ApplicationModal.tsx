import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  MapPin, 
  GraduationCap, 
  Briefcase,
  Phone,
  Mail,
  FileText,
  Loader2,
  Search,
  Users,
  Trophy,
  Star,
  Shield,
  Clock,
  Copy,
  CreditCard,
  Smartphone,
  Zap,
  Gift,
  Target,
  TrendingUp,
  Award,
  Sparkles
} from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  preferredLocation: z.string().min(1, "Please select a preferred location"),
  educationLevel: z.string().min(1, "Please select your education level"),
  currentLocation: z.string().min(1, "Please enter your current location"),
  position: z.string().min(1, "Please select a position"),
  workType: z.string().min(1, "Please select work type preference"),
});

type FormData = z.infer<typeof formSchema>;

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
}

// Flow states
type FlowState = 
  | 'form' 
  | 'processing' 
  | 'congratulations' 
  | 'spots-remaining' 
  | 'payment-intro' 
  | 'payment-details' 
  | 'phone-entry' 
  | 'stk-push' 
  | 'final-success';

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Location & Education", icon: GraduationCap },
  { id: 3, title: "Job Preferences", icon: Briefcase },
  { id: 4, title: "Review & Submit", icon: FileText },
];

const processingStages = [
  { text: "Reviewing personal information...", icon: User, duration: 2000 },
  { text: "Verifying education details...", icon: GraduationCap, duration: 1500 },
  { text: "Processing job preferences...", icon: Briefcase, duration: 1800 },
  { text: "Looking for open positions...", icon: Search, duration: 2200 },
  { text: "Finalizing application...", icon: CheckCircle2, duration: 1000 },
];

const positions = [
  "Cashier",
  "Cleaner", 
  "Store Keeper",
  "Driver",
  "Loaders & Off-loaders",
  "Marketer",
  "Sales Attendant",
  "Chef",
  "Warehouse Supervisor",
  "Guards"
];

const educationLevels = [
  "Primary",
  "Secondary", 
  "College",
  "University"
];

const locations = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Thika",
  "Machakos",
  "Meru",
  "Nyeri",
  "Kitale"
];

export const ApplicationModal = ({ isOpen, onClose, jobTitle }: ApplicationModalProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [flowState, setFlowState] = useState<FlowState>('form');
  const [processingStage, setProcessingStage] = useState(0);
  const [spotsRemaining, setSpotsRemaining] = useState(2);
  const [refundCode, setRefundCode] = useState('');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [transactionId, setTransactionId] = useState('');
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      preferredLocation: "",
      educationLevel: "",
      currentLocation: "",
      position: jobTitle || "",
      workType: "",
    },
  });

  const { watch, setValue, trigger, getValues } = form;
  const watchedValues = watch();

  // Generate random refund code
  const generateRefundCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'REF-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "Refund code has been copied successfully.",
      duration: 3000,
    });
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["fullName", "email", "phone"];
        break;
      case 2:
        fieldsToValidate = ["preferredLocation", "educationLevel", "currentLocation"];
        break;
      case 3:
        fieldsToValidate = ["position", "workType"];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Processing animation effect
  useEffect(() => {
    if (flowState === 'processing') {
      const timer = setTimeout(() => {
        if (processingStage < processingStages.length - 1) {
          setProcessingStage(processingStage + 1);
        } else {
          setFlowState('congratulations');
          setRefundCode(generateRefundCode());
        }
      }, processingStages[processingStage]?.duration || 1000);

      return () => clearTimeout(timer);
    }
  }, [flowState, processingStage]);

  const onSubmit = (data: FormData) => {
    setFlowState('processing');
    setProcessingStage(0);
  };

  const handleClose = () => {
    form.reset();
    setCurrentStep(1);
    setFlowState('form');
    setProcessingStage(0);
    setSpotsRemaining(2);
    setRefundCode('');
    setPaymentPhone('');
    setIsProcessingPayment(false);
    onClose();
  };

  const handlePaymentSubmit = async () => {
    if (!paymentPhone || paymentPhone.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number for STK push.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessingPayment(true);
    setFlowState('stk-push');
    setPaymentError('');
    
    try {
      // Format phone number to 254 format
      let formattedPhone = paymentPhone.replace(/\s/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.substring(1);
      } else if (formattedPhone.startsWith('+254')) {
        formattedPhone = formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith('254')) {
        formattedPhone = '254' + formattedPhone;
      }

      // Generate unique reference
      const reference = `CRFF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Initiate payment
      const response = await fetch('/.netlify/functions/initiate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          msisdn: formattedPhone,
          amount: 139,
          email: watchedValues.email || 'applicant@carrefour.com',
          reference: reference,
        }),
      });

      const result = await response.json();

      if (result.success === '200' || result.success === 200) {
        const txnId = result.transaction_request_id;
        setTransactionId(txnId);
        
        // Start polling for payment status
        pollPaymentStatus(txnId);
      } else {
        throw new Error(result.error || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      setIsProcessingPayment(false);
      setPaymentError(error instanceof Error ? error.message : 'Failed to initiate payment');
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
      setFlowState('phone-entry');
    }
  };

  const pollPaymentStatus = async (txnId: string) => {
    let attempts = 0;
    const maxAttempts = 24; // 2 minutes (5 second intervals)

    const checkStatus = async () => {
      try {
        // First check database
        const response = await fetch(`/.netlify/functions/check-status-db/${txnId}`);
        const data = await response.json();

        console.log('Payment status check:', data);

        // If still pending after 30 seconds, check PesaFlux API directly
        if (attempts > 6 && data.payment?.status === 'pending') {
          console.log('Checking PesaFlux API directly...');
          try {
            const apiResponse = await fetch('/.netlify/functions/check-pesaflux-status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ transaction_request_id: txnId }),
            });
            const apiData = await apiResponse.json();
            console.log('PesaFlux API check:', apiData);
            
            // Continue with database check after API call
            setTimeout(checkStatus, 5000);
            attempts++;
            return;
          } catch (apiError) {
            console.error('PesaFlux API check error:', apiError);
          }
        }

        if (data.success && data.payment) {
          const status = data.payment.status;

          if (status === 'success') {
            // Payment successful
            setIsProcessingPayment(false);
            setFlowState('final-success');
            return;
          } else if (status === 'failed' || status === 'cancelled') {
            // Payment failed or cancelled
            setIsProcessingPayment(false);
            const errorMsg = status === 'cancelled' 
              ? 'Payment cancelled by user. Please try again.' 
              : 'Payment failed. Please try again.';
            setPaymentError(errorMsg);
            toast({
              title: "Payment " + (status === 'cancelled' ? 'Cancelled' : 'Failed'),
              description: errorMsg,
              variant: "destructive",
            });
            setFlowState('phone-entry');
            return;
          }
        }

        // Continue polling if still pending
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 5000); // Check every 5 seconds
        } else {
          // Timeout
          setIsProcessingPayment(false);
          setPaymentError('Payment timeout. Please try again.');
          toast({
            title: "Payment Timeout",
            description: "Payment timeout. Please try again.",
            variant: "destructive",
          });
          setFlowState('phone-entry');
        }
      } catch (error) {
        console.error('Status check error:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 5000);
        } else {
          setIsProcessingPayment(false);
          setPaymentError('Unable to verify payment status.');
          toast({
            title: "Status Check Error",
            description: "Unable to verify payment status.",
            variant: "destructive",
          });
          setFlowState('phone-entry');
        }
      }
    };

    checkStatus();
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[95vh] overflow-y-auto p-4 sm:p-6">
        {/* FORM FLOW */}
        {flowState === 'form' && (
          <>
            <DialogHeader className="space-y-3 sm:space-y-4">
              <DialogTitle className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
                Job Application
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Complete your application in {steps.length} simple steps
              </DialogDescription>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
              <span>Step {currentStep} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>

          {/* Step Indicators - Mobile Optimized */}
          <div className="flex justify-between items-center px-2">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center space-y-1 sm:space-y-2">
                  <div className={`
                    w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300
                    ${isCompleted ? 'bg-primary text-primary-foreground' : 
                      isActive ? 'bg-primary/20 text-primary border-2 border-primary' : 
                      'bg-muted text-muted-foreground'}
                  `}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight max-w-[60px] sm:max-w-none ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4 sm:space-y-6 animate-in slide-in-from-right-5 duration-300">
              <div className="text-center space-y-2">
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto" />
                <h3 className="text-lg sm:text-xl font-semibold">Personal Information</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Let's start with your basic details</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2 text-sm sm:text-base">
                    <User className="w-4 h-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    {...form.register("fullName")}
                    className="h-11 sm:h-12 text-base"
                  />
                  {form.formState.errors.fullName && (
                    <p className="text-xs sm:text-sm text-destructive">{form.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm sm:text-base">
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    {...form.register("email")}
                    className="h-11 sm:h-12 text-base"
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs sm:text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-sm sm:text-base">
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+254 700 000 000"
                    {...form.register("phone")}
                    className="h-11 sm:h-12 text-base"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-xs sm:text-sm text-destructive">{form.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location & Education */}
          {currentStep === 2 && (
            <div className="space-y-4 sm:space-y-6 animate-in slide-in-from-right-5 duration-300">
              <div className="text-center space-y-2">
                <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto" />
                <h3 className="text-lg sm:text-xl font-semibold">Location & Education</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Tell us about your location and education</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm sm:text-base">
                    <MapPin className="w-4 h-4" />
                    Preferred Work Location *
                  </Label>
                  <Select onValueChange={(value) => setValue("preferredLocation", value)}>
                    <SelectTrigger className="h-11 sm:h-12 text-base">
                      <SelectValue placeholder="Select preferred location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location} className="text-base">
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.preferredLocation && (
                    <p className="text-xs sm:text-sm text-destructive">{form.formState.errors.preferredLocation.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm sm:text-base">
                    <GraduationCap className="w-4 h-4" />
                    Level of Education *
                  </Label>
                  <Select onValueChange={(value) => setValue("educationLevel", value)}>
                    <SelectTrigger className="h-11 sm:h-12 text-base">
                      <SelectValue placeholder="Select your education level" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevels.map((level) => (
                        <SelectItem key={level} value={level} className="text-base">
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.educationLevel && (
                    <p className="text-xs sm:text-sm text-destructive">{form.formState.errors.educationLevel.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentLocation" className="flex items-center gap-2 text-sm sm:text-base">
                    <MapPin className="w-4 h-4" />
                    Where are you currently located? *
                  </Label>
                  <Input
                    id="currentLocation"
                    placeholder="Enter your current location"
                    {...form.register("currentLocation")}
                    className="h-11 sm:h-12 text-base"
                  />
                  {form.formState.errors.currentLocation && (
                    <p className="text-xs sm:text-sm text-destructive">{form.formState.errors.currentLocation.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Job Preferences */}
          {currentStep === 3 && (
            <div className="space-y-4 sm:space-y-6 animate-in slide-in-from-right-5 duration-300">
              <div className="text-center space-y-2">
                <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto" />
                <h3 className="text-lg sm:text-xl font-semibold">Job Preferences</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Choose your preferred position and work type</p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm sm:text-base">
                    <Briefcase className="w-4 h-4" />
                    Position you are applying for *
                  </Label>
                  <Select 
                    onValueChange={(value) => setValue("position", value)}
                    defaultValue={jobTitle || ""}
                  >
                    <SelectTrigger className="h-11 sm:h-12 text-base">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((position) => (
                        <SelectItem key={position} value={position} className="text-base">
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.position && (
                    <p className="text-xs sm:text-sm text-destructive">{form.formState.errors.position.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm sm:text-base font-medium">
                    Do you want to work part time or full time? *
                  </Label>
                  <RadioGroup 
                    onValueChange={(value) => setValue("workType", value)}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                  >
                    <div className="flex items-center space-x-3 border rounded-lg p-3 sm:p-4 hover:bg-accent transition-colors">
                      <RadioGroupItem value="Full Time" id="fulltime" />
                      <Label htmlFor="fulltime" className="flex-1 cursor-pointer">
                        <div className="font-medium text-sm sm:text-base">Full Time</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">40+ hours per week</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 border rounded-lg p-3 sm:p-4 hover:bg-accent transition-colors">
                      <RadioGroupItem value="Part Time" id="parttime" />
                      <Label htmlFor="parttime" className="flex-1 cursor-pointer">
                        <div className="font-medium text-sm sm:text-base">Part Time</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Less than 40 hours</div>
                      </Label>
                    </div>
                  </RadioGroup>
                  {form.formState.errors.workType && (
                    <p className="text-xs sm:text-sm text-destructive">{form.formState.errors.workType.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="space-y-4 sm:space-y-6 animate-in slide-in-from-right-5 duration-300">
              <div className="text-center space-y-2">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto" />
                <h3 className="text-lg sm:text-xl font-semibold">Review Your Application</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Please review your information before submitting</p>
              </div>

              <div className="space-y-3 sm:space-y-4 bg-muted/30 rounded-lg p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1 sm:space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Full Name</Label>
                      <p className="font-medium text-sm sm:text-base break-words">{watchedValues.fullName}</p>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="font-medium text-sm sm:text-base break-all">{watchedValues.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1 sm:space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Phone</Label>
                      <p className="font-medium text-sm sm:text-base">{watchedValues.phone}</p>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Preferred Location</Label>
                      <p className="font-medium text-sm sm:text-base">{watchedValues.preferredLocation}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1 sm:space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Education Level</Label>
                      <p className="font-medium text-sm sm:text-base">{watchedValues.educationLevel}</p>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Current Location</Label>
                      <p className="font-medium text-sm sm:text-base break-words">{watchedValues.currentLocation}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1 sm:space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Position</Label>
                      <p className="font-medium text-sm sm:text-base">{watchedValues.position}</p>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Work Type</Label>
                      <p className="font-medium text-sm sm:text-base">{watchedValues.workType}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium text-primary text-sm sm:text-base">Ready to Submit</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      By submitting this application, you confirm that all information provided is accurate and complete.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 border-t">
            {/* Mobile: Stack buttons vertically, Desktop: Side by side */}
            <div className="flex gap-2 sm:gap-3 order-2 sm:order-1">
              {currentStep > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep}
                  className="flex-1 sm:flex-none h-11 sm:h-10 text-sm sm:text-base"
                >
                  <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              )}
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                className={`${currentStep === 1 ? "flex-1" : "flex-1 sm:flex-none"} h-11 sm:h-10 text-sm sm:text-base`}
              >
                Cancel
              </Button>
            </div>

            {currentStep < 4 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                className="flex-1 order-1 sm:order-2 h-11 sm:h-10 text-sm sm:text-base bg-primary hover:bg-primary/90"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Continue</span>
                <ArrowRight className="w-4 h-4 ml-1 sm:ml-2" />
              </Button>
            ) : (
              <Button 
                type="submit"
                className="flex-1 order-1 sm:order-2 h-11 sm:h-10 text-sm sm:text-base bg-primary hover:bg-primary/90"
              >
                <CheckCircle2 className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Submit Application</span>
                <span className="sm:hidden">Submit</span>
              </Button>
            )}
          </div>
        </form>
            </>
        )}

        {/* PROCESSING SCREEN */}
        {flowState === 'processing' && (
          <div className="text-center space-y-6 py-8">
            <div className="space-y-4">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Processing Your Application</h3>
                <p className="text-muted-foreground">Please wait while we review your information...</p>
              </div>
            </div>

            <div className="space-y-4">
              {processingStages.map((stage, index) => {
                const Icon = stage.icon;
                const isActive = index === processingStage;
                const isCompleted = index < processingStage;
                
                return (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                    isActive ? 'bg-primary/5 border border-primary/20' : 
                    isCompleted ? 'bg-green-50 border border-green-200' : 'bg-muted/30'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isActive ? 'bg-primary text-white' : 'bg-muted'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : 
                       isActive ? <Icon className="w-4 h-4 animate-pulse" /> : 
                       <Icon className="w-4 h-4" />}
                    </div>
                    <span className={`text-sm font-medium ${
                      isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
                    }`}>
                      {stage.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CONGRATULATIONS SCREEN */}
        {flowState === 'congratulations' && (
          <div className="text-center space-y-6 py-8">
            <div className="space-y-4">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-green-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <Star className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-green-600">Congratulations! 🎉</h3>
                <p className="text-muted-foreground">Your application has been successfully processed!</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-600">Application Approved</span>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Your application for <strong>{watchedValues.position}</strong> has been reviewed and meets our requirements.
                </p>
                <p className="text-sm text-muted-foreground">
                  You're now eligible to proceed to the next stage of our hiring process.
                </p>
              </div>
            </div>

            <Button 
              onClick={() => setFlowState('spots-remaining')}
              className="w-full h-12 text-base bg-green-600 hover:bg-green-700"
            >
              Continue to Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* SPOTS REMAINING SCREEN */}
        {flowState === 'spots-remaining' && (
          <div className="text-center space-y-6 py-8">
            <div className="space-y-4">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                  <Users className="w-10 h-10 text-orange-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white font-bold text-sm">{spotsRemaining}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-orange-600">Limited Spots Available!</h3>
                <p className="text-muted-foreground">Act fast - only {spotsRemaining} positions remaining for {watchedValues.position}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-orange-600">Time Sensitive Opportunity</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Target className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">High demand position with immediate start</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">Competitive salary package included</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">Full benefits and career growth opportunities</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>⚡ Quick Action Required:</strong> Secure your position now before spots are filled by other candidates!
              </p>
            </div>

            <Button 
              onClick={() => setFlowState('payment-intro')}
              className="w-full h-12 text-base bg-orange-600 hover:bg-orange-700 animate-pulse"
            >
              Secure My Position Now
              <Zap className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* PAYMENT INTRO SCREEN */}
        {flowState === 'payment-intro' && (
          <div className="text-center space-y-6 py-8">
            <div className="space-y-4">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-10 h-10 text-blue-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-blue-600">Secure Your Position</h3>
                <p className="text-muted-foreground">Complete your application now</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Gift className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-600">After you complete the application you will get</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-sm">Guaranteed Placement</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Priority consideration for immediate hiring</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4 text-green-500" />
                      <span className="font-medium text-sm">Direct Call</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Personal interview within 48 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-600">100% Refundable Processing Fee</span>
              </div>
              <p className="text-sm text-green-700">
                Your payment is fully refundable. We're committed to transparency and fairness.
              </p>
            </div>

            <Button 
              onClick={() => setFlowState('payment-details')}
              className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700"
            >
              Continue to Payment Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* PAYMENT DETAILS SCREEN */}
        {flowState === 'payment-details' && (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Application Processing Fee</h3>
                <p className="text-muted-foreground">Secure your position with our refundable processing fee</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/5 to-blue-50 border border-primary/20 rounded-lg p-6 space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">KSH 139</div>
                <p className="text-sm text-muted-foreground">One-time processing fee</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <span className="text-sm font-medium">Processing Fee</span>
                  <span className="text-sm font-bold">KSH 139</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm font-medium text-green-700">Refund Guarantee</span>
                  <span className="text-sm font-bold text-green-700">100%</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Your Refund Code</span>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-yellow-200">
                <code className="flex-1 text-sm font-mono font-bold text-primary">{refundCode}</code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(refundCode)}
                  className="h-8"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              
              <p className="text-xs text-yellow-700">
                <strong>⚠️ Important:</strong> Save this code safely! You'll need it for refund processing if required.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-600">Why Pay Processing Fee?</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ensures serious candidates only</li>
                <li>• Guarantees priority review of your application</li>
                <li>• Provides direct access to hiring managers</li>
                <li>• 100% refundable if not selected</li>
              </ul>
            </div>

            <Button 
              onClick={() => setFlowState('phone-entry')}
              className="w-full h-12 text-base bg-primary hover:bg-primary/90"
            >
              Process Application
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* PHONE ENTRY SCREEN */}
        {flowState === 'phone-entry' && (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-green-600" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">M-Pesa Payment</h3>
                <p className="text-muted-foreground">Enter your phone number to receive STK push</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">KSH 139</div>
                <p className="text-sm text-green-700">Will be deducted from your M-Pesa</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentPhone" className="flex items-center gap-2 text-sm sm:text-base">
                  <Phone className="w-4 h-4" />
                  M-Pesa Phone Number *
                </Label>
                <Input
                  id="paymentPhone"
                  type="tel"
                  placeholder="254700000000"
                  value={paymentPhone}
                  onChange={(e) => setPaymentPhone(e.target.value)}
                  className="h-12 text-base"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the phone number registered with M-Pesa
                </p>
                {paymentError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm text-center">{paymentError}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-600">Secure Payment Process</span>
              </div>
              <p className="text-sm text-blue-700">
                You'll receive an STK push notification on your phone. Enter your M-Pesa PIN to complete the payment.
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => setFlowState('payment-details')}
                className="flex-1 h-12"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handlePaymentSubmit}
                disabled={!paymentPhone || paymentPhone.length < 10 || isProcessingPayment}
                className="flex-1 h-12 bg-green-600 hover:bg-green-700"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Finish Application
                    <Zap className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* STK PUSH SCREEN */}
        {flowState === 'stk-push' && (
          <div className="text-center space-y-6 py-8">
            <div className="space-y-4">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <Smartphone className="w-10 h-10 text-green-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-ping">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-green-600">STK Push Sent!</h3>
                <p className="text-muted-foreground">Check your phone for M-Pesa notification</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-5 h-5 text-green-600 animate-bounce" />
                <span className="font-semibold text-green-600">Payment in Progress</span>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-center">
                  We've sent an STK push to <strong>{paymentPhone}</strong>
                </p>
                <p className="text-sm text-center text-muted-foreground">
                  Enter your M-Pesa PIN on your phone to complete the payment
                </p>
              </div>
              
              <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800 text-center">
                <strong>⏰ Waiting for payment confirmation...</strong><br/>
                This usually takes 10-30 seconds
              </p>
            </div>
          </div>
        )}

        {/* FINAL SUCCESS SCREEN */}
        {flowState === 'final-success' && (
          <div className="text-center space-y-6 py-8">
            <div className="space-y-4">
              <div className="relative">
                <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-green-600">Payment Successful! 🎉</h3>
                <p className="text-muted-foreground">Your application is now complete and prioritized</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-600">Application Status: PRIORITY</span>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-sm">Interview Call</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Expect a call within 24-48 hours</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-sm">Guaranteed Consideration</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Priority review by hiring managers</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-600">Your Refund Code (Keep Safe)</span>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-blue-200">
                <code className="flex-1 text-sm font-mono font-bold text-primary">{refundCode}</code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(refundCode)}
                  className="h-8"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Thank you for choosing Carrefour Kenya! We're excited to potentially welcome you to our team.
              </p>
              
              <Button 
                onClick={handleClose}
                className="w-full h-12 text-base bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Complete Application
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
