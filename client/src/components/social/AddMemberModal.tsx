import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Group, Friend } from "@/lib/api";

interface AddMemberModalProps {
  isOpen: boolean;
  group: Group | null;
  friends: Friend[];
  onClose: () => void;
  onAddMember: (groupId: string, memberId: string) => void;
}

export default function AddMemberModal({
  isOpen,
  group,
  friends,
  onClose,
  onAddMember,
}: AddMemberModalProps) {
  if (!isOpen || !group) return null;

  const availableFriends = friends.filter(
    (friend) => !group.members.some((member) => member._id === friend._id)
  );

  const handleFriendSelect = (friendId: string) => {
    if (friendId) {
      onAddMember(group._id, friendId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Add Member to {group.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Friend
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              onChange={(e) => handleFriendSelect(e.target.value)}
            >
              <option value="">Choose a friend...</option>
              {availableFriends.map((friend) => (
                <option key={friend._id} value={friend._id}>
                  {friend.name}
                </option>
              ))}
            </select>
          </div>

          <Button variant="outline" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
