import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import type { Application } from "@/types/owner";

interface ApplicationCardProps {
  application: Application;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ApplicationCard({
  application,
  onApprove,
  onReject,
}: ApplicationCardProps) {
  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{application.ownerName}</h3>
            <div className="space-y-1 text-sm text-gray-500">
              <p>
                <strong>Email:</strong> {application.email}
              </p>
              <p>
                <strong>Phone:</strong> {application.phone}
              </p>
              <p>
                <strong>Submitted:</strong> {application.submittedAt}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <StatusBadge status={application.status} />
            {application.status === "pending" && (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => onApprove(application.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onReject(application.id)}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
