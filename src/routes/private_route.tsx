import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/auth_context";

interface Props {
  redirectPath?: string;
  isAuthorized?: boolean;
}
function PrivateRoute({ redirectPath = "/sign_in", isAuthorized }: Props) {
  const { user } = useAuth();

  // eslint-disable-next-line no-param-reassign
  isAuthorized = isAuthorized == null ? !!user : isAuthorized;

  if (!isAuthorized) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;
