import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import instance from 'src/services/api';
import { IFetchUserPayload, IUser } from 'src/types/user';
import {
  fetchUserFailure,
  fetchUserRequest,
  fetchUserSuccess,
} from '../slices/userSagaSlice';

function* fetchUserSaga(action: PayloadAction<IFetchUserPayload>) {
  try {
    const { fullName } = action.payload;
    const response: AxiosResponse<IUser> = yield call(
      instance.get,
      `/repos/${fullName}`,
    );

    yield put(fetchUserSuccess(response.data));
  } catch (error: any) {
    yield put(fetchUserFailure(error.message || 'Failed to fetch user'));
  }
}

export function* userSaga() {
  yield all([takeLatest(fetchUserRequest.type, fetchUserSaga)]);
}
