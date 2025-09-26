import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Plus,
  Calendar,
  MapPin,
  Star,
  Hotel,
  UserPlus,
  UserMinus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import {
  getMyGroups,
  createGroup,
  addMemberToGroup,
  removeMemberFromGroup,
  updateGroupStatus,
  deleteGroup,
  getFriends,
  type Group,
  type Friend,
  type CreateGroupData
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import HotelSelector from "./HotelSelector";

export default function Groups() {
  const { user: currentUser } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("my-groups");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showHotelSelector, setShowHotelSelector] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [newGroup, setNewGroup] = useState<Partial<CreateGroupData>>({
    name: "",
    description: "",
    adults: 1,
    children: 0,
    rooms: 1
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [groupsList, friendsList] = await Promise.all([
        getMyGroups('all'),
        getFriends()
      ]);
      setGroups(groupsList);
      setFriends(friendsList);
    } catch (error) {
      alert("Failed to load groups data");
    } finally {
      setLoading(false);
    }
  };

  const handleHotelSelected = (hotel: any) => {
    setSelectedHotel(hotel);
    setShowHotelSelector(false);
    setNewGroup({ ...newGroup, hotelId: hotel._id });
  };

  const handleCreateGroup = async () => {
    if (!newGroup.name || !newGroup.hotelId || !newGroup.checkIn || !newGroup.checkOut) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await createGroup(newGroup as CreateGroupData);
      setShowCreateModal(false);
      setSelectedHotel(null);
      setNewGroup({
        name: "",
        description: "",
        adults: 1,
        children: 0,
        rooms: 1
      });
      await loadData();
      alert("Group created successfully");
    } catch (error) {
      alert("Failed to create group");
    }
  };

  const handleAddMember = async (groupId: string, memberId: string) => {
    try {
      await addMemberToGroup(groupId, memberId);
      await loadData();
      alert("Member added successfully");
    } catch (error) {
      alert("Failed to add member");
    }
  };

  const handleRemoveMember = async (groupId: string, memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    
    try {
      await removeMemberFromGroup(groupId, memberId);
      await loadData();
      alert("Member removed successfully");
    } catch (error) {
      alert("Failed to remove member");
    }
  };

  const handleUpdateStatus = async (groupId: string, status: string) => {
    try {
      await updateGroupStatus(groupId, status);
      await loadData();
      alert(`Group status updated to ${status}`);
    } catch (error) {
      alert("Failed to update group status");
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm("Are you sure you want to delete this group?")) return;
    
    try {
      await deleteGroup(groupId);
      await loadData();
      alert("Group deleted successfully");
    } catch (error) {
      alert("Failed to delete group");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'booked': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning': return <Clock className="h-4 w-4" />;
      case 'booked': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Group Bookings</h2>
          <p className="text-gray-600">Plan and book trips with friends</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Tabs */}
      <div className="grid w-full grid-cols-3 mb-6">
        <button
          onClick={() => setActiveTab("my-groups")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === "my-groups"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Users className="h-4 w-4" />
          My Groups ({groups.length})
        </button>
        <button
          onClick={() => setActiveTab("planning")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === "planning"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Clock className="h-4 w-4" />
          Planning
        </button>
        <button
          onClick={() => setActiveTab("booked")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === "booked"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <CheckCircle className="h-4 w-4" />
          Booked
        </button>
      </div>

      {/* Content */}
      {activeTab === "my-groups" && (
        <div className="space-y-4">
          {groups.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No groups yet</h3>
                <p className="text-gray-600">Create your first group to start planning trips with friends.</p>
              </CardContent>
            </Card>
          ) : (
            groups.map((group) => (
              <Card key={group._id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">{group.name}</h3>
                          <p className="text-sm text-gray-600">
                            Created by {group.creator.name} • {group.members.length} members
                          </p>
                        </div>
                      </div>

                      {group.description && (
                        <p className="text-gray-700 mb-3">{group.description}</p>
                      )}

                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Hotel className="h-5 w-5 text-blue-600" />
                          <h4 className="font-semibold text-lg">{group.hotel.name}</h4>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {group.hotel.city}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {group.hotel.rating}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(group.checkIn).toLocaleDateString()} - {new Date(group.checkOut).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          {group.adults} adults, {group.children} children, {group.rooms} rooms
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <Badge className={getStatusColor(group.status)}>
                          {getStatusIcon(group.status)}
                          <span className="ml-1 capitalize">{group.status}</span>
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Created {new Date(group.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Members */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Members ({group.members.length})</h4>
                        <div className="flex flex-wrap gap-2">
                          {group.members.map((member) => (
                            <div key={member._id} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {member.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{member.name}</span>
                              {group.creator._id === member._id && (
                                <Badge className="bg-blue-100 text-blue-800 text-xs">Creator</Badge>
                              )}
                              {group.creator._id === currentUser?.id && member._id !== currentUser?.id && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRemoveMember(group._id, member._id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <UserMinus className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {group.creator._id === currentUser?.id && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedGroup(group);
                              setShowAddMemberModal(true);
                            }}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Add Member
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteGroup(group._id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === "planning" && (
        <div className="space-y-4">
          {groups.filter(g => g.status === 'planning').length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No planning groups</h3>
                <p className="text-gray-600">No groups are currently in planning phase.</p>
              </CardContent>
            </Card>
          ) : (
            groups.filter(g => g.status === 'planning').map((group) => (
              <Card key={group._id}>
                <CardContent className="p-6">
                  {/* Same content as my-groups but filtered */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{group.name}</h3>
                      <p className="text-gray-600 mb-4">{group.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(group.status)}>
                          {getStatusIcon(group.status)}
                          <span className="ml-1 capitalize">{group.status}</span>
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {group.members.length} members
                        </span>
                      </div>
                    </div>
                    {group.creator._id === currentUser?.id && (
                      <Button
                        onClick={() => handleUpdateStatus(group._id, 'booked')}
                      >
                        Mark as Booked
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === "booked" && (
        <div className="space-y-4">
          {groups.filter(g => g.status === 'booked').length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No booked groups</h3>
                <p className="text-gray-600">No groups have been booked yet.</p>
              </CardContent>
            </Card>
          ) : (
            groups.filter(g => g.status === 'booked').map((group) => (
              <Card key={group._id}>
                <CardContent className="p-6">
                  {/* Same content as my-groups but filtered */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{group.name}</h3>
                      <p className="text-gray-600 mb-4">{group.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(group.status)}>
                          {getStatusIcon(group.status)}
                          <span className="ml-1 capitalize">{group.status}</span>
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {group.members.length} members
                        </span>
                      </div>
                    </div>
                    {group.creator._id === currentUser?.id && (
                      <Button
                        onClick={() => handleUpdateStatus(group._id, 'completed')}
                      >
                        Mark as Completed
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Create New Group</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name *
                </label>
                <Input
                  placeholder="Enter group name"
                  value={newGroup.name || ""}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  placeholder="Describe your trip..."
                  value={newGroup.description || ""}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adults *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={newGroup.adults || 1}
                    onChange={(e) => setNewGroup({ ...newGroup, adults: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Children
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={newGroup.children || 0}
                    onChange={(e) => setNewGroup({ ...newGroup, children: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rooms *
                </label>
                <Input
                  type="number"
                  min="1"
                  value={newGroup.rooms || 1}
                  onChange={(e) => setNewGroup({ ...newGroup, rooms: parseInt(e.target.value) })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in *
                  </label>
                  <Input
                    type="date"
                    value={newGroup.checkIn || ""}
                    onChange={(e) => setNewGroup({ ...newGroup, checkIn: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out *
                  </label>
                  <Input
                    type="date"
                    value={newGroup.checkOut || ""}
                    onChange={(e) => setNewGroup({ ...newGroup, checkOut: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel *
                </label>
                {selectedHotel ? (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Hotel className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold">{selectedHotel.name}</h4>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {selectedHotel.city}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {selectedHotel.rating || selectedHotel.averageRating || 0}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedHotel(null);
                        setNewGroup({ ...newGroup, hotelId: undefined });
                      }}
                      className="mt-2"
                    >
                      Change Hotel
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowHotelSelector(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <Hotel className="h-4 w-4 mr-2" />
                    Select Hotel
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreateGroup}
                  className="flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewGroup({
                      name: "",
                      description: "",
                      adults: 1,
                      children: 0,
                      rooms: 1
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Add Member to {selectedGroup.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Friend
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddMember(selectedGroup._id, e.target.value);
                      setShowAddMemberModal(false);
                      setSelectedGroup(null);
                    }
                  }}
                >
                  <option value="">Choose a friend...</option>
                  {friends
                    .filter(friend => !selectedGroup.members.some(member => member._id === friend._id))
                    .map((friend) => (
                      <option key={friend._id} value={friend._id}>
                        {friend.name}
                      </option>
                    ))}
                </select>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setShowAddMemberModal(false);
                  setSelectedGroup(null);
                }}
                className="w-full"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hotel Selector */}
      {showHotelSelector && (
        <HotelSelector
          onSelectHotel={handleHotelSelected}
          onClose={() => setShowHotelSelector(false)}
        />
      )}
    </div>
  );
}
