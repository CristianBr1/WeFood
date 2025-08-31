import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const allStates = {};

  return (
    <AuthContext.Provider value={allStates}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
