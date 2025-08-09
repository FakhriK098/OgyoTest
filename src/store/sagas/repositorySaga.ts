import { call, put, takeLatest, select, all } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import instance from '../../services/api';
import { AxiosResponse } from 'axios';
import {
  IFetchRepositoriesPayload,
  IRepository,
  ISearchRepositoriesPayload,
} from '../../types/repository';
import {
  fetchRepositoriesRequest,
  fetchRepositoriesSuccess,
  fetchRepositoriesFailure,
  fetchSearchRepositoriesRequest,
  fetchSearchRepositoriesSuccess,
  fetchSearchRepositoriesFailure,
  fetchMoreRepositoriesRequest,
  fetchMoreRepositoriesSuccess,
  fetchMoreRepositoriesFailure,
} from '../slices/repositorySagaSlice';
import { RootState } from '../index';
import { extractSinceFromUrl, parseLinkHeader } from '../../utils/strings';

function* fetchRepositoriesSaga(
  action: PayloadAction<IFetchRepositoriesPayload>,
) {
  try {
    const { since = 0 } = action.payload;
    const response: AxiosResponse<IRepository[]> = yield call(
      instance.get,
      `/repositories?since=${since}`,
    );

    const linkHeader = response.headers.link;
    const parsedLinks = parseLinkHeader(linkHeader);
    const nextSince = extractSinceFromUrl(parsedLinks.next);

    yield put(
      fetchRepositoriesSuccess({
        repositories: response.data,
        nextSince,
        hasMore: !!parsedLinks.next,
      }),
    );
  } catch (error: any) {
    yield put(
      fetchRepositoriesFailure(error.message || 'Failed to fetch repositories'),
    );
  }
}

function* fetchMoreRepositoriesSaga(
  _action: PayloadAction<IFetchRepositoriesPayload>,
) {
  try {
    const state: RootState = yield select();
    const { nextSince } = state.repository;

    if (!nextSince) {
      yield put(fetchMoreRepositoriesFailure('No more repositories to load'));
      return;
    }

    const response: AxiosResponse<IRepository[]> = yield call(
      instance.get,
      `/repositories?since=${nextSince}`,
    );

    const linkHeader = response.headers.link;
    const parsedLinks = parseLinkHeader(linkHeader);
    const newNextSince = extractSinceFromUrl(parsedLinks.next);

    yield put(
      fetchMoreRepositoriesSuccess({
        repositories: response.data,
        nextSince: newNextSince,
        hasMore: !!parsedLinks.next,
      }),
    );
  } catch (error: any) {
    yield put(
      fetchMoreRepositoriesFailure(
        error.message || 'Failed to fetch more repositories',
      ),
    );
  }
}

function* searchRepositoriesSaga(
  action: PayloadAction<ISearchRepositoriesPayload>,
) {
  try {
    const { query } = action.payload;
    const response: AxiosResponse<{ items: IRepository[] }> = yield call(
      instance.get,
      `/search/repositories?q=${encodeURIComponent(query)}`,
    );

    yield put(
      fetchSearchRepositoriesSuccess({
        repositories: response.data.items,
      }),
    );
  } catch (error: any) {
    yield put(
      fetchSearchRepositoriesFailure(
        error.message || 'Failed to search repositories',
      ),
    );
  }
}

export function* repositorySaga() {
  yield all([
    takeLatest(fetchRepositoriesRequest.type, fetchRepositoriesSaga),
    takeLatest(fetchMoreRepositoriesRequest.type, fetchMoreRepositoriesSaga),
    takeLatest(fetchSearchRepositoriesRequest.type, searchRepositoriesSaga),
  ]);
}
