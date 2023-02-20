import React from "react";

const UserContext = React.createContext();

export function useUserContext() {
  return React.useContext(UserContext);
}

export default UserContext;
