import { ChatRole } from "@/types";

export const chatRoles = ["admin", "moderator", "user"] as const;

type RestrictedAction =
  | "addMembers"
  | "kickMembers"
  | "removeMembers"
  | "changeRole"
  | "chatDropdownMenu"
  | "chatSettings"
  | "chatActions";

type ChatRoleMap = {
  [key in RestrictedAction]: ChatRole[];
};

export const allowedRoles = {
  addMembers: ["admin", "moderator"],
  kickMembers: ["admin", "moderator"],
  removeMembers: ["admin", "moderator"],
  changeRole: ["admin"],
  chatDropdownMenu: ["admin", "moderator"],
  chatSettings: ["admin", "moderator"],
  chatActions: ["admin"],
} as ChatRoleMap;
