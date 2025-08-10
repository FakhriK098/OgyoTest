import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import { call } from 'redux-saga/effects';
import { profileSaga } from '../profileSaga';
import instance from 'src/services/api';
import {
  fetchProfileRequest,
  fetchProfileSuccess,
  fetchProfileFailure,
} from '../../slices/profileSagaSlice';
import { IProfile } from 'src/types/profile';

describe('profileSaga', () => {
  const mockProfile: IProfile = {
    login: 'FakhriK098',
    id: 1,
    node_id: 'test-node',
    avatar_url: 'https://example.com/avatar.jpg',
    gravatar_id: '',
    url: 'https://api.github.com/users/FakhriK098',
    html_url: 'https://github.com/FakhriK098',
    followers_url: 'https://api.github.com/users/FakhriK098/followers',
    following_url: 'https://api.github.com/users/FakhriK098/following{/other_user}',
    gists_url: 'https://api.github.com/users/FakhriK098/gists{/gist_id}',
    starred_url: 'https://api.github.com/users/FakhriK098/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/FakhriK098/subscriptions',
    organizations_url: 'https://api.github.com/users/FakhriK098/orgs',
    repos_url: 'https://api.github.com/users/FakhriK098/repos',
    events_url: 'https://api.github.com/users/FakhriK098/events{/privacy}',
    received_events_url: 'https://api.github.com/users/FakhriK098/received_events',
    type: 'User',
    user_view_type: 'public',
    site_admin: false,
    name: 'Fakhri Khairi',
    company: null,
    blog: '',
    location: null,
    email: null,
    hireable: null,
    bio: null,
    twitter_username: null,
    public_repos: 10,
    public_gists: 0,
    followers: 100,
    following: 50,
    created_at: '2020-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  };

  describe('fetchProfileSaga', () => {
    it('should fetch profile successfully', () => {
      const mockResponse = {
        data: mockProfile,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      return expectSaga(profileSaga)
        .provide([
          [matchers.call.fn(instance.get), mockResponse],
        ])
        .put(fetchProfileSuccess(mockProfile))
        .dispatch(fetchProfileRequest())
        .run();
    });

    it('should handle API call failure', () => {
      const error = new Error('Network error');

      return expectSaga(profileSaga)
        .provide([
          [matchers.call.fn(instance.get), throwError(error)],
        ])
        .put(fetchProfileFailure('Network error'))
        .dispatch(fetchProfileRequest())
        .run();
    });

    it('should call the correct API endpoint', () => {
      const mockResponse = {
        data: mockProfile,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      return expectSaga(profileSaga)
        .provide([
          [call(instance.get, '/users/FakhriK098'), mockResponse],
        ])
        .call(instance.get, '/users/FakhriK098')
        .dispatch(fetchProfileRequest())
        .run();
    });

    it('should handle error without message', () => {
      const error = {};

      return expectSaga(profileSaga)
        .provide([
          [matchers.call.fn(instance.get), throwError(error)],
        ])
        .put(fetchProfileFailure(undefined))
        .dispatch(fetchProfileRequest())
        .run();
    });

    it('should handle multiple fetchProfileRequest actions', () => {
      const mockResponse = {
        data: mockProfile,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      return expectSaga(profileSaga)
        .provide([
          [matchers.call.fn(instance.get), mockResponse],
        ])
        .put(fetchProfileSuccess(mockProfile))
        .dispatch(fetchProfileRequest())
        .put(fetchProfileSuccess(mockProfile))
        .dispatch(fetchProfileRequest())
        .run();
    });
  });

  describe('profileSaga root', () => {
    it('should listen to fetchProfileRequest action', () => {
      const mockResponse = {
        data: mockProfile,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      return expectSaga(profileSaga)
        .provide([
          [matchers.call.fn(instance.get), mockResponse],
        ])
        .take(fetchProfileRequest.type)
        .dispatch(fetchProfileRequest())
        .silentRun();
    });

    it('should not respond to other actions', () => {
      return expectSaga(profileSaga)
        .dispatch({ type: 'UNKNOWN_ACTION' })
        .not.put.actionType(fetchProfileSuccess.type)
        .not.put.actionType(fetchProfileFailure.type)
        .silentRun(100);
    });
  });
});