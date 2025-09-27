import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Share2 } from "lucide-react";
import type { Friend } from "@/lib/api";

interface FriendCardProps {
  friend: Friend;
  onShareHotel: (friend: Friend) => void;
}

export default function FriendCard({ friend, onShareHotel }: FriendCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarFallback>
              {friend.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{friend.name}</p>
            <p className="text-sm text-gray-600">{friend.email}</p>
          </div>
        </div>
        <Button onClick={() => onShareHotel(friend)} className="w-full">
          <Share2 className="h-4 w-4 mr-2" />
          Share Hotel
        </Button>
      </CardContent>
    </Card>
  );
}
