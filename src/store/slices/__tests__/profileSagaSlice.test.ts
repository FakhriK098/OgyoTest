import profileReducer, {
  fetchProfileRequest,
  fetchProfileSuccess,
  fetchProfileFailure,
  setLocalAvatarUri,
} from '../profileSagaSlice';
import { IProfile } from 'src/types/profile';

describe('profileSagaSlice reducer', () => {
  const initialState = {
    profile: null,
    loading: false,
    error: null,
    localAvatarUri: null,
  };

  const mockProfile: IProfile = {
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
    name: 'Test User',
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

  it('should return the initial state', () => {
    expect(profileReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchProfileRequest', () => {
    it('should set loading to true and clear error', () => {
      const previousState = {
        ...initialState,
        error: 'Previous error',
      };

      const newState = profileReducer(previousState, fetchProfileRequest());

      expect(newState).toEqual({
        ...initialState,
        loading: true,
        error: null,
      });
    });
  });

  describe('fetchProfileSuccess', () => {
    it('should set profile data and stop loading', () => {
      const previousState = {
        ...initialState,
        loading: true,
      };

      const newState = profileReducer(
        previousState,
        fetchProfileSuccess(mockProfile)
      );

      expect(newState).toEqual({
        ...initialState,
        profile: mockProfile,
        loading: false,
        error: null,
      });
    });

    it('should replace existing profile data', () => {
      const oldProfile: IProfile = {
        ...mockProfile,
        login: 'olduser',
      };

      const previousState = {
        ...initialState,
        profile: oldProfile,
      };

      const newState = profileReducer(
        previousState,
        fetchProfileSuccess(mockProfile)
      );

      expect(newState.profile).toEqual(mockProfile);
      expect(newState.profile?.login).toBe('testuser');
    });
  });

  describe('fetchProfileFailure', () => {
    it('should set error message and stop loading', () => {
      const errorMessage = 'Failed to fetch profile';
      const previousState = {
        ...initialState,
        loading: true,
        profile: mockProfile,
      };

      const newState = profileReducer(
        previousState,
        fetchProfileFailure(errorMessage)
      );

      expect(newState).toEqual({
        ...previousState,
        loading: false,
        error: errorMessage,
      });
    });
  });

  describe('setLocalAvatarUri', () => {
    it('should set local avatar URI', () => {
      const avatarUri = 'file://local-avatar.jpg';
      const newState = profileReducer(
        initialState,
        setLocalAvatarUri(avatarUri)
      );

      expect(newState).toEqual({
        ...initialState,
        localAvatarUri: avatarUri,
      });
    });

    it('should handle null avatar URI', () => {
      const previousState = {
        ...initialState,
        localAvatarUri: 'file://old-avatar.jpg',
      };

      const newState = profileReducer(previousState, setLocalAvatarUri(null));

      expect(newState).toEqual({
        ...initialState,
        localAvatarUri: null,
      });
    });

    it('should not affect other state properties', () => {
      const previousState = {
        profile: mockProfile,
        loading: false,
        error: null,
        localAvatarUri: null,
      };

      const avatarUri = 'file://new-avatar.jpg';
      const newState = profileReducer(previousState, setLocalAvatarUri(avatarUri));

      expect(newState).toEqual({
        ...previousState,
        localAvatarUri: avatarUri,
      });
      expect(newState.profile).toBe(mockProfile);
    });
  });

  describe('combined actions', () => {
    it('should handle a sequence of actions', () => {
      let state = profileReducer(undefined, { type: 'unknown' });

      state = profileReducer(state, fetchProfileRequest());
      expect(state.loading).toBe(true);

      state = profileReducer(state, fetchProfileSuccess(mockProfile));
      expect(state.loading).toBe(false);
      expect(state.profile).toEqual(mockProfile);

      const avatarUri = 'file://avatar.jpg';
      state = profileReducer(state, setLocalAvatarUri(avatarUri));
      expect(state.localAvatarUri).toBe(avatarUri);

      state = profileReducer(state, fetchProfileRequest());
      expect(state.loading).toBe(true);
      expect(state.localAvatarUri).toBe(avatarUri);

      const errorMessage = 'Network error';
      state = profileReducer(state, fetchProfileFailure(errorMessage));
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.localAvatarUri).toBe(avatarUri);
    });
  });
});