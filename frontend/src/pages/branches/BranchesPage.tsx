import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@components/ui/Button';

export const BranchesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Branches</h1>
          <p className="mt-1 text-muted-foreground">Manage your store branches</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />}>Add Branch</Button>
      </div>
      <div className="rounded-lg border bg-card p-12 text-center">
        <p className="text-muted-foreground">Branches page - Coming soon</p>
      </div>
    </div>
  );
};
