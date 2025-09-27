import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Calendar, TrendingUp, Star } from "lucide-react";

interface AnalyticsData {
  totalRevenue: number;
  totalBookings: number;
  averageOccupancy: number;
  totalReviews: number;
}

interface AnalyticsOverviewProps {
  analytics: AnalyticsData;
  formatCurrency: (amount: number) => string;
}

export function AnalyticsOverview({
  analytics,
  formatCurrency,
}: AnalyticsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">
                {formatCurrency(analytics.totalRevenue)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Bookings
              </p>
              <p className="text-2xl font-bold">{analytics.totalBookings}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Average Occupancy
              </p>
              <p className="text-2xl font-bold">
                {analytics.averageOccupancy}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reviews</p>
              <p className="text-2xl font-bold">{analytics.totalReviews}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
