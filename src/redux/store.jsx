
import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice';

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
  
  devTools: process.env.NODE_ENV !== 'production', 
});

export default store;
