'use client';

import DeveloperForm from '@/components/admin/DeveloperForm';

export default function NewDeveloperPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Add New Developer</h1>
      </div>
      
      <DeveloperForm />
    </div>
  );
}
