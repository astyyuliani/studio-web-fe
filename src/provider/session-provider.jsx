import { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { useAuth } from "@/hooks/useAuth";

const AuthContext = createContext();

export const useSession = () => useContext(AuthContext);

export const SessionProvider = ({ children }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

SessionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
