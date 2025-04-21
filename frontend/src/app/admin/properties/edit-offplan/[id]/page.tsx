'use client';

import { use } from 'react';
import OffplanPropertyForm from '@/components/admin/OffplanPropertyForm';

export default function EditOffplanPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const propertyId = resolvedParams.id;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Offplan Property</h1>
      </div>
      
      <OffplanPropertyForm propertyId={propertyId} isEdit={true} />
    </div>
  );
}
