import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { colors } from '../../../themes/colors';
import { ISortFilterModalProps, TSortOrder } from '../../../types/home';
import { ASC, DESC } from '../../../utils/constants';

const SortFilterModal: React.FC<ISortFilterModalProps> = ({
  visible,
  onClose,
  onSort,
  currentOrder,
}) => {
  const handleSort = (order: TSortOrder) => {
    onSort(order);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Sort Repositories</Text>

              <TouchableOpacity
                style={[
                  styles.option,
                  currentOrder === ASC && styles.selectedOption,
                ]}
                onPress={() => handleSort(ASC)}
              >
                <Text
                  style={[
                    styles.optionText,
                    currentOrder === ASC && styles.selectedText,
                  ]}
                >
                  Ascending (A-Z)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.option,
                  currentOrder === DESC && styles.selectedOption,
                ]}
                onPress={() => handleSort(DESC)}
              >
                <Text
                  style={[
                    styles.optionText,
                    currentOrder === DESC && styles.selectedText,
                  ]}
                >
                  Descending (Z-A)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 20,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.brokenWhite,
  },
  selectedOption: {
    backgroundColor: colors.shade75,
    borderWidth: 1,
    borderColor: colors.shade800,
  },
  optionText: {
    fontSize: 16,
    color: colors.shade800,
  },
  selectedText: {
    fontWeight: '600',
    color: colors.black,
  },
  closeButton: {
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: colors.shade800,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '600',
  },
});

export default SortFilterModal;
