'use client';

import OffplanPropertyForm from '@/components/admin/OffplanPropertyForm';

export default function AddOffplanPropertyPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Add Offplan Property</h1>
      </div>
      
      <OffplanPropertyForm />
    </div>
  );
}
