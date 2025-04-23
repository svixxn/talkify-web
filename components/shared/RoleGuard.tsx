import { ChatRole } from "@/types";
import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  allowedRoles: ChatRole[];
  userRole: ChatRole;
}>;
const RoleGuard = ({ children, allowedRoles, userRole }: Props) => {
  if (allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }

  return null;
};

export default RoleGuard;
