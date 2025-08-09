import { all, fork } from 'redux-saga/effects';
import { repositorySaga } from './repositorySaga';

export default function* rootSaga() {
  yield all([
    fork(repositorySaga),
  ]);
}