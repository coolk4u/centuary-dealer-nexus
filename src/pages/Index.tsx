
import { Navigate } from "react-router-dom";

const Index = () => {
  // For now, redirect to login. In a real app, check authentication state
  return <Navigate to="/login" replace />;
};

export default Index;
