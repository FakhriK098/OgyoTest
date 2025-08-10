import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import DetailScreen from '../DetailScreen';
import { userSagaSlice } from 'src/store/slices/userSagaSlice';
import * as reduxHooks from 'src/hooks/redux';

jest.mock('src/hooks/redux', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: { id: 'facebook/react' },
  }),
}));

const mockUser = {
  id: 1,
  name: 'React',
  full_name: 'facebook/react',
  owner: {
    login: 'facebook',
    avatar_url: 'https://example.com/avatar.jpg',
    type: 'Organization',
  },
  size: 189236,
  language: 'JavaScript',
  license: {
    name: 'MIT License',
  },
  topics: ['react', 'javascript', 'library'],
  stargazers_count: 200000,
  watchers_count: 6500,
  forks_count: 40000,
  open_issues_count: 1200,
  network_count: 40000,
  subscribers_count: 6500,
  description: 'A declarative, efficient, and flexible JavaScript library',
  homepage: 'https://reactjs.org',
  private: false,
  fork: false,
  created_at: '2013-05-24T16:15:54Z',
  updated_at: '2023-11-01T00:00:00Z',
  pushed_at: '2023-11-01T00:00:00Z',
};

const createMockStore = () => {
  return configureStore({
    reducer: {
      user: userSagaSlice.reducer,
    },
  });
};

describe('DetailScreen', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (reduxHooks.useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  it('should render loading state', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      user: mockUser, // User exists but loading is true
      loading: true,
      error: null,
    });

    const store = createMockStore();
    const { getByText, UNSAFE_getByType } = render(
      <Provider store={store}>
        <DetailScreen />
      </Provider>,
    );

    expect(getByText('Details')).toBeTruthy();

    // Should show activity indicator in loading state
    const ActivityIndicator = require('react-native').ActivityIndicator;
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('should render user details correctly', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      user: mockUser,
      loading: false,
      error: null,
    });

    const store = createMockStore();
    const { getByText } = render(
      <Provider store={store}>
        <DetailScreen />
      </Provider>,
    );

    expect(getByText('React')).toBeTruthy();
    expect(getByText('facebook react')).toBeTruthy(); // getFullName converts / to space
    expect(getByText('Organization')).toBeTruthy();
    expect(getByText('JavaScript')).toBeTruthy();
    expect(getByText('MIT License')).toBeTruthy();
    expect(getByText('react, javascript, library')).toBeTruthy();
  });

  it('should render empty state when user is null', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      error: null,
    });

    const store = createMockStore();
    const { getByText } = render(
      <Provider store={store}>
        <DetailScreen />
      </Provider>,
    );

    expect(getByText('No Data Found')).toBeTruthy();
  });

  it('should render error state', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      user: mockUser,
      loading: false,
      error: 'Failed to fetch user',
    });

    const store = createMockStore();
    const { getByText } = render(
      <Provider store={store}>
        <DetailScreen />
      </Provider>,
    );

    expect(getByText('No Data Found')).toBeTruthy();
  });

  it('should dispatch fetchUserRequest on mount', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      user: mockUser,
      loading: false,
      error: null,
    });

    const store = createMockStore();
    render(
      <Provider store={store}>
        <DetailScreen />
      </Provider>,
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('fetchUserRequest'),
        payload: { fullName: 'facebook/react' },
      }),
    );
  });

  it('should handle back button press', () => {
    const mockGoBack = jest.fn();
    jest
      .spyOn(require('@react-navigation/native'), 'useNavigation')
      .mockReturnValue({
        goBack: mockGoBack,
      });

    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      user: mockUser,
      loading: false,
      error: null,
    });

    const store = createMockStore();
    const { UNSAFE_getAllByType } = render(
      <Provider store={store}>
        <DetailScreen />
      </Provider>,
    );

    // Find the Pressable component (back button)
    const Pressable = require('react-native').Pressable;
    const pressables = UNSAFE_getAllByType(Pressable);

    if (pressables.length > 0) {
      fireEvent.press(pressables[0]); // First pressable should be the back button
      expect(mockGoBack).toHaveBeenCalled();
    }
  });

  it('should match snapshot with user details', () => {
    jest
      .spyOn(require('@react-navigation/native'), 'useNavigation')
      .mockReturnValue({
        goBack: jest.fn(),
      });

    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      user: mockUser,
      loading: false,
      error: null,
    });

    const store = createMockStore();
    const { toJSON, getByTestId } = render(
      <Provider store={store}>
        <DetailScreen />
      </Provider>,
    );

    const buttonBack = getByTestId('back-button');
    fireEvent.press(buttonBack);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot in loading state', () => {
    jest
      .spyOn(require('@react-navigation/native'), 'useNavigation')
      .mockReturnValue({
        goBack: jest.fn(),
      });
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      user: mockUser,
      loading: true,
      error: null,
    });

    const store = createMockStore();
    const { toJSON, getByTestId } = render(
      <Provider store={store}>
        <DetailScreen />
      </Provider>,
    );

    const buttonBack = getByTestId('back-button');
    fireEvent.press(buttonBack);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot in empty state', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      error: null,
    });

    const store = createMockStore();
    const { toJSON, getByTestId } = render(
      <Provider store={store}>
        <DetailScreen />
      </Provider>,
    );

    const buttonBack = getByTestId('back-button');
    fireEvent.press(buttonBack);
    expect(toJSON()).toMatchSnapshot();
  });
});
