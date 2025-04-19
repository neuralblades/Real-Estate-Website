'use client';

import { useParams } from 'next/navigation';
import PropertyForm from '@/components/admin/PropertyForm';

export default function EditPropertyPage() {
  const params = useParams();
  const propertyId = params.id as string;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Property</h1>
      </div>
      
      <PropertyForm propertyId={propertyId} isEdit={true} />
    </div>
  );
}
