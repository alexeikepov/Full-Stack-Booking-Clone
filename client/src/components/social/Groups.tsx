import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users, Clock, CheckCircle } from "lucide-react";
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
  type CreateGroupData,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import GroupCard from "./GroupCard";
import GroupTabs from "./GroupTabs";
import CreateGroupModal from "./CreateGroupModal";
import AddMemberModal from "./AddMemberModal";
import EmptyStateCard from "./EmptyStateCard";
import SimpleGroupCard from "./SimpleGroupCard";

export default function Groups() {
  const { user: currentUser } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("my-groups");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (): Promise<void> => {
    setLoading(true);
    try {
      const [groupsList, friendsList] = await Promise.all([
        getMyGroups("all"),
        getFriends(),
      ]);
      setGroups(groupsList);
      setFriends(friendsList);
    } catch (error) {
      alert("Failed to load groups data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (
    groupData: CreateGroupData
  ): Promise<void> => {
    try {
      await createGroup(groupData);
      setShowCreateModal(false);
      await loadData();
      alert("Group created successfully");
    } catch (error) {
      alert("Failed to create group");
    }
  };

  const handleAddMember = async (
    groupId: string,
    memberId: string
  ): Promise<void> => {
    try {
      await addMemberToGroup(groupId, memberId);
      await loadData();
      alert("Member added successfully");
    } catch (error) {
      alert("Failed to add member");
    }
  };

  const handleRemoveMember = async (
    groupId: string,
    memberId: string
  ): Promise<void> => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      await removeMemberFromGroup(groupId, memberId);
      await loadData();
      alert("Member removed successfully");
    } catch (error) {
      alert("Failed to remove member");
    }
  };

  const handleUpdateStatus = async (
    groupId: string,
    status: string
  ): Promise<void> => {
    try {
      await updateGroupStatus(groupId, status);
      await loadData();
      alert(`Group status updated to ${status}`);
    } catch (error) {
      alert("Failed to update group status");
    }
  };

  const handleDeleteGroup = async (groupId: string): Promise<void> => {
    if (!confirm("Are you sure you want to delete this group?")) return;

    try {
      await deleteGroup(groupId);
      await loadData();
      alert("Group deleted successfully");
    } catch (error) {
      alert("Failed to delete group");
    }
  };

  const handleAddMemberClick = (groupId: string): void => {
    const group = groups.find((g) => g._id === groupId);
    if (group) {
      setSelectedGroup(group);
      setShowAddMemberModal(true);
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

  const planningGroups = groups.filter((g) => g.status === "planning");
  const bookedGroups = groups.filter((g) => g.status === "booked");

  return (
    <div className="space-y-6">
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

      <GroupTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        groupsCount={groups.length}
      />

      {activeTab === "my-groups" && (
        <div className="space-y-4">
          {groups.length === 0 ? (
            <EmptyStateCard
              icon={Users}
              title="No groups yet"
              description="Create your first group to start planning trips with friends."
            />
          ) : (
            groups.map((group) => (
              <GroupCard
                key={group._id}
                group={group}
                currentUserId={currentUser?.id}
                onAddMember={handleAddMemberClick}
                onRemoveMember={handleRemoveMember}
                onDeleteGroup={handleDeleteGroup}
              />
            ))
          )}
        </div>
      )}

      {activeTab === "planning" && (
        <div className="space-y-4">
          {planningGroups.length === 0 ? (
            <EmptyStateCard
              icon={Clock}
              title="No planning groups"
              description="No groups are currently in planning phase."
            />
          ) : (
            planningGroups.map((group) => (
              <SimpleGroupCard
                key={group._id}
                group={group}
                currentUserId={currentUser?.id}
                onUpdateStatus={handleUpdateStatus}
              />
            ))
          )}
        </div>
      )}

      {activeTab === "booked" && (
        <div className="space-y-4">
          {bookedGroups.length === 0 ? (
            <EmptyStateCard
              icon={CheckCircle}
              title="No booked groups"
              description="No groups have been booked yet."
            />
          ) : (
            bookedGroups.map((group) => (
              <SimpleGroupCard
                key={group._id}
                group={group}
                currentUserId={currentUser?.id}
                onUpdateStatus={handleUpdateStatus}
              />
            ))
          )}
        </div>
      )}

      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateGroup={handleCreateGroup}
      />

      <AddMemberModal
        isOpen={showAddMemberModal}
        group={selectedGroup}
        friends={friends}
        onClose={() => {
          setShowAddMemberModal(false);
          setSelectedGroup(null);
        }}
        onAddMember={handleAddMember}
      />
    </div>
  );
}
