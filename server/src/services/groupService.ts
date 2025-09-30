// src/services/groupService.ts
import GroupModel from "../models/Group";
import { UserModel } from "../models/User";
import { HotelModel } from "../models/Hotel";
import { GroupFilter, DateValidationResult } from "../types/groupTypes";

export async function createGroup(groupData: any) {
  const group = new GroupModel(groupData);
  await group.save();
  return group;
}

export async function findGroups(filter: GroupFilter) {
  return await GroupModel.find(filter)
    .populate("creator", "name email")
    .populate("members", "name email")
    .populate("hotel", "name city images rating price")
    .sort({ createdAt: -1 });
}

export async function findGroupById(groupId: string) {
  return await GroupModel.findById(groupId)
    .populate("creator", "name email")
    .populate("members", "name email")
    .populate("hotel", "name city images rating price");
}

export async function findGroupByIdWithoutPopulate(groupId: string) {
  return await GroupModel.findById(groupId);
}

export async function updateGroupMembers(groupId: string, members: string[]) {
  return await GroupModel.findByIdAndUpdate(
    groupId,
    { members },
    { new: true }
  );
}

export async function updateGroupStatus(groupId: string, status: string) {
  return await GroupModel.findByIdAndUpdate(groupId, { status }, { new: true });
}

export async function deleteGroupById(groupId: string) {
  return await GroupModel.findByIdAndDelete(groupId);
}

export async function findHotelById(hotelId: string) {
  return await HotelModel.findById(hotelId);
}

export async function findUserById(userId: string) {
  return await UserModel.findById(userId);
}

export async function findUserWithFriends(userId: string) {
  return await UserModel.findById(userId).populate("friends", "name email");
}

export function validateDates(
  checkIn: string,
  checkOut: string
): DateValidationResult {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkInDate >= checkOutDate) {
    return {
      isValid: false,
      error: "Check-in must be before check-out",
    };
  }

  if (checkInDate < new Date()) {
    return {
      isValid: false,
      error: "Check-in cannot be in the past",
    };
  }

  return { isValid: true };
}

export function validateGroupMembers(
  creatorFriends: string[],
  memberIds: string[]
): string[] {
  const validMembers = [];
  for (const memberId of memberIds) {
    if (creatorFriends?.includes(memberId)) {
      validMembers.push(memberId);
    }
  }
  return validMembers;
}

export function isUserGroupMember(
  groupMembers: any[],
  userId: string
): boolean {
  return groupMembers.some((member) => member._id.toString() === userId);
}

export function isUserGroupCreator(groupCreator: any, userId: string): boolean {
  return groupCreator.toString() === userId;
}

export function canAddMember(
  groupCreator: any,
  groupMembers: any[],
  userId: string
): boolean {
  return (
    groupCreator.toString() === userId ||
    groupMembers.some((member) => member.toString() === userId)
  );
}

export function canRemoveMember(
  groupCreator: any,
  memberId: string,
  userId: string
): boolean {
  return groupCreator.toString() === userId || memberId === userId;
}

export function isMemberAlreadyInGroup(
  groupMembers: any[],
  memberId: string
): boolean {
  return groupMembers.some((member) => member.toString() === memberId);
}

export function removeMemberFromGroup(
  groupMembers: any[],
  memberId: string
): any[] {
  return groupMembers.filter((id) => id.toString() !== memberId);
}

export function isValidGroupStatus(status: string): boolean {
  return ["planning", "booked", "completed", "cancelled"].includes(status);
}
