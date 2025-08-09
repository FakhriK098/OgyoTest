import { AxiosResponse } from 'axios';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import instance from 'src/services/api';
import { IProfile } from 'src/types/profile';
import {
  fetchProfileFailure,
  fetchProfileRequest,
  fetchProfileSuccess,
} from '../slices/profileSagaSlice';

function* fetchProfileSaga() {
  try {
    const response: AxiosResponse<IProfile> = yield call(
      instance.get,
      '/users/FakhriK098',
    );
    yield put(fetchProfileSuccess(response.data));
  } catch (error: any) {
    yield put(fetchProfileFailure(error.message));
  }
}

export function* profileSaga() {
  yield all([takeLatest(fetchProfileRequest.type, fetchProfileSaga)]);
}
