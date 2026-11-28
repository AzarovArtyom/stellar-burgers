import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  NotFound404,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
} from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  type Location,
} from 'react-router-dom';

import { fetchIngredients } from '../../services/ingredientsSlice';
import { useDispatch, useSelector } from '../../services/store';
import { getUser, authChecked } from '../../services/userSlice';
import { getCookie } from '../../utils/cookie';
import { ProtectedRoute } from '../protected-route/protected-route';

import type { AppContentProps } from './type';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const {
    ingredients,
    isLoading: isIngredientsLoading,
    error: ingredientsError,
  } = useSelector((state) => state.ingredients);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);
  useEffect(() => {
    const token = getCookie('accessToken');

    if (token) {
      void dispatch(getUser());
    } else {
      dispatch(authChecked());
    }
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};

export default App;

/* Маршруты показываются только когда ингредиенты загружены: без них не
   отрисовать ни конструктор, ни состав заказа. */
const AppContent = ({ isLoading, error }: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = (location.state as { background?: Location } | null)
    ?.background;

  return (
    <>
      <Routes location={backgroundLocation ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/:number" element={<OrderInfo />} />
        <Route path="/ingredients/:id" element={<IngredientDetails />} />

        <Route element={<ProtectedRoute onlyUnAuth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/orders" element={<ProfileOrders />} />
          <Route path="/profile/orders/:number" element={<OrderInfo />} />
        </Route>
        <Route path="*" element={<NotFound404 />} />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal
                title="Детали ингредиента"
                onClose={() => {
                  void navigate(-1);
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/feed/:number"
            element={
              <Modal
                title="Детали заказа"
                onClose={() => {
                  void navigate(-1);
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/profile/orders/:number"
              element={
                <Modal
                  title="Детали заказа"
                  onClose={() => {
                    void navigate(-1);
                  }}
                >
                  <OrderInfo />
                </Modal>
              }
            />
          </Route>
        </Routes>
      )}
    </>
  );
};
