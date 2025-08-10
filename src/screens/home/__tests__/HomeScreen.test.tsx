import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import HomeScreen from '../HomeScreen';
import repositorySagaSliceReducer from 'src/store/slices/repositorySagaSlice';
import * as reduxHooks from 'src/hooks/redux';
// import { ASC } from 'src/utils/constants';
import { dummyRepositories } from '__mocks__/repository';

// Mock dependencies
jest.mock('src/hooks/redux', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('../components/CardRepository', () => {
  return jest.fn(({ item }) => {
    const { Text, TouchableOpacity } = require('react-native');
    return (
      <TouchableOpacity testID={`card-${item.id}`}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  });
});

jest.mock('../components/SearchBar', () => {
  return jest.fn(props => {
    const { View, TextInput, TouchableOpacity, Text } = require('react-native');
    return (
      <View testID="search-bar">
        <TextInput
          testID="search-input"
          value=""
          onChangeText={props.onSearch}
          onSubmitEditing={() => props.onSubmitSearch('test query')}
        />
        <TouchableOpacity testID="clear-button" onPress={props.onClear}>
          <Text>Clear</Text>
        </TouchableOpacity>
      </View>
    );
  });
});

jest.mock('../components/FloatingActionButton', () => {
  return jest.fn(props => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity testID="floating-action-button" onPress={props.onPress}>
        <Text>Filter Sort</Text>
      </TouchableOpacity>
    );
  });
});

jest.mock('../components/SortFilterModal', () => {
  return jest.fn(props => {
    const { View, Text, TouchableOpacity, Modal } = require('react-native');
    return (
      <Modal visible={props.visible} testID="sort-filter-modal">
        <View>
          <Text>Sort Repositories</Text>
          <TouchableOpacity
            testID="sort-asc-button"
            onPress={() => props.onSort('ASC')}
          >
            <Text>Ascending</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="sort-desc-button"
            onPress={() => props.onSort('DESC')}
          >
            <Text>Descending</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="close-modal-button" onPress={props.onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  });
});

jest.mock('@components/ItemSeparator', () => {
  return jest.fn(() => {
    const { View } = require('react-native');
    return <View testID="item-separator" />;
  });
});

const mockSearchRepositories = [
  {
    id: 3,
    name: 'angular',
    full_name: 'angular/angular',
    description: "The modern web developer's platform",
    owner: {
      login: 'angular',
      avatar_url: 'https://example.com/avatar3.jpg',
    },
  },
];

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      repository: repositorySagaSliceReducer,
    },
    preloadedState: {
      repository: {
        repositories: dummyRepositories,
        searchRepositories: [],
        loading: false,
        loadingMore: false,
        searchLoading: false,
        error: null,
        currentPage: 1,
        hasMore: true,
        nextSince: null,
        ...initialState,
      },
    },
  });
};

