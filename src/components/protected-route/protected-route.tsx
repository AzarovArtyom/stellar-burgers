import { Preloader } from '@ui';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';

import type { Location } from 'react-router-dom';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
}: TProtectedRouteProps): React.JSX.Element => {
  const { user, isAuthChecked, isLoading } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthChecked || isLoading) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = (location.state as { from?: Location } | null)?.from;

    return <Navigate to={from ?? '/'} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
