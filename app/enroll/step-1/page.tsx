'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { studentSchema, StudentData } from '@/lib/schemas';
import { useEnrollmentStore } from '@/store/useEnrollmentStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export default function Step1() {
  const router = useRouter();
  const { formData, updateData } = useEnrollmentStore();

  const form = useForm<StudentData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: formData.fullName || '',
      email: formData.email || '',
      mobile: formData.mobile || '',
      // Use undefined fallback for Select components so the placeholder shows if empty
      grade: (formData.grade as any) || undefined,
      board: (formData.board as any) || undefined,
      language: (formData.language as any) || undefined,
    },
  });

  function onSubmit(data: StudentData) {
    updateData(data);
    router.push('/enroll/step-2');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-xl font-semibold">Step 1: Student Details</h2>
        
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name<span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input 
                  placeholder="Kuldeep" 
                  {...field} 
                  value={field.value ?? ''} // FIX: Prevent uncontrolled input error
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email<span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    placeholder="kk@example.com" 
                    {...field} 
                    value={field.value ?? ''} // FIX: Prevent uncontrolled input error
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number<span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      +91
                    </span>
                    <Input 
                      className="rounded-l-none" 
                      placeholder="808......." 
                      {...field} 
                      value={field.value ?? ''} // FIX: Prevent uncontrolled input error
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class<span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['9', '10', '11', '12'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="board"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Board<span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['CBSE', 'ICSE', 'State Board'].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language<span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['English', 'Hindi', 'Hinglish'].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit">Next Step</Button>
        </div>
      </form>
    </Form>
  );
}