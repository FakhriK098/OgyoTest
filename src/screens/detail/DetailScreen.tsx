import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, images } from '@themes/index';
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import { DetailNavigationParams } from 'src/navigation/types';
import { fetchUserRequest } from 'src/store/slices/userSagaSlice';
import Label from '../../components/Label';
import { getFullName } from 'src/utils/strings';
import { formatBytes } from 'src/utils/numbers';
import Avatar from '@components/Avatar';
const DetailScreen = () => {
  const { goBack } = useNavigation();
  const { params } = useRoute<DetailNavigationParams>();
  const dispatch = useAppDispatch();

  const { user, loading, error } = useAppSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchUserRequest({ fullName: params.id }));
  }, [dispatch, params.id]);

  if (!user || error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable testID="back-button" onPress={() => goBack()}>
            <Image source={images.back} style={styles.iconBack} />
          </Pressable>
          <Text style={styles.headerTitle}>Details</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.noDataText}>No Data Found</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable testID="back-button" onPress={() => goBack()}>
            <Image source={images.back} style={styles.iconBack} />
          </Pressable>
          <Text style={styles.headerTitle}>Details</Text>
        </View>
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.shade800} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable testID="back-button" onPress={() => goBack()}>
          <Image source={images.back} style={styles.iconBack} />
        </Pressable>
        <Text style={styles.headerTitle}>Details</Text>
      </View>
      <ScrollView>
        <View style={styles.mainContainer}>
          <View style={styles.mainContainerAvatar}>
            <Avatar url={user.owner.avatar_url} width={80} height={80} />
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{user.name}</Text>
            <Label title="Owner" value={getFullName(user.full_name)} />
            <Label title="Type" value={getFullName(user.owner.type)} />
            <Label title="Size" value={formatBytes(user.size)} />
            <Label title="Language" value={user.language} />
            <Label title="License" value={user.license?.name} />
            <Label title="Topic" value={user.topics.join(', ')} />
            <Label
              title="Stargazers Count"
              value={user.stargazers_count.toString()}
            />
            <Label
              title="Watchers Count"
              value={user.watchers_count.toString()}
            />
            <Label title="Forks Count" value={user.forks_count.toString()} />
            <Label
              title="Open Issues Count"
              value={user.open_issues_count.toString()}
            />
            <Label
              title="Network Count"
              value={user.network_count.toString()}
            />
            <Label
              title="Subscribers Count"
              value={user.subscribers_count.toString()}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brokenWhite,
  },
  header: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.shade75,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
  },
  iconBack: {
    width: 20,
    height: 20,
  },
  mainContainerAvatar: {
    alignItems: 'center',
    zIndex: 999,
  },
  mainContainer: {
    justifyContent: 'center',
    marginTop: 16,
  },
  contentContainer: {
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 8,
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    marginTop: -40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.shade800,
    marginBottom: 8,
  },
});

export default DetailScreen;
