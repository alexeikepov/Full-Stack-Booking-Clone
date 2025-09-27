import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ToastContainer, useToast } from "@/components/ui/toast";
import { Search, UserPlus, Users, Mail, UserCheck, UserX } from "lucide-react";
import {
  sendFriendRequest,
  getFriendRequests,
  getFriends,
  searchUsers,
  type Friend,
  type FriendRequest,
  type SendFriendRequestData,
  type User,
} from "@/lib/api";

interface FindFriendsProps {
  onStatsUpdate?: () => void;
}

export default function FindFriends({ onStatsUpdate }: FindFriendsProps) {
  const { toasts, removeToast, success, error } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    loadFriendsAndRequests();
  }, []);

  const loadFriendsAndRequests = async () => {
    try {
      const [friendsList, requests] = await Promise.all([
        getFriends(),
        getFriendRequests("all"),
      ]);
      setFriends(friendsList);
      setFriendRequests(requests);
    } catch (error) {
      error("Failed to load friend data", "Please try refreshing the page");
    }
  };

  const searchUsersHandler = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      console.log("Searching for:", query);
      const users = await searchUsers(query);
      console.log("Search results:", users);
      setSearchResults(users);
    } catch (error) {
      console.error("Search error:", error);
      error(
        "Failed to search users",
        (error as any)?.message || "Please try again"
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchUsersHandler(searchQuery);
  };

  // Add real-time search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchUsersHandler(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500); // Search after 500ms of no typing

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const getFriendStatus = (userId: string) => {
    // Check if already friends
    const isFriend = friends.some((friend) => friend._id === userId);
    if (isFriend) return "friend";

    // Check if there's a pending request
    const pendingRequest = friendRequests.find(
      (req) =>
        (req.sender._id === userId || req.receiver._id === userId) &&
        req.status === "pending"
    );

    if (pendingRequest) {
      return pendingRequest.sender._id === userId ? "received" : "sent";
    }

    return "none";
  };

  const handleSendFriendRequest = async (userId: string) => {
    try {
      setLoading(true);
      await sendFriendRequest({ receiverId: userId });
      await loadFriendsAndRequests();
      onStatsUpdate?.();
      success(
        "Friend request sent!",
        "Your request has been sent successfully"
      );
    } catch (error: any) {
      error(
        "Failed to send friend request",
        error.response?.data?.error || "Please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  const getActionButton = (user: User) => {
    const status = getFriendStatus(user._id);

    switch (status) {
      case "friend":
        return (
          <Badge variant="default" className="bg-green-500">
            <UserCheck className="h-3 w-3 mr-1" />
            Friends
          </Badge>
        );
      case "sent":
        return (
          <Badge variant="secondary">
            <UserPlus className="h-3 w-3 mr-1" />
            Request Sent
          </Badge>
        );
      case "received":
        return (
          <Badge variant="outline">
            <UserX className="h-3 w-3 mr-1" />
            Request Received
          </Badge>
        );
      default:
        return (
          <Button
            size="sm"
            onClick={() => handleSendFriendRequest(user._id)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Add Friend
          </Button>
        );
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Find Friends</h1>
          <p className="text-gray-600 mt-2">
            Search for users and send friend requests
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={searchLoading}>
                {searchLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Search Results ({searchResults.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </p>
                        {user.role && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {user.role}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getActionButton(user)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {searchQuery && searchResults.length === 0 && !searchLoading && (
          <Card>
            <CardContent className="text-center py-8">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">
                No users found matching "{searchQuery}"
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Try searching with a different name or email
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
}
