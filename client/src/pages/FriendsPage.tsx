import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserPlus,
  UserCheck,
  Clock,
  MessageCircle,
  Share2,
  Hotel,
  Calendar,
  Heart,
} from "lucide-react";
import FriendRequests from "@/components/social/FriendRequests";
import FindFriends from "@/components/social/FindFriends";
import SharedHotels from "@/components/social/SharedHotels";
import Groups from "@/components/social/Groups";
import Chat from "@/components/Chat";
import { getFriends, getFriendRequests, getSharedHotels, getMyGroups } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState("requests");
  const [stats, setStats] = useState({
    friends: 0,
    sharedHotels: 0,
    unreadMessages: 0,
    groups: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [friends, sharedHotels, groups] = await Promise.all([
        getFriends(),
        getSharedHotels('all'),
        getMyGroups('all')
      ]);

      setStats({
        friends: friends.length,
        sharedHotels: sharedHotels.length,
        unreadMessages: 0, // TODO: Implement unread messages count when chat functionality is ready
        groups: groups.length
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = () => {
    loadStats();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Friends</h1>
          <p className="text-lg text-gray-600">
            Connect with other travelers and share your experiences
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "..." : stats.friends}
                  </p>
                  <p className="text-sm text-gray-600">Friends</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Hotel className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "..." : stats.sharedHotels}
                  </p>
                  <p className="text-sm text-gray-600">Shared Hotels</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "..." : stats.groups}
                  </p>
                  <p className="text-sm text-gray-600">My Groups</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? "..." : stats.unreadMessages}
                  </p>
                  <p className="text-sm text-gray-600">Unread Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <div className="grid w-full grid-cols-6 mb-6">
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === "requests"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <UserCheck className="h-4 w-4" />
              Requests
            </button>
            <button
              onClick={() => setActiveTab("find")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === "find"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <UserPlus className="h-4 w-4" />
              Find Friends
            </button>
            <button
              onClick={() => setActiveTab("shared-hotels")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === "shared-hotels"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Hotel className="h-4 w-4" />
              Shared Hotels
            </button>
            <button
              onClick={() => setActiveTab("groups")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === "groups"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Calendar className="h-4 w-4" />
              Groups
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === "chat"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              Chat
            </button>
            <button
              onClick={() => setActiveTab("social")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === "social"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Heart className="h-4 w-4" />
              Social
            </button>
          </div>

          {activeTab === "requests" && <FriendRequests onStatsUpdate={refreshStats} />}
          {activeTab === "find" && <FindFriends onStatsUpdate={refreshStats} />}
          {activeTab === "shared-hotels" && <SharedHotels />}
          {activeTab === "groups" && <Groups />}
          {activeTab === "chat" && <Chat />}
          {activeTab === "social" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Social Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    More Social Features Coming Soon
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Additional social features like trip recommendations, travel
                    memories, and friend activity feeds will be available soon.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl mb-2">🌟</div>
                      <h4 className="font-medium mb-1">Recommendations</h4>
                      <p className="text-sm text-gray-600">
                        Get personalized travel recommendations from friends
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl mb-2">📸</div>
                      <h4 className="font-medium mb-1">Travel Memories</h4>
                      <p className="text-sm text-gray-600">
                        Share and discover travel photos and stories
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-2xl mb-2">📊</div>
                      <h4 className="font-medium mb-1">Activity Feed</h4>
                      <p className="text-sm text-gray-600">
                        See what your friends are up to
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
