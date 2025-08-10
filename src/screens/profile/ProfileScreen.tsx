import images from '@assets/images';
import Avatar from '@components/Avatar';
import Label from '@components/Label';
import { colors } from '@themes/colors';
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ActivityIndicator,
  Pressable,
  Image,
  Alert,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import { fetchProfileRequest, setLocalAvatarUri } from 'src/store/slices/profileSagaSlice';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  ImageLibraryOptions,
  CameraOptions,
} from 'react-native-image-picker';

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const { profile, loading, error, localAvatarUri } = useAppSelector(state => state.profile);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchProfileRequest());
  }, [dispatch]);

  const handleImageResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) {
      return;
    }

    if (response.errorMessage) {
      Alert.alert('Error', response.errorMessage);
      return;
    }

    if (response.assets && response.assets[0]) {
      dispatch(setLocalAvatarUri(response.assets[0].uri || null));
    }
    setModalVisible(false);
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to take photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();

    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Camera permission is required to take photos.',
        [{ text: 'OK' }],
      );
      return;
    }

    const options: CameraOptions = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 1,
    };
    
    launchCamera(options, handleImageResponse);
  };

  const handleChooseFromGallery = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 1,
    };
    
    launchImageLibrary(options, handleImageResponse);
  };

  const handlePressCamera = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  if (!profile || error) {
    return <></>;
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <ActivityIndicator testID="activity-indicator" size="large" color={colors.shade800} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.mainContainerAvatar}>
          <Pressable testID="camera-button" onPress={handlePressCamera}>
            <Avatar
              url={localAvatarUri || profile.avatar_url}
              width={100}
              height={100}
            />
            <View style={styles.containerCamera}>
              <Image source={images.camera} />
            </View>
          </Pressable>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{profile.login}</Text>
          <Label title="Followers" value={profile.followers.toString()} />
          <Label title="Following" value={profile.following.toString()} />
          <Label title="Repositories" value={profile.public_repos.toString()} />
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Choose Photo</Text>

                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={handleTakePhoto}
                >
                  <Text style={styles.modalOptionText}>Take Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={handleChooseFromGallery}
                >
                  <Text style={styles.modalOptionText}>
                    Choose from Gallery
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalOption, styles.modalCancelButton]}
                  onPress={handleCloseModal}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brokenWhite,
  },
  mainContainer: {
    justifyContent: 'center',
    marginTop: 16,
  },
  mainContainerAvatar: {
    alignItems: 'center',
  },
  contentContainer: {
    marginTop: 16,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
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
  containerCamera: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 320,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: colors.brokenWhite,
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    color: colors.shade800,
  },
  modalCancelButton: {
    backgroundColor: colors.shade75,
    marginTop: 10,
  },
  modalCancelText: {
    fontSize: 16,
    color: colors.shade800,
    fontWeight: '600',
  },
});

export default ProfileScreen;