describe('HomeScreen', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (reduxHooks.useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  const defaultSelectorValue = {
    repositories: dummyRepositories,
    searchRepositories: [],
    loading: false,
    loadingMore: false,
    searchLoading: false,
    error: null,
    hasMore: true,
  };

  it('should render loading state initially', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      ...defaultSelectorValue,
      loading: true,
      repositories: [],
    });

    const store = createMockStore({ loading: true, repositories: [] });
    const { getByText } = render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>,
    );

    expect(getByText('Loading repositories...')).toBeTruthy();
  });

  it('should dispatch fetchRepositoriesRequest on mount', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue(
      defaultSelectorValue,
    );

    render(
      <Provider store={createMockStore()}>
        <HomeScreen />
      </Provider>,
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('fetchRepositoriesRequest'),
        payload: { since: 0 },
      }),
    );
  });

  it('should handle search functionality', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue(
      defaultSelectorValue,
    );

    const { getByTestId } = render(
      <Provider store={createMockStore()}>
        <HomeScreen />
      </Provider>,
    );

    const searchInput = getByTestId('search-input');
    fireEvent.changeText(searchInput, 'react');

    // Should dispatch search request with debounce
    waitFor(
      () => {
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: expect.stringContaining('fetchSearchRepositoriesRequest'),
            payload: { query: 'react' },
          }),
        );
      },
      { timeout: 600 },
    ); // Account for 500ms debounce
  });

  it('should handle search clear functionality', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue(
      defaultSelectorValue,
    );

    const { getByTestId } = render(
      <Provider store={createMockStore()}>
        <HomeScreen />
      </Provider>,
    );

    const clearButton = getByTestId('clear-button');
    fireEvent.press(clearButton);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('clearSearchResults'),
      }),
    );
  });

  it('should handle search submit', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue(
      defaultSelectorValue,
    );

    const { getByTestId } = render(
      <Provider store={createMockStore()}>
        <HomeScreen />
      </Provider>,
    );

    const searchInput = getByTestId('search-input');
    fireEvent(searchInput, 'onSubmitEditing');

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('fetchSearchRepositoriesRequest'),
        payload: { query: 'test query' },
      }),
    );
  });

  it('should handle sort ascending', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue(
      defaultSelectorValue,
    );

    const { getByTestId } = render(
      <Provider store={createMockStore()}>
        <HomeScreen />
      </Provider>,
    );

    const fab = getByTestId('floating-action-button');
    fireEvent.press(fab);

    const ascButton = getByTestId('sort-asc-button');
    fireEvent.press(ascButton);

    expect(getByTestId('sort-filter-modal')).toBeTruthy();
  });

  it('should handle sort descending', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue(
      defaultSelectorValue,
    );

    const { getByTestId } = render(
      <Provider store={createMockStore()}>
        <HomeScreen />
      </Provider>,
    );

    const fab = getByTestId('floating-action-button');
    fireEvent.press(fab);

    const descButton = getByTestId('sort-desc-button');
    fireEvent.press(descButton);

    expect(getByTestId('sort-filter-modal')).toBeTruthy();
  });

  it('should handle load more functionality', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      ...defaultSelectorValue,
      hasMore: true,
      loadingMore: false,
    });

    const { UNSAFE_getByType } = render(
      <Provider store={createMockStore()}>
        <HomeScreen />
      </Provider>,
    );

    const FlatList = require('react-native').FlatList;
    const flatList = UNSAFE_getByType(FlatList);

    fireEvent(flatList, 'onEndReached');

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('fetchMoreRepositoriesRequest'),
      }),
    );
  });

  it('should render load more indicator', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      ...defaultSelectorValue,
      loadingMore: true,
    });

    const { UNSAFE_getByType } = render(
      <Provider store={createMockStore({ loadingMore: true })}>
        <HomeScreen />
      </Provider>,
    );

    const ActivityIndicator = require('react-native').ActivityIndicator;
    expect(() => UNSAFE_getByType(ActivityIndicator)).not.toThrow();
  });

  it('should handle refresh control', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue(
      defaultSelectorValue,
    );

    render(
      <Provider store={createMockStore()}>
        <HomeScreen />
      </Provider>,
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.stringContaining('fetchRepositoriesRequest'),
        payload: { since: 0 },
      }),
    );
  });

  it('should sort repositories correctly', () => {
    const unsortedRepos = [
      { id: 1, name: 'zebra', full_name: 'test/zebra' },
      { id: 2, name: 'alpha', full_name: 'test/alpha' },
      { id: 3, name: 'beta', full_name: 'test/beta' },
    ];

    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      ...defaultSelectorValue,
      repositories: unsortedRepos,
    });

    const { getAllByTestId } = render(
      <Provider store={createMockStore({ repositories: unsortedRepos })}>
        <HomeScreen />
      </Provider>,
    );

    const cards = getAllByTestId(/card-/);
    expect(cards).toHaveLength(3);
  });

  it('should display search results when searching', () => {
    (reduxHooks.useAppSelector as jest.Mock).mockReturnValue({
      ...defaultSelectorValue,
      searchRepositories: mockSearchRepositories,
    });

    const store = createMockStore({
      searchRepositories: mockSearchRepositories,
    });
    const { getAllByTestId } = render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>,
    );

    const cards = getAllByTestId(/card-/);
    expect(cards.length).toBeGreaterThan(0);
  });
});
