'use client';

import { usePathname } from 'next/navigation';
import { Progress } from '@/components/ui/progress';

const STEPS = [
  { path: '/enroll/step-1', label: 'Student' },
  { path: '/enroll/step-2', label: 'Academic' },
  { path: '/enroll/step-3', label: 'Address' },
  { path: '/enroll/review', label: 'Review' },
];

export default function EnrollLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Calculate progress percentage
  const currentStepIndex = STEPS.findIndex(step => pathname.includes(step.path));
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Student Enrollment
          </h1>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider">
            <span>Start</span>
            <span>Review</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
}