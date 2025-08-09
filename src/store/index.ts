import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from './sagaSetup';
import repositoryReducer from './slices/repositorySagaSlice';
import userReducer from './slices/userSagaSlice';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    repository: repositoryReducer,
    user: userReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'repository/fetchRepositoriesRequest',
          'repository/fetchSearchRepositoriesRequest',
        ],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
