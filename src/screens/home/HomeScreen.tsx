import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { colors } from '../../themes/colors';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  fetchRepositoriesRequest,
  fetchMoreRepositoriesRequest,
  fetchSearchRepositoriesRequest,
  clearSearchResults,
} from '../../store/slices/repositorySagaSlice';
import { IRepository } from '../../types/repository';
import CardRepository from './components/CardRepository';
import ItemSeparator from '../../components/ItemSeparator';
import FloatingActionButton from './components/FloatingActionButton';
import SearchBar from './components/SearchBar';
import { TSortOrder } from '../../types/home';
import SortFilterModal from './components/SortFilterModal';
import { ASC } from '../../utils/constants';

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const {
    repositories,
    searchRepositories,
    loading,
    loadingMore,
    searchLoading,
    error,
    hasMore,
  } = useAppSelector(state => state.repository);

  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<TSortOrder>(ASC);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchRepositoriesRequest({ since: 0 }));
  }, [dispatch]);

  const sortedData = useMemo(() => {
    const dataToSort = showSearchResults ? searchRepositories : repositories;
    const sorted = [...dataToSort].sort((a, b) => {
      if (sortOrder === ASC) {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    return sorted;
  }, [showSearchResults, searchRepositories, repositories, sortOrder]);

  const handleRefresh = () => {
    if (showSearchResults) {
      handleSubmitSearch(searchQuery);
    } else {
      dispatch(fetchRepositoriesRequest({ since: 0 }));
    }
  };

  const handleLoadMore = () => {
    if (!showSearchResults && !loadingMore && hasMore && !loading) {
      dispatch(fetchMoreRepositoriesRequest());
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      setIsSearching(true);
      dispatch(fetchSearchRepositoriesRequest({ query }));
    }
  };
  const handleSubmitSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(true);
    setIsSearching(true);
    if (query.trim().length > 0) {
      dispatch(fetchSearchRepositoriesRequest({ query }));
    }
  };

  const handleSelectSuggestion = (repository: IRepository) => {
    setSearchQuery(repository.name);
    setShowSearchResults(true);
    setIsSearching(true);
    dispatch(fetchSearchRepositoriesRequest({ query: repository.name }));
  };

  const handleClearSearch = () => {
    setIsSearching(false);
    setShowSearchResults(false);
    setSearchQuery('');
    dispatch(clearSearchResults());
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSort = (order: TSortOrder) => {
    setSortOrder(order);
  };

  const renderItem = ({ item }: { item: IRepository }) => (
    <CardRepository item={item} />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.shade800} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading && !showSearchResults) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.shade800} />
          <Text style={styles.loadingText}>Loading repositories...</Text>
        </View>
      );
    }

    if (showSearchResults && searchLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.shade800} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      );
    }

    if (
      showSearchResults &&
      searchRepositories.length === 0 &&
      !searchLoading
    ) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.noDataText}>No Data Found</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        onSearch={handleSearch}
        onSelectSuggestion={handleSelectSuggestion}
        onClear={handleClearSearch}
        onSubmitSearch={handleSubmitSearch}
        suggestions={
          isSearching && !showSearchResults ? searchRepositories : []
        }
        loading={searchLoading}
        placeholder="Search GitHub repository..."
      />

      <FlatList
        data={sortedData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ItemSeparatorComponent={ItemSeparator}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        refreshControl={
          <RefreshControl
            refreshing={
              (loading && repositories.length === 0) ||
              (searchLoading && showSearchResults)
            }
            onRefresh={handleRefresh}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
      />

      <FloatingActionButton onPress={handleOpenModal} />

      <SortFilterModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSort={handleSort}
        currentOrder={sortOrder}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brokenWhite,
  },
  header: {
    backgroundColor: colors.white,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flatList: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  errorText: {
    fontSize: 16,
    color: colors.shade800,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: colors.shade75,
  },
  noDataText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.shade800,
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    color: colors.shade75,
    textAlign: 'center',
  },
});

export default HomeScreen;
