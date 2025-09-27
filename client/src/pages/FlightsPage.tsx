import { Link } from "react-router-dom";
import { ArrowLeft, Plane, Calendar } from "lucide-react";

export default function FlightsPage() {
  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 overflow-hidden">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
            <Plane className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Flights Coming Soon
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Flight bookings will be available on December 24th
          </p>
          <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold text-gray-900">
                December 24, 2024
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Flight search and booking functionality will be launched
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800 font-medium mb-2">
              Currently unavailable by order
            </p>
            <p className="text-sm text-amber-700" dir="rtl">
              הטיסות סגורות בפקודה של עדן
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="text-sm text-gray-500">
            <p>Stay tuned for the launch!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
