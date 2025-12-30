'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { createAcademicSchema, AcademicData } from '@/lib/schemas';
import { useEnrollmentStore } from '@/store/useEnrollmentStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useEffect, useMemo } from 'react';

const SUBJECTS_BY_GRADE: Record<string, string[]> = {
  '9': ['English', 'Maths', 'Science', 'Social Science', 'Hindi'],
  '10': ['English', 'Maths', 'Science', 'Social Science', 'Hindi'],
  '11': ['Physics', 'Chemistry', 'Maths', 'Biology', 'Computer Science', 'English'],
  '12': ['Physics', 'Chemistry', 'Maths', 'Biology', 'Accountancy', 'Economics'],
};

export default function Step2() {
  const router = useRouter();
  const { formData, updateData } = useEnrollmentStore();
  
  useEffect(() => {
    if (!formData.grade) router.replace('/enroll/step-1');
  }, [formData.grade, router]);

  // Create the schema memoized with the current grade
  const schema = useMemo(() => createAcademicSchema(formData.grade), [formData.grade]);

  // FIX: Remove <AcademicData> generic. Let RHF infer types from the resolver.
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      subjects: formData.subjects || [],
      examGoal: (formData.examGoal as any) || undefined,
      studyHours: formData.studyHours || 0,
      isScholarship: formData.isScholarship || false,
      lastExamScore: formData.lastExamScore || 0,
      achievements: formData.achievements || '',
    },
  });

  const availableSubjects = formData.grade ? SUBJECTS_BY_GRADE[formData.grade] || [] : [];
  const isScholarship = form.watch("isScholarship");

  // Calculate required subjects for UI hint
  const minSubjectsRequired = (formData.grade === '11' || formData.grade === '12') ? 3 : 2;

  function onSubmit(data: AcademicData) {
    updateData(data);
    router.push('/enroll/step-3');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-xl font-semibold">Step 2: Academic Details</h2>

        {/* Subjects Multi-Select */}
        <FormField
          control={form.control}
          name="subjects"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subjects (Select Multiple)</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {availableSubjects.map((subject) => (
                  <Badge
                    key={subject}
                    variant={field.value.includes(subject) ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1 select-none"
                    onClick={() => {
                      const current = field.value;
                      if (current.includes(subject)) {
                        field.onChange(current.filter((s: string) => s !== subject));
                      } else {
                        field.onChange([...current, subject]);
                      }
                    }}
                  >
                    {subject}
                  </Badge>
                ))}
              </div>
              <FormDescription>
                Select at least {minSubjectsRequired} subjects for Class {formData.grade}.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="examGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exam Goal</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                   <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                   <SelectContent>
                     {['Board Excellence', 'Concept Mastery', 'Competitive Prep'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                   </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="studyHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weekly Study Hours</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g. 15"
                    {...field} 
                    value={field.value ?? ''}
                    onChange={e => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Scholarship Toggle */}
        <FormField
          control={form.control}
          name="isScholarship"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Apply for Scholarship?</FormLabel>
                <FormDescription>Check this if you wish to take the entrance test.</FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Conditional Field: Last Exam Score */}
        {isScholarship && (
          <FormField
            control={form.control}
            name="lastExamScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Exam Percentage (%) <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="85" 
                    {...field} 
                    value={field.value ?? ''}
                    onChange={e => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Back</Button>
          <Button type="submit">Next Step</Button>
        </div>
      </form>
    </Form>
  );
}