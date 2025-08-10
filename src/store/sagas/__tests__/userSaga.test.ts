import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import { call } from 'redux-saga/effects';
import { userSaga } from '../userSaga';
import instance from 'src/services/api';
import {
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
} from '../../slices/userSagaSlice';
import { IUser, IUserOwner, ILicense } from 'src/types/user';

describe('userSaga', () => {
  const mockLicense: ILicense = {
    key: 'mit',
    name: 'MIT License',
    spdx_id: 'MIT',
    url: 'https://api.github.com/licenses/mit',
    node_id: 'license-node',
  };

  const mockOwner: IUserOwner = {
    login: 'testuser',
    id: 1,
    node_id: 'test-node',
    avatar_url: 'https://example.com/avatar.jpg',
    gravatar_id: '',
    url: 'https://api.github.com/users/testuser',
    html_url: 'https://github.com/testuser',
    followers_url: 'https://api.github.com/users/testuser/followers',
    following_url: 'https://api.github.com/users/testuser/following{/other_user}',
    gists_url: 'https://api.github.com/users/testuser/gists{/gist_id}',
    starred_url: 'https://api.github.com/users/testuser/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/testuser/subscriptions',
    organizations_url: 'https://api.github.com/users/testuser/orgs',
    repos_url: 'https://api.github.com/users/testuser/repos',
    events_url: 'https://api.github.com/users/testuser/events{/privacy}',
    received_events_url: 'https://api.github.com/users/testuser/received_events',
    type: 'User',
    user_view_type: 'public',
    site_admin: false,
  };

  const mockUser: IUser = {
    id: 1,
    node_id: 'test-repo-node',
    name: 'test-repo',
    full_name: 'testuser/test-repo',
    private: false,
    owner: mockOwner,
    html_url: 'https://github.com/testuser/test-repo',
    description: 'A test repository for user saga testing',
    size: 1024,
    stargazers_count: 50,
    watchers_count: 25,
    language: 'TypeScript',
    forks_count: 10,
    open_issues_count: 5,
    license: mockLicense,
    topics: ['react', 'typescript', 'testing'],
    network_count: 15,
    subscribers_count: 20,
  };

  describe('fetchUserSaga', () => {
    it('should fetch user successfully', () => {
      const mockResponse = {
        data: mockUser,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const payload = { fullName: 'testuser/test-repo' };

      return expectSaga(userSaga)
        .provide([
          [matchers.call.fn(instance.get), mockResponse],
        ])
        .put(fetchUserSuccess(mockUser))
        .dispatch(fetchUserRequest(payload))
        .run();
    });

    it('should handle API call failure with error message', () => {
      const error = new Error('Network error');
      const payload = { fullName: 'testuser/test-repo' };

      return expectSaga(userSaga)
        .provide([
          [matchers.call.fn(instance.get), throwError(error)],
        ])
        .put(fetchUserFailure('Network error'))
        .dispatch(fetchUserRequest(payload))
        .run();
    });

    it('should call the correct API endpoint', () => {
      const mockResponse = {
        data: mockUser,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const payload = { fullName: 'testuser/test-repo' };

      return expectSaga(userSaga)
        .provide([
          [call(instance.get, '/repos/testuser/test-repo'), mockResponse],
        ])
        .call(instance.get, '/repos/testuser/test-repo')
        .dispatch(fetchUserRequest(payload))
        .run();
    });

    it('should handle error without message', () => {
      const error = new Error();
      const payload = { fullName: 'testuser/test-repo' };

      return expectSaga(userSaga)
        .provide([
          [matchers.call.fn(instance.get), throwError(error)],
        ])
        .put(fetchUserFailure('Failed to fetch user'))
        .dispatch(fetchUserRequest(payload))
        .run();
    });

    it('should handle different repository full names', () => {
      const mockResponse = {
        data: { ...mockUser, full_name: 'anotheruser/another-repo' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const payload = { fullName: 'anotheruser/another-repo' };

      return expectSaga(userSaga)
        .provide([
          [call(instance.get, '/repos/anotheruser/another-repo'), mockResponse],
        ])
        .call(instance.get, '/repos/anotheruser/another-repo')
        .put(fetchUserSuccess({ ...mockUser, full_name: 'anotheruser/another-repo' }))
        .dispatch(fetchUserRequest(payload))
        .run();
    });

    it('should handle API call with different response status', () => {
      const mockResponse = {
        data: mockUser,
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {},
      };

      const payload = { fullName: 'testuser/test-repo' };

      return expectSaga(userSaga)
        .provide([
          [matchers.call.fn(instance.get), mockResponse],
        ])
        .put(fetchUserSuccess(mockUser))
        .dispatch(fetchUserRequest(payload))
        .run();
    });

    it('should handle multiple fetchUserRequest actions', () => {
      const mockResponse1 = {
        data: mockUser,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const mockResponse2 = {
        data: { ...mockUser, full_name: 'user2/repo2' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const payload1 = { fullName: 'testuser/test-repo' };
      const payload2 = { fullName: 'user2/repo2' };

      return expectSaga(userSaga)
        .provide([
          [call(instance.get, '/repos/testuser/test-repo'), mockResponse1],
          [call(instance.get, '/repos/user2/repo2'), mockResponse2],
        ])
        .put(fetchUserSuccess(mockUser))
        .dispatch(fetchUserRequest(payload1))
        .put(fetchUserSuccess({ ...mockUser, full_name: 'user2/repo2' }))
        .dispatch(fetchUserRequest(payload2))
        .run();
    });

    it('should handle error with custom message', () => {
      const error = new Error('Repository not found');
      const payload = { fullName: 'nonexistent/repo' };

      return expectSaga(userSaga)
        .provide([
          [matchers.call.fn(instance.get), throwError(error)],
        ])
        .put(fetchUserFailure('Repository not found'))
        .dispatch(fetchUserRequest(payload))
        .run();
    });

    it('should handle API timeout error', () => {
      const error = new Error('Request timeout');
      const payload = { fullName: 'testuser/test-repo' };

      return expectSaga(userSaga)
        .provide([
          [matchers.call.fn(instance.get), throwError(error)],
        ])
        .put(fetchUserFailure('Request timeout'))
        .dispatch(fetchUserRequest(payload))
        .run();
    });

    it('should handle empty fullName gracefully', () => {
      const mockResponse = {
        data: mockUser,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const payload = { fullName: '' };

      return expectSaga(userSaga)
        .provide([
          [call(instance.get, '/repos/'), mockResponse],
        ])
        .call(instance.get, '/repos/')
        .put(fetchUserSuccess(mockUser))
        .dispatch(fetchUserRequest(payload))
        .run();
    });
  });

  describe('userSaga root', () => {
    it('should listen to fetchUserRequest action', () => {
      const mockResponse = {
        data: mockUser,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const payload = { fullName: 'testuser/test-repo' };

      return expectSaga(userSaga)
        .provide([
          [matchers.call.fn(instance.get), mockResponse],
        ])
        .take(fetchUserRequest.type)
        .dispatch(fetchUserRequest(payload))
        .silentRun();
    });

    it('should not respond to other actions', () => {
      return expectSaga(userSaga)
        .dispatch({ type: 'UNKNOWN_ACTION' })
        .not.put.actionType(fetchUserSuccess.type)
        .not.put.actionType(fetchUserFailure.type)
        .silentRun(100);
    });

    it('should handle multiple concurrent requests', () => {
      const mockResponse1 = {
        data: mockUser,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const mockResponse2 = {
        data: { ...mockUser, full_name: 'user2/repo2' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const payload1 = { fullName: 'testuser/test-repo' };
      const payload2 = { fullName: 'user2/repo2' };

      return expectSaga(userSaga)
        .provide([
          [call(instance.get, '/repos/testuser/test-repo'), mockResponse1],
          [call(instance.get, '/repos/user2/repo2'), mockResponse2],
        ])
        .put(fetchUserSuccess(mockUser))
        .put(fetchUserSuccess({ ...mockUser, full_name: 'user2/repo2' }))
        .dispatch(fetchUserRequest(payload1))
        .dispatch(fetchUserRequest(payload2))
        .run();
    });

    it('should use takeLatest pattern (cancel previous request)', () => {
      const mockResponse = {
        data: mockUser,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const payload1 = { fullName: 'testuser/test-repo' };
      const payload2 = { fullName: 'user2/repo2' };

      // With takeLatest, only the latest request should complete
      return expectSaga(userSaga)
        .provide([
          [matchers.call.fn(instance.get), mockResponse],
        ])
        .put(fetchUserSuccess(mockUser))
        .dispatch(fetchUserRequest(payload1))
        .dispatch(fetchUserRequest(payload2)) // This should cancel the first one
        .run();
    });
  });

  describe('edge cases', () => {
    it('should handle null fullName', () => {
      const mockResponse = {
        data: mockUser,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const payload = { fullName: undefined };

      return expectSaga(userSaga)
        .provide([
          [call(instance.get, '/repos/undefined'), mockResponse],
        ])
        .call(instance.get, '/repos/undefined')
        .put(fetchUserSuccess(mockUser))
        .dispatch(fetchUserRequest(payload))
        .run();
    });

    it('should handle malformed API response', () => {
      const malformedResponse = {
        data: null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const payload = { fullName: 'testuser/test-repo' };

      return expectSaga(userSaga)
        .provide([
          [matchers.call.fn(instance.get), malformedResponse],
        ])
        .put(fetchUserSuccess(null as any))
        .dispatch(fetchUserRequest(payload))
        .run();
    });

    it('should handle HTTP 404 error', () => {
      const error = new Error('Request failed with status code 404');
      const payload = { fullName: 'nonexistent/repo' };

      return expectSaga(userSaga)
        .provide([
          [matchers.call.fn(instance.get), throwError(error)],
        ])
        .put(fetchUserFailure('Request failed with status code 404'))
        .dispatch(fetchUserRequest(payload))
        .run();
    });

    it('should handle network connectivity issues', () => {
      const error = new Error('Network Error');
      const payload = { fullName: 'testuser/test-repo' };

      return expectSaga(userSaga)
        .provide([
          [matchers.call.fn(instance.get), throwError(error)],
        ])
        .put(fetchUserFailure('Network Error'))
        .dispatch(fetchUserRequest(payload))
        .run();
    });
  });
});