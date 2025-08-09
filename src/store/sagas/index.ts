import { all, fork } from 'redux-saga/effects';
import { repositorySaga } from './repositorySaga';
import { userSaga } from './userSaga';

export default function* rootSaga() {
  yield all([fork(repositorySaga), fork(userSaga)]);
}
