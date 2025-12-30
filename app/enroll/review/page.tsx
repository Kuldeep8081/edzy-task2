'use client';

import { useEnrollmentStore } from '@/store/useEnrollmentStore';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle } from 'lucide-react';
import { toast } from "sonner"; // Import toast from sonner

export default function ReviewPage() {
  const router = useRouter();
  const { formData, resetForm } = useEnrollmentStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Redirect if previous steps aren't done (checking paymentPlan as proxy)
    if (!formData.paymentPlan) router.replace('/enroll/step-3');
  }, [formData.paymentPlan, router]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Log payload
    console.log("FINAL PAYLOAD:", JSON.stringify(formData, null, 2));

    // Show Success Toast
    toast.success("Application Submitted!", {
      description: "We have sent a confirmation email to " + formData.email,
    });

    setIsSubmitting(false);
    setIsSuccess(true);
    resetForm();
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-4 py-10 fade-in animate-in duration-500">
        <div className="flex justify-center">
           <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-green-700">Enrollment Successful!</h2>
        <p className="text-slate-600">Your application has been received.</p>
        <Button onClick={() => router.push('/enroll/step-1')}>Start New Enrollment</Button>
        
        {/* Debug Payload View */}
        <div className="mt-8 text-left bg-slate-950 text-slate-50 p-4 rounded-md overflow-auto max-h-60 text-xs shadow-inner">
            <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      </div>
    );
  }

  // Helper to render sections
  const Section = ({ title, step, data }: { title: string, step: string, data: Record<string, any> }) => (
    <Card className="mb-4 shadow-sm border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between py-3 bg-slate-50/50 border-b">
        <CardTitle className="text-sm font-semibold uppercase text-slate-500 tracking-wider">{title}</CardTitle>
        <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => router.push(step)}>Edit</Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 pt-4 text-sm">
        {Object.entries(data).map(([key, value]) => {
           if (!value || value.length === 0) return null;
           return (
             <div key={key} className="flex flex-col">
               <span className="text-muted-foreground capitalize text-xs">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
               <span className="font-medium truncate text-slate-900">{Array.isArray(value) ? value.join(", ") : String(value)}</span>
             </div>
           );
        })}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Review Application</h2>

      <Section 
        title="Student Details" 
        step="/enroll/step-1" 
        data={{ Name: formData.fullName, Email: formData.email, Mobile: formData.mobile, Class: formData.grade, Board: formData.board }} 
      />
      
      <Section 
        title="Academic Details" 
        step="/enroll/step-2" 
        data={{ Subjects: formData.subjects, Goal: formData.examGoal, 'Study Hours': formData.studyHours, Scholarship: formData.isScholarship ? 'Yes' : 'No' }} 
      />
      
      <Section 
        title="Address & Guardian" 
        step="/enroll/step-3" 
        data={{ Address: `${formData.address}, ${formData.city} - ${formData.pinCode}`, Guardian: formData.guardianName, 'Guardian Mobile': formData.guardianMobile, Plan: formData.paymentPlan }} 
      />

      <div className="flex justify-between pt-4 border-t mt-8">
        <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Back</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="w-40 bg-slate-900 text-white hover:bg-slate-800">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit Application"}
        </Button>
      </div>
    </div>
  );
}