import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../services/userSlice';

import type { TRegisterData } from '../../utils/burger-api';

export const Profile = (): React.JSX.Element => {
  /** TODO: Взять переменную из стора */
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  });

  useEffect(() => {
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    const updatedData: Partial<TRegisterData> = {};

    if (formValue.name !== user?.name) {
      updatedData.name = formValue.name;
    }

    if (formValue.email !== user?.email) {
      updatedData.email = formValue.email;
    }

    if (formValue.password) {
      updatedData.password = formValue.password;
    }

    if (Object.keys(updatedData).length > 0) {
      void dispatch(updateUser(updatedData));
    }
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
