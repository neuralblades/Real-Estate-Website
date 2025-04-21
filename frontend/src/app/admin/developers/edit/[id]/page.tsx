'use client';

import { use } from 'react';
import DeveloperForm from '@/components/admin/DeveloperForm';

export default function EditDeveloperPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const developerId = resolvedParams.id;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Developer</h1>
      </div>

      <DeveloperForm developerId={developerId} isEdit={true} />
    </div>
  );
}
