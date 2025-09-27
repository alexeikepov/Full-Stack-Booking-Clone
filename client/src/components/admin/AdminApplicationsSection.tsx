import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ApplicationCard } from "./ApplicationCard";
import type { Application } from "@/types/owner";

interface AdminApplicationsSectionProps {
  applications: Application[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function AdminApplicationsSection({
  applications,
  searchTerm,
  onSearchChange,
  onApprove,
  onReject,
}: AdminApplicationsSectionProps) {
  const filteredApplications = applications.filter(
    (app) =>
      app.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hotel Admin Applications</CardTitle>
          <CardDescription>
            Review and approve applications from users requesting hotel admin
            role
          </CardDescription>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
