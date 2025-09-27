import { Link } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";

export default function ComingSoonPage() {
  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 overflow-hidden">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
            <Construction className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h1>
          <p className="text-lg text-gray-600 mb-2">
            This feature is currently under development
          </p>
          <p className="text-gray-500">
            We're working hard to bring you something amazing. This
            functionality will be available in the near future.
          </p>
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
            <p>Stay tuned for updates!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
