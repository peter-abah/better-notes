import { Outlet, Navigate } from "react-router-dom";

interface Props {
  redirectPath?: string;
  isAuthorized: boolean;
}
function PrivateRoute({ isAuthorized, redirectPath = "/sign_in" }: Props) {
  if (!isAuthorized) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;
