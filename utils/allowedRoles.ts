import { ChatRole } from "@/types";

export const chatRoles = ["admin", "moderator", "user"] as const;

type RestrictedAction =
  | "addMembers"
  | "kickMembers"
  | "removeMembers"
  | "changeRole";

type ChatRoleMap = {
  [key in RestrictedAction]: ChatRole[];
};

export const allowedRoles = {
  addMembers: ["admin", "moderator"],
  kickMembers: ["admin", "moderator"],
  removeMembers: ["admin", "moderator"],
  changeRole: ["admin"],
} as ChatRoleMap;
