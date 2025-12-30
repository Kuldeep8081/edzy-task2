'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { addressSchema, AddressData } from '@/lib/schemas';
import { useEnrollmentStore } from '@/store/useEnrollmentStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect } from 'react';

// Bonus: Mock PIN Code Lookup
const MOCK_PIN_DATA: Record<string, { city: string; state: string }> = {
  '110001': { city: 'New Delhi', state: 'Delhi' },
  '400001': { city: 'Mumbai', state: 'Maharashtra' },
  '560001': { city: 'Bangalore', state: 'Karnataka' },
};

export default function Step3() {
  const router = useRouter();
  const { formData, updateData } = useEnrollmentStore();

  // Guard Route: Redirect if Step 2 data is missing
  useEffect(() => {
    if (!formData.examGoal) router.replace('/enroll/step-2');
  }, [formData.examGoal, router]);

  const form = useForm<AddressData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      pinCode: formData.pinCode || '',
      state: formData.state || '',
      city: formData.city || '',
      address: formData.address || '',
      guardianName: formData.guardianName || '',
      guardianMobile: formData.guardianMobile || '',
      // Explicitly set undefined if missing so placeholders work
      paymentPlan: (formData.paymentPlan as any) || undefined,
      paymentMode: (formData.paymentMode as any) || undefined,
    },
  });

  // Watch PIN for auto-fill
  const pinCode = form.watch('pinCode');
  useEffect(() => {
    if (pinCode?.length === 6 && MOCK_PIN_DATA[pinCode]) {
      const { city, state } = MOCK_PIN_DATA[pinCode];
      form.setValue('city', city);
      form.setValue('state', state);
    }
  }, [pinCode, form]);

  function onSubmit(data: AddressData) {
    updateData(data);
    router.push('/enroll/review');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-xl font-semibold">Step 3: Address & Guardian</h2>

        <Card>
          <CardHeader><CardTitle className="text-base">Address Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="pinCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PIN Code<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="110001" 
                        maxLength={6} 
                        {...field} 
                        value={field.value ?? ''} // FIX: Controlled input
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField name="city" control={form.control} render={({ field }) => (
                 <FormItem>
                   <FormLabel>City<span className="text-red-500">*</span></FormLabel>
                   <FormControl>
                     <Input {...field} value={field.value ?? ''} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
              )} />
              <FormField name="state" control={form.control} render={({ field }) => (
                 <FormItem>
                   <FormLabel>State<span className="text-red-500">*</span></FormLabel>
                   <FormControl>
                     <Input {...field} value={field.value ?? ''} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
              )} />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Address<span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Guardian & Payment</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="guardianName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guardian Name<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guardianMobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guardian Mobile<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input maxLength={10} {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="paymentPlan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Plan<span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    {/* FIX: Use value instead of defaultValue */}
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                      {['Quarterly', 'Half-Yearly', 'Annual'].map(p => (
                        <div key={p} className="flex items-center space-x-2">
                          <RadioGroupItem value={p} id={p} />
                          <label htmlFor={p} className="text-sm font-medium">{p}</label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="paymentMode"
              render={({ field }) => (
                 <FormItem>
                   <FormLabel>Payment Mode<span className="text-red-500">*</span></FormLabel>
                   {/* FIX: Use value instead of defaultValue */}
                   <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['UPI', 'Card', 'NetBanking'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                   </Select>
                   <FormMessage />
                 </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Back</Button>
          <Button type="submit">Review & Submit</Button>
        </div>
      </form>
    </Form>
  );
}