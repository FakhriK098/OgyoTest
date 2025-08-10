import userReducer, {
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
} from '../userSagaSlice';
import { IUser } from 'src/types/user';

describe('userSagaSlice reducer', () => {
  const initialState = {
    user: null,
    loading: false,
    error: null,
  };

  const mockUser: IUser = {
    id: 1,
    name: 'React',
    full_name: 'facebook/react',
    owner: {
      login: 'facebook',
      id: 69631,
      node_id: 'MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
      avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/facebook',
      html_url: 'https://github.com/facebook',
      followers_url: 'https://api.github.com/users/facebook/followers',
      following_url: 'https://api.github.com/users/facebook/following{/other_user}',
      gists_url: 'https://api.github.com/users/facebook/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/facebook/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/facebook/subscriptions',
      organizations_url: 'https://api.github.com/users/facebook/orgs',
      repos_url: 'https://api.github.com/users/facebook/repos',
      events_url: 'https://api.github.com/users/facebook/events{/privacy}',
      received_events_url: 'https://api.github.com/users/facebook/received_events',
      type: 'Organization',
      user_view_type: 'public',
      site_admin: false,
    },
    private: false,
    html_url: 'https://github.com/facebook/react',
    description: 'A declarative, efficient, and flexible JavaScript library',
    fork: false,
    url: 'https://api.github.com/repos/facebook/react',
    created_at: '2013-05-24T16:15:54Z',
    updated_at: '2023-11-01T00:00:00Z',
    pushed_at: '2023-11-01T00:00:00Z',
    homepage: 'https://reactjs.org',
    size: 189236,
    stargazers_count: 200000,
    watchers_count: 6500,
    language: 'JavaScript',
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: true,
    has_pages: true,
    has_discussions: true,
    forks_count: 40000,
    mirror_url: null,
    archived: false,
    disabled: false,
    open_issues_count: 1200,
    license: {
      key: 'mit',
      name: 'MIT License',
      spdx_id: 'MIT',
      url: 'https://api.github.com/licenses/mit',
      node_id: 'MDc6TGljZW5zZTEz',
    },
    allow_forking: true,
    is_template: false,
    web_commit_signoff_required: false,
    topics: ['react', 'javascript', 'library'],
    visibility: 'public',
    forks: 40000,
    open_issues: 1200,
    watchers: 6500,
    default_branch: 'main',
    network_count: 40000,
    subscribers_count: 6500,
  };

  it('should return the initial state', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchUserRequest', () => {
    it('should set loading to true and clear error', () => {
      const previousState = {
        ...initialState,
        error: 'Previous error',
      };

      const newState = userReducer(
        previousState,
        fetchUserRequest({ fullName: 'facebook/react' })
      );

      expect(newState).toEqual({
        ...initialState,
        loading: true,
        error: null,
      });
    });

    it('should handle request without fullName parameter', () => {
      const newState = userReducer(initialState, fetchUserRequest({}));

      expect(newState).toEqual({
        ...initialState,
        loading: true,
        error: null,
      });
    });

    it('should preserve existing user data while loading', () => {
      const previousState = {
        ...initialState,
        user: mockUser,
      };

      const newState = userReducer(
        previousState,
        fetchUserRequest({ fullName: 'another/repo' })
      );

      expect(newState.user).toEqual(mockUser);
      expect(newState.loading).toBe(true);
    });
  });

  describe('fetchUserSuccess', () => {
    it('should set user data and stop loading', () => {
      const previousState = {
        ...initialState,
        loading: true,
      };

      const newState = userReducer(previousState, fetchUserSuccess(mockUser));

      expect(newState).toEqual({
        user: mockUser,
        loading: false,
        error: null,
      });
    });

    it('should replace existing user data', () => {
      const oldUser: IUser = {
        ...mockUser,
        name: 'OldRepo',
        full_name: 'old/repo',
      };

      const previousState = {
        ...initialState,
        user: oldUser,
      };

      const newState = userReducer(previousState, fetchUserSuccess(mockUser));

      expect(newState.user).toEqual(mockUser);
      expect(newState.user?.name).toBe('React');
    });

    it('should clear any existing errors', () => {
      const previousState = {
        ...initialState,
        loading: true,
        error: 'Some error',
      };

      const newState = userReducer(previousState, fetchUserSuccess(mockUser));

      expect(newState.error).toBeNull();
    });
  });

  describe('fetchUserFailure', () => {
    it('should set error message and stop loading', () => {
      const errorMessage = 'Failed to fetch user';
      const previousState = {
        ...initialState,
        loading: true,
        user: mockUser,
      };

      const newState = userReducer(
        previousState,
        fetchUserFailure(errorMessage)
      );

      expect(newState).toEqual({
        user: mockUser,
        loading: false,
        error: errorMessage,
      });
    });

    it('should preserve existing user data on error', () => {
      const previousState = {
        ...initialState,
        user: mockUser,
        loading: true,
      };

      const newState = userReducer(
        previousState,
        fetchUserFailure('Network error')
      );

      expect(newState.user).toEqual(mockUser);
      expect(newState.error).toBe('Network error');
    });

    it('should handle empty error message', () => {
      const previousState = {
        ...initialState,
        loading: true,
      };

      const newState = userReducer(previousState, fetchUserFailure(''));

      expect(newState.error).toBe('');
      expect(newState.loading).toBe(false);
    });
  });

  describe('combined actions', () => {
    it('should handle a sequence of actions', () => {
      let state = userReducer(undefined, { type: 'unknown' });

      // Start fetching
      state = userReducer(state, fetchUserRequest({ fullName: 'facebook/react' }));
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();

      // Fetch success
      state = userReducer(state, fetchUserSuccess(mockUser));
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.error).toBeNull();

      // New fetch request
      state = userReducer(state, fetchUserRequest({ fullName: 'another/repo' }));
      expect(state.loading).toBe(true);
      expect(state.user).toEqual(mockUser); // Should preserve previous data

      // Fetch failure
      const errorMessage = 'API rate limit exceeded';
      state = userReducer(state, fetchUserFailure(errorMessage));
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.user).toEqual(mockUser); // Should still preserve data
    });

    it('should handle multiple consecutive errors', () => {
      let state = userReducer(initialState, fetchUserRequest({}));
      
      state = userReducer(state, fetchUserFailure('Error 1'));
      expect(state.error).toBe('Error 1');
      
      state = userReducer(state, fetchUserRequest({}));
      expect(state.error).toBeNull();
      
      state = userReducer(state, fetchUserFailure('Error 2'));
      expect(state.error).toBe('Error 2');
    });
  });
});