import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, User, LogOut } from "lucide-react";

export default function AdminHotelHeader() {
  const handleSignOut = () => {
    // Здесь будет логика выхода из системы
    localStorage.removeItem("admin_hotel_token");
    window.location.href = "/admin-hotel/sign-in";
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/admin-hotel" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Hotel</h1>
              <p className="text-xs text-gray-500">Hotel Management Panel</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/admin-hotel"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              My Hotels
            </Link>
            <Link
              to="/admin-hotel"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Analytics
            </Link>
            <Link
              to="/admin-hotel"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Add Hotel
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>Hotel Admin</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center space-x-1"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
