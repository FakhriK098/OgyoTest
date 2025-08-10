import repositoryReducer, {
  fetchRepositoriesRequest,
  fetchRepositoriesSuccess,
  fetchRepositoriesFailure,
  fetchMoreRepositoriesRequest,
  fetchMoreRepositoriesSuccess,
  fetchMoreRepositoriesFailure,
  fetchSearchRepositoriesRequest,
  fetchSearchRepositoriesSuccess,
  fetchSearchRepositoriesFailure,
  clearSearchResults,
  clearError,
} from '../repositorySagaSlice';
import { IRepository, IOwner } from 'src/types/repository';

describe('repositorySagaSlice reducer', () => {
  const initialState = {
    repositories: [],
    searchRepositories: [],
    loading: false,
    loadingMore: false,
    searchLoading: false,
    error: null,
    currentPage: 1,
    hasMore: true,
    nextSince: null,
  };

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

  it('should return the initial state', () => {
    expect(repositoryReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchRepositoriesRequest', () => {
    it('should set loading to true and clear error', () => {
      const previousState = {
        ...initialState,
        error: 'Previous error',
      };

      const newState = repositoryReducer(
        previousState,
        fetchRepositoriesRequest({ since: 0 })
      );

      expect(newState).toEqual({
        ...initialState,
        loading: true,
        error: null,
      });
    });

    it('should handle request without since parameter', () => {
      const newState = repositoryReducer(
        initialState,
        fetchRepositoriesRequest({})
      );

      expect(newState).toEqual({
        ...initialState,
        loading: true,
        error: null,
      });
    });
  });

  describe('fetchRepositoriesSuccess', () => {
    it('should set repositories data and stop loading', () => {
      const previousState = {
        ...initialState,
        loading: true,
      };

      const payload = {
        repositories: mockRepositories,
        nextSince: 100,
        hasMore: true,
      };

      const newState = repositoryReducer(
        previousState,
        fetchRepositoriesSuccess(payload)
      );

      expect(newState).toEqual({
        ...initialState,
        repositories: mockRepositories,
        nextSince: 100,
        hasMore: true,
        loading: false,
        error: null,
      });
    });

    it('should replace existing repositories data', () => {
      const existingRepos = [mockRepository];
      const previousState = {
        ...initialState,
        repositories: existingRepos,
      };

      const newRepos = mockRepositories;
      const payload = {
        repositories: newRepos,
        nextSince: null,
        hasMore: false,
      };

      const newState = repositoryReducer(
        previousState,
        fetchRepositoriesSuccess(payload)
      );

      expect(newState.repositories).toEqual(newRepos);
      expect(newState.repositories).toHaveLength(2);
      expect(newState.nextSince).toBe(null);
      expect(newState.hasMore).toBe(false);
    });
  });

  describe('fetchRepositoriesFailure', () => {
    it('should set error message and stop loading', () => {
      const errorMessage = 'Failed to fetch repositories';
      const previousState = {
        ...initialState,
        loading: true,
        repositories: mockRepositories,
      };

      const newState = repositoryReducer(
        previousState,
        fetchRepositoriesFailure(errorMessage)
      );

      expect(newState).toEqual({
        ...previousState,
        loading: false,
        error: errorMessage,
      });
    });
  });

  describe('fetchMoreRepositoriesRequest', () => {
    it('should set loadingMore to true and clear error', () => {
      const previousState = {
        ...initialState,
        error: 'Previous error',
        repositories: mockRepositories,
      };

      const newState = repositoryReducer(
        previousState,
        fetchMoreRepositoriesRequest()
      );

      expect(newState).toEqual({
        ...previousState,
        loadingMore: true,
        error: null,
      });
    });
  });

  describe('fetchMoreRepositoriesSuccess', () => {
    it('should append new repositories and stop loadingMore', () => {
      const existingRepos = [mockRepository];
      const newRepos = [mockRepositories[1]];
      
      const previousState = {
        ...initialState,
        repositories: existingRepos,
        loadingMore: true,
        nextSince: 50,
        hasMore: true,
      };

      const payload = {
        repositories: newRepos,
        nextSince: 150,
        hasMore: true,
      };

      const newState = repositoryReducer(
        previousState,
        fetchMoreRepositoriesSuccess(payload)
      );

      expect(newState).toEqual({
        ...initialState,
        repositories: [...existingRepos, ...newRepos],
        nextSince: 150,
        hasMore: true,
        loadingMore: false,
        error: null,
      });
    });

    it('should handle end of pagination', () => {
      const existingRepos = mockRepositories;
      const newRepos = [
        {
          ...mockRepository,
          id: 3,
          name: 'final-repo',
        },
      ];

      const previousState = {
        ...initialState,
        repositories: existingRepos,
        loadingMore: true,
      };

      const payload = {
        repositories: newRepos,
        nextSince: null,
        hasMore: false,
      };

      const newState = repositoryReducer(
        previousState,
        fetchMoreRepositoriesSuccess(payload)
      );

      expect(newState.repositories).toHaveLength(3);
      expect(newState.nextSince).toBe(null);
      expect(newState.hasMore).toBe(false);
      expect(newState.loadingMore).toBe(false);
    });
  });

  describe('fetchMoreRepositoriesFailure', () => {
    it('should set error message and stop loadingMore', () => {
      const errorMessage = 'Failed to fetch more repositories';
      const previousState = {
        ...initialState,
        loadingMore: true,
        repositories: mockRepositories,
      };

      const newState = repositoryReducer(
        previousState,
        fetchMoreRepositoriesFailure(errorMessage)
      );

      expect(newState).toEqual({
        ...previousState,
        loadingMore: false,
        error: errorMessage,
      });
    });
  });

  describe('fetchSearchRepositoriesRequest', () => {
    it('should set searchLoading to true and clear error', () => {
      const previousState = {
        ...initialState,
        error: 'Previous error',
        searchRepositories: mockRepositories,
      };

      const newState = repositoryReducer(
        previousState,
        fetchSearchRepositoriesRequest({ query: 'react' })
      );

      expect(newState).toEqual({
        ...previousState,
        searchLoading: true,
        error: null,
      });
    });
  });

  describe('fetchSearchRepositoriesSuccess', () => {
    it('should set search repositories data and stop searchLoading', () => {
      const previousState = {
        ...initialState,
        searchLoading: true,
        searchRepositories: [],
      };

      const payload = {
        repositories: mockRepositories,
      };

      const newState = repositoryReducer(
        previousState,
        fetchSearchRepositoriesSuccess(payload)
      );

      expect(newState).toEqual({
        ...initialState,
        searchRepositories: mockRepositories,
        searchLoading: false,
        error: null,
      });
    });

    it('should replace existing search results', () => {
      const oldSearchResults = [mockRepository];
      const newSearchResults = mockRepositories;

      const previousState = {
        ...initialState,
        searchRepositories: oldSearchResults,
        searchLoading: true,
      };

      const payload = {
        repositories: newSearchResults,
      };

      const newState = repositoryReducer(
        previousState,
        fetchSearchRepositoriesSuccess(payload)
      );

      expect(newState.searchRepositories).toEqual(newSearchResults);
      expect(newState.searchRepositories).toHaveLength(2);
      expect(newState.searchLoading).toBe(false);
    });
  });

  describe('fetchSearchRepositoriesFailure', () => {
    it('should set error message and stop searchLoading', () => {
      const errorMessage = 'Failed to search repositories';
      const previousState = {
        ...initialState,
        searchLoading: true,
        searchRepositories: mockRepositories,
      };

      const newState = repositoryReducer(
        previousState,
        fetchSearchRepositoriesFailure(errorMessage)
      );

      expect(newState).toEqual({
        ...previousState,
        searchLoading: false,
        error: errorMessage,
      });
    });
  });

  describe('clearSearchResults', () => {
    it('should clear search repositories', () => {
      const previousState = {
        ...initialState,
        searchRepositories: mockRepositories,
        searchLoading: false,
        error: null,
      };

      const newState = repositoryReducer(previousState, clearSearchResults());

      expect(newState).toEqual({
        ...previousState,
        searchRepositories: [],
      });
    });

    it('should not affect other state properties', () => {
      const previousState = {
        ...initialState,
        repositories: mockRepositories,
        searchRepositories: mockRepositories,
        loading: false,
        error: 'Some error',
        nextSince: 100,
      };

      const newState = repositoryReducer(previousState, clearSearchResults());

      expect(newState).toEqual({
        ...previousState,
        searchRepositories: [],
      });
      expect(newState.repositories).toEqual(mockRepositories);
      expect(newState.error).toBe('Some error');
      expect(newState.nextSince).toBe(100);
    });
  });

  describe('clearError', () => {
    it('should clear error message', () => {
      const previousState = {
        ...initialState,
        error: 'Some error message',
        repositories: mockRepositories,
      };

      const newState = repositoryReducer(previousState, clearError());

      expect(newState).toEqual({
        ...previousState,
        error: null,
      });
    });

    it('should not affect other state properties', () => {
      const previousState = {
        ...initialState,
        repositories: mockRepositories,
        searchRepositories: mockRepositories,
        loading: true,
        loadingMore: true,
        searchLoading: true,
        error: 'Error to be cleared',
        nextSince: 200,
      };

      const newState = repositoryReducer(previousState, clearError());

      expect(newState).toEqual({
        ...previousState,
        error: null,
      });
      expect(newState.loading).toBe(true);
      expect(newState.loadingMore).toBe(true);
      expect(newState.searchLoading).toBe(true);
      expect(newState.repositories).toEqual(mockRepositories);
      expect(newState.nextSince).toBe(200);
    });
  });

  describe('combined actions', () => {
    it('should handle a sequence of repository fetching actions', () => {
      let state = repositoryReducer(undefined, { type: 'unknown' });

      // Initial fetch
      state = repositoryReducer(state, fetchRepositoriesRequest({ since: 0 }));
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);

      state = repositoryReducer(
        state,
        fetchRepositoriesSuccess({
          repositories: [mockRepository],
          nextSince: 50,
          hasMore: true,
        })
      );
      expect(state.loading).toBe(false);
      expect(state.repositories).toHaveLength(1);
      expect(state.nextSince).toBe(50);
      expect(state.hasMore).toBe(true);

      // Load more
      state = repositoryReducer(state, fetchMoreRepositoriesRequest());
      expect(state.loadingMore).toBe(true);

      state = repositoryReducer(
        state,
        fetchMoreRepositoriesSuccess({
          repositories: [mockRepositories[1]],
          nextSince: null,
          hasMore: false,
        })
      );
      expect(state.loadingMore).toBe(false);
      expect(state.repositories).toHaveLength(2);
      expect(state.hasMore).toBe(false);
    });

    it('should handle search flow independently', () => {
      let state = repositoryReducer(undefined, { type: 'unknown' });

      // Populate main repositories first
      state = repositoryReducer(
        state,
        fetchRepositoriesSuccess({
          repositories: mockRepositories,
          nextSince: 100,
          hasMore: true,
        })
      );

      // Search
      state = repositoryReducer(
        state,
        fetchSearchRepositoriesRequest({ query: 'test' })
      );
      expect(state.searchLoading).toBe(true);
      expect(state.repositories).toHaveLength(2); // Should not affect main repos

      state = repositoryReducer(
        state,
        fetchSearchRepositoriesSuccess({
          repositories: [mockRepository],
        })
      );
      expect(state.searchLoading).toBe(false);
      expect(state.searchRepositories).toHaveLength(1);
      expect(state.repositories).toHaveLength(2); // Main repos unchanged

      // Clear search
      state = repositoryReducer(state, clearSearchResults());
      expect(state.searchRepositories).toHaveLength(0);
      expect(state.repositories).toHaveLength(2); // Main repos still unchanged
    });

    it('should handle error scenarios', () => {
      let state = repositoryReducer(undefined, { type: 'unknown' });

      // Failed initial fetch
      state = repositoryReducer(state, fetchRepositoriesRequest({ since: 0 }));
      state = repositoryReducer(state, fetchRepositoriesFailure('Network error'));
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');

      // Clear error
      state = repositoryReducer(state, clearError());
      expect(state.error).toBe(null);

      // Failed search
      state = repositoryReducer(
        state,
        fetchSearchRepositoriesRequest({ query: 'test' })
      );
      state = repositoryReducer(
        state,
        fetchSearchRepositoriesFailure('Search failed')
      );
      expect(state.searchLoading).toBe(false);
      expect(state.error).toBe('Search failed');

      // Failed load more
      state = repositoryReducer(state, clearError());
      state = repositoryReducer(state, fetchMoreRepositoriesRequest());
      state = repositoryReducer(
        state,
        fetchMoreRepositoriesFailure('Load more failed')
      );
      expect(state.loadingMore).toBe(false);
      expect(state.error).toBe('Load more failed');
    });
  });
});