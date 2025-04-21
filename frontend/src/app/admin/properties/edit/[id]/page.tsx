'use client';

import { use } from 'react';
import PropertyForm from '@/components/admin/PropertyForm';

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const propertyId = resolvedParams.id;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Property</h1>
      </div>

      <PropertyForm propertyId={propertyId} isEdit={true} />
    </div>
  );
}
