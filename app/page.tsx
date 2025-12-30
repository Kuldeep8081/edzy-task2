import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg border-slate-200">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto bg-slate-100 p-4 rounded-full w-20 h-20 flex items-center justify-center">
            <GraduationCap className="w-10 h-10 text-slate-900" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-slate-900">
              Welcome to Edzy
            </CardTitle>
            <CardDescription className="text-base">
              Begin your academic journey with our streamlined enrollment process.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Link href="/enroll/step-1" className="w-full">
            <Button className="w-full h-12 text-base font-medium group bg-slate-900 hover:bg-slate-800">
              Start Enrollment
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          
          <p className="text-xs text-center text-slate-500 mt-6">
            Takes approximately 2-3 minutes to complete.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}