import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProfileScreen from '../ProfileScreen';
import { profileSagaSlice, setLocalAvatarUri } from 'src/store/slices/profileSagaSlice';
import * as ImagePicker from 'react-native-image-picker';
import { Alert } from 'react-native';
import * as reduxHooks from 'src/hooks/redux';

jest.mock('src/hooks/redux', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

const mockProfile = {
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

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      profile: profileSagaSlice.reducer,
    },
    preloadedState: {
      profile: {
        profile: mockProfile,
        loading: false,
        error: null,
        localAvatarUri: null,
        ...initialState,
      },
    },
  });
};

describe('ProfileScreen', () => {
  const mockDispatch = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (reduxHooks.useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  it('should render loading state', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      profile: mockProfile,
      loading: true,
      error: null,
      localAvatarUri: null,
    });
    
    const store = createMockStore({ loading: true });
    const { getByTestId } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );

    expect(() => getByTestId('activity-indicator')).not.toThrow();
  });

  it('should render profile data correctly', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: null,
      localAvatarUri: null,
    });
    
    const store = createMockStore();
    const { getByText } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );

    expect(getByText('testuser')).toBeTruthy();
    expect(getByText('100')).toBeTruthy(); // followers
    expect(getByText('50')).toBeTruthy(); // following
    expect(getByText('10')).toBeTruthy(); // repositories
  });

  it('should render empty when profile is null', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      profile: null,
      loading: false,
      error: null,
      localAvatarUri: null,
    });
    
    const store = createMockStore({ profile: null });
    const { toJSON } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );

    expect(toJSON()).toBeNull();
  });

  it('should render empty when there is an error', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: 'Failed to fetch profile',
      localAvatarUri: null,
    });
    
    const store = createMockStore({ error: 'Failed to fetch profile' });
    const { toJSON } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );

    expect(toJSON()).toBeNull();
  });

  it('should open modal when camera button is pressed', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: null,
      localAvatarUri: null,
    });
    
    const store = createMockStore();
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );

    const cameraButton = getByTestId('camera-button');
    fireEvent.press(cameraButton);

    expect(getByText('Choose Photo')).toBeTruthy();
    expect(getByText('Take Photo')).toBeTruthy();
    expect(getByText('Choose from Gallery')).toBeTruthy();
  });

  it('should close modal when cancel is pressed', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: null,
      localAvatarUri: null,
    });
    
    const store = createMockStore();
    const { getByTestId, getByText, queryByText } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );

    const cameraButton = getByTestId('camera-button');
    fireEvent.press(cameraButton);

    const cancelButton = getByText('Cancel');
    fireEvent.press(cancelButton);

    expect(queryByText('Choose Photo')).toBeNull();
  });

  it('should handle image selection from gallery', async () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: null,
      localAvatarUri: null,
    });
    
    const mockImageResponse = {
      assets: [{ uri: 'file://new-image.jpg' }],
    };
    
    (ImagePicker.launchImageLibrary as jest.Mock).mockImplementation((_options, callback) => {
      callback(mockImageResponse);
    });

    const store = createMockStore();
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );

    const cameraButton = getByTestId('camera-button');
    fireEvent.press(cameraButton);

    const galleryButton = getByText('Choose from Gallery');
    fireEvent.press(galleryButton);

    await waitFor(() => {
      expect(ImagePicker.launchImageLibrary).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(setLocalAvatarUri('file://new-image.jpg'));
    });
  });

  it('should handle camera capture', async () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: null,
      localAvatarUri: null,
    });
    
    const mockImageResponse = {
      assets: [{ uri: 'file://camera-image.jpg' }],
    };
    
    (ImagePicker.launchCamera as jest.Mock).mockImplementation((_options, callback) => {
      callback(mockImageResponse);
    });

    const store = createMockStore();
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );

    const cameraButton = getByTestId('camera-button');
    fireEvent.press(cameraButton);

    const takePhotoButton = getByText('Take Photo');
    fireEvent.press(takePhotoButton);

    await waitFor(() => {
      expect(ImagePicker.launchCamera).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(setLocalAvatarUri('file://camera-image.jpg'));
    });
  });

  it('should handle image picker cancellation', async () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: null,
      localAvatarUri: null,
    });
    
    const mockImageResponse = {
      didCancel: true,
    };
    
    (ImagePicker.launchImageLibrary as jest.Mock).mockImplementation((_options, callback) => {
      callback(mockImageResponse);
    });

    const store = createMockStore();
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );

    const cameraButton = getByTestId('camera-button');
    fireEvent.press(cameraButton);

    const galleryButton = getByText('Choose from Gallery');
    fireEvent.press(galleryButton);

    await waitFor(() => {
      expect(ImagePicker.launchImageLibrary).toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalledWith(setLocalAvatarUri(expect.anything()));
    });
  });

  it('should handle image picker error', async () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: null,
      localAvatarUri: null,
    });
    
    const mockImageResponse = {
      errorMessage: 'Permission denied',
    };
    
    jest.spyOn(Alert, 'alert');
    
    (ImagePicker.launchImageLibrary as jest.Mock).mockImplementation((_options, callback) => {
      callback(mockImageResponse);
    });

    const store = createMockStore();
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );

    const cameraButton = getByTestId('camera-button');
    fireEvent.press(cameraButton);

    const galleryButton = getByText('Choose from Gallery');
    fireEvent.press(galleryButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Permission denied');
    });
  });

  it('should display local avatar when set', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: null,
      localAvatarUri: 'file://local-avatar.jpg',
    });
    
    const store = createMockStore({ localAvatarUri: 'file://local-avatar.jpg' });
    const { getByTestId } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );

    const avatar = getByTestId('avatar-image');
    expect(avatar.props.source.uri).toBe('file://local-avatar.jpg');
  });

  it('should fallback to profile avatar when local avatar is not set', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: null,
      localAvatarUri: null,
    });
    
    const store = createMockStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );

    const avatar = getByTestId('avatar-image');
    expect(avatar.props.source.uri).toBe('https://example.com/avatar.jpg');
  });

  it('should match snapshot with profile data', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: null,
      localAvatarUri: null,
    });
    
    const store = createMockStore();
    const { toJSON } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot in loading state', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      profile: mockProfile,
      loading: true,
      error: null,
      localAvatarUri: null,
    });
    
    const store = createMockStore({ loading: true });
    const { toJSON } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with local avatar', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: null,
      localAvatarUri: 'file://local-avatar.jpg',
    });
    
    const store = createMockStore({ localAvatarUri: 'file://local-avatar.jpg' });
    const { toJSON } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with modal open', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: null,
      localAvatarUri: null,
    });
    
    const store = createMockStore();
    const { getByTestId, toJSON } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );

    const cameraButton = getByTestId('camera-button');
    fireEvent.press(cameraButton);

    expect(toJSON()).toMatchSnapshot();
  });
});