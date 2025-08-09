import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { ISearchBarProps } from '../../../types/home';
import { IRepository } from '../../../types/repository';
import { colors } from '../../../themes/colors';

const SearchBar: React.FC<ISearchBarProps> = ({
  onSearch,
  onSelectSuggestion,
  onClear,
  suggestions,
  loading,
  placeholder = 'Search repository...',
  onSubmitSearch,
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const handleTextChange = useCallback(
    (text: string) => {
      setQuery(text);

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      if (text.trim().length > 0) {
        setShowSuggestions(true);
        const timer = setTimeout(() => {
          onSearch(text.trim());
        }, 500);
        setDebounceTimer(timer);
      } else {
        setShowSuggestions(false);
        onClear();
      }
    },
    [debounceTimer, onSearch, onClear],
  );

  const handleSelectSuggestion = useCallback(
    (item: IRepository) => {
      setQuery(item.name);
      setShowSuggestions(false);
      onSelectSuggestion(item);
      Keyboard.dismiss();
    },
    [onSelectSuggestion],
  );

  const handleClear = useCallback(() => {
    setQuery('');
    setShowSuggestions(false);
    onClear();
  }, [onClear]);

  const handleSubmitEditing = useCallback(() => {
    if (query.trim().length > 0) {
      setShowSuggestions(false);
      onSubmitSearch(query.trim());
      Keyboard.dismiss();
    }
  }, [query, onSubmitSearch]);

  const renderSuggestion = ({ item }: { item: IRepository }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectSuggestion(item)}
    >
      <Text style={styles.suggestionName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderSuggestionSeparator = () => (
    <View style={styles.suggestionSeparator} />
  );

  const renderEmptySuggestions = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.shade800} />
          <Text style={styles.loadingText}>Loading suggestions...</Text>
        </View>
      );
    }

    if (query.trim().length > 0 && !loading && suggestions.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No suggestions found</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={placeholder}
              value={query}
              onChangeText={handleTextChange}
              onFocus={() =>
                query.trim().length > 0 && setShowSuggestions(true)
              }
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              onSubmitEditing={handleSubmitEditing}
            />
            {query.length > 0 && (
              <TouchableOpacity
                onPress={handleClear}
                style={styles.clearButton}
              >
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {showSuggestions && query.trim().length > 0 && (
          <TouchableWithoutFeedback onPress={() => setShowSuggestions(false)}>
            <View style={styles.suggestionsOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.suggestionsContainer}>
                  <FlatList
                    data={suggestions.slice(0, 8)}
                    renderItem={renderSuggestion}
                    keyExtractor={item => item.id.toString()}
                    ItemSeparatorComponent={renderSuggestionSeparator}
                    ListEmptyComponent={renderEmptySuggestions}
                    keyboardShouldPersistTaps="always"
                    style={styles.suggestionsList}
                    contentContainerStyle={styles.suggestionsContent}
                    scrollEnabled={suggestions.length > 5}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    zIndex: 1000,
  },
  searchContainer: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.shade75,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.shade800,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 18,
    color: colors.shade800,
  },
  suggestionsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -1000,
    zIndex: 1001,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 64,
    left: 8,
    right: 8,
    backgroundColor: colors.white,
    borderRadius: 8,
    maxHeight: 280,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  suggestionsList: {
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  suggestionsContent: {
    paddingVertical: 4,
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.white,
  },
  suggestionName: {
    fontSize: 15,
    color: colors.black,
    fontWeight: '500',
  },
  suggestionFullName: {
    fontSize: 13,
    color: colors.shade800,
    marginBottom: 2,
  },
  suggestionDescription: {
    fontSize: 12,
    color: colors.shade75,
    lineHeight: 16,
  },
  suggestionSeparator: {
    height: 1,
    backgroundColor: colors.brokenWhite,
    marginHorizontal: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.shade75,
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.shade800,
    marginBottom: 4,
  },
  noDataSubtext: {
    fontSize: 12,
    color: colors.shade75,
  },
});

export default SearchBar;
