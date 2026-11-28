import { combineReducers } from '@reduxjs/toolkit';

import constructorReducer from './constructorSlice';
import feedReducer from './feedSlice';
import ingredientsReducer from './ingredientsSlice';
import orderDetailsReducer from './orderDetailsSlice';
import orderReducer from './orderSlice';
import profileOrdersReducer from './profileOrdersSlice';
import userReducer from './userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  user: userReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer,
  orderDetails: orderDetailsReducer,
});
