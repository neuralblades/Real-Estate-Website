'use client';

import PropertyForm from '@/components/admin/PropertyForm';

export default function AddPropertyPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Add New Property</h1>
      </div>
      
      <PropertyForm />
    </div>
  );
}
