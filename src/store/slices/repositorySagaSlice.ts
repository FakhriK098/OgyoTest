import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRepository } from '../../types/repository';

interface IRepositoryState {
  repositories: IRepository[];
  searchRepositories: IRepository[];
  loading: boolean;
  loadingMore: boolean;
  searchLoading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  nextSince: number | null;
}

const initialState: IRepositoryState = {
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

const repositorySagaSlice = createSlice({
  name: 'repository',
  initialState,
  reducers: {
    fetchRepositoriesRequest: (state, _action: PayloadAction<{ since?: number }>) => {
      state.loading = true;
      state.error = null;
    },
    fetchRepositoriesSuccess: (state, action: PayloadAction<{
      repositories: IRepository[];
      nextSince: number | null;
      hasMore: boolean;
    }>) => {
      state.loading = false;
      state.repositories = action.payload.repositories;
      state.nextSince = action.payload.nextSince;
      state.hasMore = action.payload.hasMore;
      state.error = null;
    },
    fetchRepositoriesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchMoreRepositoriesRequest: (state) => {
      state.loadingMore = true;
      state.error = null;
    },
    fetchMoreRepositoriesSuccess: (state, action: PayloadAction<{
      repositories: IRepository[];
      nextSince: number | null;
      hasMore: boolean;
    }>) => {
      state.loadingMore = false;
      state.repositories = [...state.repositories, ...action.payload.repositories];
      state.nextSince = action.payload.nextSince;
      state.hasMore = action.payload.hasMore;
      state.error = null;
    },
    fetchMoreRepositoriesFailure: (state, action: PayloadAction<string>) => {
      state.loadingMore = false;
      state.error = action.payload;
    },
    fetchSearchRepositoriesRequest: (state, _action: PayloadAction<{ query: string }>) => {
      state.searchLoading = true;
      state.error = null;
    },
    fetchSearchRepositoriesSuccess: (state, action: PayloadAction<{
      repositories: IRepository[];
    }>) => {
      state.searchLoading = false;
      state.searchRepositories = action.payload.repositories;
      state.error = null;
    },
    fetchSearchRepositoriesFailure: (state, action: PayloadAction<string>) => {
      state.searchLoading = false;
      state.error = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchRepositories = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
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
} = repositorySagaSlice.actions;

export default repositorySagaSlice.reducer;