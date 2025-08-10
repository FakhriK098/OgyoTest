import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import { call, select } from 'redux-saga/effects';
import { repositorySaga } from '../repositorySaga';
import instance from '../../../services/api';
import {
  fetchRepositoriesRequest,
  fetchRepositoriesSuccess,
  fetchRepositoriesFailure,
  fetchMoreRepositoriesRequest,
  fetchMoreRepositoriesSuccess,
  fetchMoreRepositoriesFailure,
  fetchSearchRepositoriesRequest,
  fetchSearchRepositoriesSuccess,
  fetchSearchRepositoriesFailure,
} from '../../slices/repositorySagaSlice';
import { IRepository, IOwner } from 'src/types/repository';
import { RootState } from '../../index';

describe('repositorySaga', () => {
  const mockOwner: IOwner = {
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

  const mockRepository: IRepository = {
    id: 1,
    node_id: 'test-repo-node',
    name: 'test-repo',
    full_name: 'testuser/test-repo',
    private: false,
    owner: mockOwner,
    html_url: 'https://github.com/testuser/test-repo',
    description: 'A test repository',
  };

  const mockRepositories = [
    mockRepository,
    {
      ...mockRepository,
      id: 2,
      name: 'test-repo-2',
      full_name: 'testuser/test-repo-2',
      html_url: 'https://github.com/testuser/test-repo-2',
      description: 'Another test repository',
    },
  ];

  const mockState: Partial<RootState> = {
    repository: {
      repositories: [],
      searchRepositories: [],
      loading: false,
      loadingMore: false,
      searchLoading: false,
      error: null,
      currentPage: 1,
      hasMore: true,
      nextSince: 100,
    },
  };

  describe('fetchRepositoriesSaga', () => {
    it('should fetch repositories successfully with pagination', () => {
      const mockResponse = {
        data: mockRepositories,
        status: 200,
        statusText: 'OK',
        headers: {
          link: '<https://api.github.com/repositories?since=200>; rel="next", <https://api.github.com/repositories?since=0>; rel="prev"',
        },
        config: {},
      };

      const payload = { since: 0 };

      return expectSaga(repositorySaga)
        .provide([
          [matchers.call.fn(instance.get), mockResponse],
        ])
        .put(
          fetchRepositoriesSuccess({
            repositories: mockRepositories,
            nextSince: 200,
            hasMore: true,
          })
        )
        .dispatch(fetchRepositoriesRequest(payload))
        .run();
    });

    it('should call the correct API endpoint with since parameter', () => {
      const mockResponse = {
        data: mockRepositories,
        status: 200,
        statusText: 'OK',
        headers: {
          link: '<https://api.github.com/repositories?since=200>; rel="next"',
        },
        config: {},
      };

      const payload = { since: 50 };

      return expectSaga(repositorySaga)
        .provide([
          [call(instance.get, '/repositories?since=50'), mockResponse],
        ])
        .call(instance.get, '/repositories?since=50')
        .dispatch(fetchRepositoriesRequest(payload))
        .run();
    });

    it('should handle default since parameter of 0', () => {
      const mockResponse = {
        data: mockRepositories,
        status: 200,
        statusText: 'OK',
        headers: {
          link: '<https://api.github.com/repositories?since=200>; rel="next"',
        },
        config: {},
      };

      const payload = {};

      return expectSaga(repositorySaga)
        .provide([
          [call(instance.get, '/repositories?since=0'), mockResponse],
        ])
        .call(instance.get, '/repositories?since=0')
        .dispatch(fetchRepositoriesRequest(payload))
        .run();
    });

    it('should handle response without link header', () => {
      const mockResponse = {
        data: mockRepositories,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const payload = { since: 0 };

      return expectSaga(repositorySaga)
        .provide([
          [matchers.call.fn(instance.get), mockResponse],
        ])
        .put(
          fetchRepositoriesSuccess({
            repositories: mockRepositories,
            nextSince: null,
            hasMore: false,
          })
        )
        .dispatch(fetchRepositoriesRequest(payload))
        .run();
    });

    it('should handle API call failure', () => {
      const error = new Error('Network error');
      const payload = { since: 0 };

      return expectSaga(repositorySaga)
        .provide([
          [matchers.call.fn(instance.get), throwError(error)],
        ])
        .put(fetchRepositoriesFailure('Network error'))
        .dispatch(fetchRepositoriesRequest(payload))
        .run();
    });

    it('should handle error without message', () => {
      const error = new Error();
      const payload = { since: 0 };

      return expectSaga(repositorySaga)
        .provide([
          [matchers.call.fn(instance.get), throwError(error)],
        ])
        .put(fetchRepositoriesFailure('Failed to fetch repositories'))
        .dispatch(fetchRepositoriesRequest(payload))
        .run();
    });

    it('should handle end of pagination (no next link)', () => {
      const mockResponse = {
        data: mockRepositories,
        status: 200,
        statusText: 'OK',
        headers: {
          link: '<https://api.github.com/repositories?since=0>; rel="prev"',
        },
        config: {},
      };

      const payload = { since: 500 };

      return expectSaga(repositorySaga)
        .provide([
          [matchers.call.fn(instance.get), mockResponse],
        ])
        .put(
          fetchRepositoriesSuccess({
            repositories: mockRepositories,
            nextSince: null,
            hasMore: false,
          })
        )
        .dispatch(fetchRepositoriesRequest(payload))
        .run();
    });
  });

  describe('fetchMoreRepositoriesSaga', () => {
    it('should fetch more repositories successfully', () => {
      const mockResponse = {
        data: mockRepositories,
        status: 200,
        statusText: 'OK',
        headers: {
          link: '<https://api.github.com/repositories?since=300>; rel="next"',
        },
        config: {},
      };

      const payload = {};

      return expectSaga(repositorySaga)
        .provide([
          [select(), mockState],
          [matchers.call.fn(instance.get), mockResponse],
        ])
        .put(
          fetchMoreRepositoriesSuccess({
            repositories: mockRepositories,
            nextSince: 300,
            hasMore: true,
          })
        )
        .dispatch(fetchMoreRepositoriesRequest(payload))
        .run();
    });

    it('should call API with correct nextSince from state', () => {
      const mockResponse = {
        data: mockRepositories,
        status: 200,
        statusText: 'OK',
        headers: {
          link: '<https://api.github.com/repositories?since=300>; rel="next"',
        },
        config: {},
      };

      const stateWithNextSince = {
        ...mockState,
        repository: {
          ...mockState.repository!,
          nextSince: 150,
        },
      };

      const payload = {};

      return expectSaga(repositorySaga)
        .provide([
          [select(), stateWithNextSince],
          [call(instance.get, '/repositories?since=150'), mockResponse],
        ])
        .call(instance.get, '/repositories?since=150')
        .dispatch(fetchMoreRepositoriesRequest(payload))
        .run();
    });

    it('should handle no nextSince in state', () => {
      const stateWithoutNextSince = {
        ...mockState,
        repository: {
          ...mockState.repository!,
          nextSince: null,
        },
      };

      const payload = {};

      return expectSaga(repositorySaga)
        .provide([
          [select(), stateWithoutNextSince],
        ])
        .put(fetchMoreRepositoriesFailure('No more repositories to load'))
        .dispatch(fetchMoreRepositoriesRequest(payload))
        .run();
    });

    it('should handle API call failure', () => {
      const error = new Error('Load more failed');
      const payload = {};

      return expectSaga(repositorySaga)
        .provide([
          [select(), mockState],
          [matchers.call.fn(instance.get), throwError(error)],
        ])
        .put(fetchMoreRepositoriesFailure('Load more failed'))
        .dispatch(fetchMoreRepositoriesRequest(payload))
        .run();
    });

    it('should handle error without message', () => {
      const error = new Error();
      const payload = {};

      return expectSaga(repositorySaga)
        .provide([
          [select(), mockState],
          [matchers.call.fn(instance.get), throwError(error)],
        ])
        .put(fetchMoreRepositoriesFailure('Failed to fetch more repositories'))
        .dispatch(fetchMoreRepositoriesRequest(payload))
        .run();
    });

    it('should handle end of pagination for load more', () => {
      const mockResponse = {
        data: mockRepositories,
        status: 200,
        statusText: 'OK',
        headers: {
          link: '<https://api.github.com/repositories?since=50>; rel="prev"',
        },
        config: {},
      };

      const payload = {};

      return expectSaga(repositorySaga)
        .provide([
          [select(), mockState],
          [matchers.call.fn(instance.get), mockResponse],
        ])
        .put(
          fetchMoreRepositoriesSuccess({
            repositories: mockRepositories,
            nextSince: null,
            hasMore: false,
          })
        )
        .dispatch(fetchMoreRepositoriesRequest(payload))
        .run();
    });
  });

  describe('searchRepositoriesSaga', () => {
    it('should search repositories successfully', () => {
      const searchResults = {
        items: mockRepositories,
        total_count: 2,
        incomplete_results: false,
      };

      const mockResponse = {
        data: searchResults,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const payload = { query: 'react' };

      return expectSaga(repositorySaga)
        .provide([
          [matchers.call.fn(instance.get), mockResponse],
        ])
        .put(
          fetchSearchRepositoriesSuccess({
            repositories: mockRepositories,
          })
        )
        .dispatch(fetchSearchRepositoriesRequest(payload))
        .run();
    });

    it('should call the correct search API endpoint', () => {
      const searchResults = {
        items: mockRepositories,
        total_count: 2,
        incomplete_results: false,
      };

      const mockResponse = {
        data: searchResults,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const payload = { query: 'typescript' };

      return expectSaga(repositorySaga)
        .provide([
          [call(instance.get, '/search/repositories?q=typescript'), mockResponse],
        ])
        .call(instance.get, '/search/repositories?q=typescript')
        .dispatch(fetchSearchRepositoriesRequest(payload))
        .run();
    });

    it('should handle search query with special characters', () => {
      const searchResults = {
        items: mockRepositories,
        total_count: 2,
        incomplete_results: false,
      };

      const mockResponse = {
        data: searchResults,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const payload = { query: 'react+hooks language:typescript' };
      const encodedQuery = encodeURIComponent('react+hooks language:typescript');

      return expectSaga(repositorySaga)
        .provide([
          [call(instance.get, `/search/repositories?q=${encodedQuery}`), mockResponse],
        ])
        .call(instance.get, `/search/repositories?q=${encodedQuery}`)
        .dispatch(fetchSearchRepositoriesRequest(payload))
        .run();
    });

    it('should handle empty search results', () => {
      const emptySearchResults = {
        items: [],
        total_count: 0,
        incomplete_results: false,
      };

      const mockResponse = {
        data: emptySearchResults,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const payload = { query: 'nonexistent-query' };

      return expectSaga(repositorySaga)
        .provide([
          [matchers.call.fn(instance.get), mockResponse],
        ])
        .put(
          fetchSearchRepositoriesSuccess({
            repositories: [],
          })
        )
        .dispatch(fetchSearchRepositoriesRequest(payload))
        .run();
    });

    it('should handle search API call failure', () => {
      const error = new Error('Search failed');
      const payload = { query: 'react' };

      return expectSaga(repositorySaga)
        .provide([
          [matchers.call.fn(instance.get), throwError(error)],
        ])
        .put(fetchSearchRepositoriesFailure('Search failed'))
        .dispatch(fetchSearchRepositoriesRequest(payload))
        .run();
    });

    it('should handle search error without message', () => {
      const error = new Error();
      const payload = { query: 'react' };

      return expectSaga(repositorySaga)
        .provide([
          [matchers.call.fn(instance.get), throwError(error)],
        ])
        .put(fetchSearchRepositoriesFailure('Failed to search repositories'))
        .dispatch(fetchSearchRepositoriesRequest(payload))
        .run();
    });

    it('should handle rate limiting error', () => {
      const error = new Error('API rate limit exceeded');
      const payload = { query: 'popular' };

      return expectSaga(repositorySaga)
        .provide([
          [matchers.call.fn(instance.get), throwError(error)],
        ])
        .put(fetchSearchRepositoriesFailure('API rate limit exceeded'))
        .dispatch(fetchSearchRepositoriesRequest(payload))
        .run();
    });
  });

  describe('repositorySaga root', () => {
    it('should listen to fetchRepositoriesRequest action', () => {
      const mockResponse = {
        data: mockRepositories,
        status: 200,
        statusText: 'OK',
        headers: {
          link: '<https://api.github.com/repositories?since=200>; rel="next"',
        },
        config: {},
      };

      const payload = { since: 0 };

      return expectSaga(repositorySaga)
        .provide([
          [matchers.call.fn(instance.get), mockResponse],
        ])
        .take(fetchRepositoriesRequest.type)
        .dispatch(fetchRepositoriesRequest(payload))
        .silentRun();
    });

    it('should listen to fetchMoreRepositoriesRequest action', () => {
      const mockResponse = {
        data: mockRepositories,
        status: 200,
        statusText: 'OK',
        headers: {
          link: '<https://api.github.com/repositories?since=300>; rel="next"',
        },
        config: {},
      };

      const payload = {};

      return expectSaga(repositorySaga)
        .provide([
          [select(), mockState],
          [matchers.call.fn(instance.get), mockResponse],
        ])
        .take(fetchMoreRepositoriesRequest.type)
        .dispatch(fetchMoreRepositoriesRequest(payload))
        .silentRun();
    });

    it('should listen to fetchSearchRepositoriesRequest action', () => {
      const searchResults = {
        items: mockRepositories,
        total_count: 2,
        incomplete_results: false,
      };

      const mockResponse = {
        data: searchResults,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const payload = { query: 'test' };

      return expectSaga(repositorySaga)
        .provide([
          [matchers.call.fn(instance.get), mockResponse],
        ])
        .take(fetchSearchRepositoriesRequest.type)
        .dispatch(fetchSearchRepositoriesRequest(payload))
        .silentRun();
    });

    it('should not respond to other actions', () => {
      return expectSaga(repositorySaga)
        .dispatch({ type: 'UNKNOWN_ACTION' })
        .not.put.actionType(fetchRepositoriesSuccess.type)
        .not.put.actionType(fetchRepositoriesFailure.type)
        .not.put.actionType(fetchMoreRepositoriesSuccess.type)
        .not.put.actionType(fetchMoreRepositoriesFailure.type)
        .not.put.actionType(fetchSearchRepositoriesSuccess.type)
        .not.put.actionType(fetchSearchRepositoriesFailure.type)
        .silentRun(100);
    });

    it('should use takeLatest pattern for all actions', () => {
      const mockResponse = {
        data: mockRepositories,
        status: 200,
        statusText: 'OK',
        headers: {
          link: '<https://api.github.com/repositories?since=200>; rel="next"',
        },
        config: {},
      };

      const payload1 = { since: 0 };
      const payload2 = { since: 100 };

      // With takeLatest, only the latest request should complete
      return expectSaga(repositorySaga)
        .provide([
          [matchers.call.fn(instance.get), mockResponse],
        ])
        .put(
          fetchRepositoriesSuccess({
            repositories: mockRepositories,
            nextSince: 200,
            hasMore: true,
          })
        )
        .dispatch(fetchRepositoriesRequest(payload1))
        .dispatch(fetchRepositoriesRequest(payload2)) // This should cancel the first one
        .run();
    });
  });

  describe('integration scenarios', () => {
    it('should handle fetch -> load more sequence', async () => {
      const initialResponse = {
        data: [mockRepository],
        status: 200,
        statusText: 'OK',
        headers: {
          link: '<https://api.github.com/repositories?since=200>; rel="next"',
        },
        config: {},
      };

      const loadMoreResponse = {
        data: [mockRepositories[1]],
        status: 200,
        statusText: 'OK',
        headers: {
          link: '<https://api.github.com/repositories?since=300>; rel="next"',
        },
        config: {},
      };

      const initialPayload = { since: 0 };
      const loadMorePayload = {};

      const stateAfterInitialFetch = {
        ...mockState,
        repository: {
          ...mockState.repository!,
          repositories: [mockRepository],
          nextSince: 200,
          hasMore: true,
        },
      };

      return expectSaga(repositorySaga)
        .provide([
          [call(instance.get, '/repositories?since=0'), initialResponse],
          [select(), stateAfterInitialFetch],
          [call(instance.get, '/repositories?since=200'), loadMoreResponse],
        ])
        .put(
          fetchRepositoriesSuccess({
            repositories: [mockRepository],
            nextSince: 200,
            hasMore: true,
          })
        )
        .dispatch(fetchRepositoriesRequest(initialPayload))
        .put(
          fetchMoreRepositoriesSuccess({
            repositories: [mockRepositories[1]],
            nextSince: 300,
            hasMore: true,
          })
        )
        .dispatch(fetchMoreRepositoriesRequest(loadMorePayload))
        .run();
    });

    it('should handle search independent of fetch operations', async () => {
      const fetchResponse = {
        data: mockRepositories,
        status: 200,
        statusText: 'OK',
        headers: {
          link: '<https://api.github.com/repositories?since=200>; rel="next"',
        },
        config: {},
      };

      const searchResults = {
        items: [mockRepository],
        total_count: 1,
        incomplete_results: false,
      };

      const searchResponse = {
        data: searchResults,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      const fetchPayload = { since: 0 };
      const searchPayload = { query: 'react' };

      return expectSaga(repositorySaga)
        .provide([
          [call(instance.get, '/repositories?since=0'), fetchResponse],
          [call(instance.get, '/search/repositories?q=react'), searchResponse],
        ])
        .put(
          fetchRepositoriesSuccess({
            repositories: mockRepositories,
            nextSince: 200,
            hasMore: true,
          })
        )
        .dispatch(fetchRepositoriesRequest(fetchPayload))
        .put(
          fetchSearchRepositoriesSuccess({
            repositories: [mockRepository],
          })
        )
        .dispatch(fetchSearchRepositoriesRequest(searchPayload))
        .run();
    });

    it('should handle mixed success and failure scenarios', async () => {
      const successResponse = {
        data: mockRepositories,
        status: 200,
        statusText: 'OK',
        headers: {
          link: '<https://api.github.com/repositories?since=200>; rel="next"',
        },
        config: {},
      };

      const fetchPayload = { since: 0 };
      const searchPayload = { query: 'nonexistent' };

      const error = new Error('Search failed');

      return expectSaga(repositorySaga)
        .provide([
          [call(instance.get, '/repositories?since=0'), successResponse],
          [call(instance.get, '/search/repositories?q=nonexistent'), throwError(error)],
        ])
        .put(
          fetchRepositoriesSuccess({
            repositories: mockRepositories,
            nextSince: 200,
            hasMore: true,
          })
        )
        .dispatch(fetchRepositoriesRequest(fetchPayload))
        .put(fetchSearchRepositoriesFailure('Search failed'))
        .dispatch(fetchSearchRepositoriesRequest(searchPayload))
        .run();
    });
  });
});