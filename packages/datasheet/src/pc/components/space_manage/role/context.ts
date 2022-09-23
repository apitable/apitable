import React from 'react';

export interface IRoleContext {
  manageable?: boolean;
  activeRoleName?: string;
  setActiveRoleName?: (roleName: string) => void;
  refreshMemberList?: (roleId: string) => void;
}

export const RoleContext = React.createContext<IRoleContext>({});
