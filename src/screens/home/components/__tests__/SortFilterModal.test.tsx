import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SortFilterModal from '../SortFilterModal';
import { ISortFilterModalProps, TSortOrder } from 'src/types/home';
import { ASC, DESC } from 'src/utils/constants';

describe('SortFilterModal', () => {
  const defaultProps: ISortFilterModalProps = {
    visible: false,
    onClose: jest.fn(),
    onSort: jest.fn(),
    currentOrder: ASC,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly when visible', () => {
    const props = { ...defaultProps, visible: true };
    const { getByText } = render(<SortFilterModal {...props} />);

    expect(getByText('Sort Repositories')).toBeTruthy();
    expect(getByText('Ascending (A-Z)')).toBeTruthy();
    expect(getByText('Descending (Z-A)')).toBeTruthy();
    expect(getByText('Close')).toBeTruthy();
  });

  it('should not render when not visible', () => {
    const props = { ...defaultProps, visible: false };
    const { queryByText } = render(<SortFilterModal {...props} />);
    expect(queryByText('Sort Repositories')).toBeNull();
  });

  it('should highlight ascending option when currentOrder is ASC', () => {
    const props = { ...defaultProps, visible: true, currentOrder: ASC };
    const { getByText } = render(<SortFilterModal {...props} />);

    const ascendingOption = getByText('Ascending (A-Z)');
    expect(ascendingOption).toBeTruthy();
  });

  it('should highlight descending option when currentOrder is DESC', () => {
    const props = { ...defaultProps, visible: true, currentOrder: DESC };
    const { getByText } = render(<SortFilterModal {...props} />);

    const descendingOption = getByText('Descending (Z-A)');
    expect(descendingOption).toBeTruthy();
  });

  it('should call onSort with ASC and close modal when ascending is selected', () => {
    const onSortMock = jest.fn();
    const onCloseMock = jest.fn();
    const props = {
      ...defaultProps,
      visible: true,
      currentOrder: DESC,
      onSort: onSortMock,
      onClose: onCloseMock,
    };

    const { getByText } = render(<SortFilterModal {...props} />);

    const ascendingOption = getByText('Ascending (A-Z)');
    fireEvent.press(ascendingOption);

    expect(onSortMock).toHaveBeenCalledWith(ASC);
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('should call onSort with DESC and close modal when descending is selected', () => {
    const onSortMock = jest.fn();
    const onCloseMock = jest.fn();
    const props = {
      ...defaultProps,
      visible: true,
      currentOrder: ASC,
      onSort: onSortMock,
      onClose: onCloseMock,
    };

    const { getByText } = render(<SortFilterModal {...props} />);

    const descendingOption = getByText('Descending (Z-A)');
    fireEvent.press(descendingOption);

    expect(onSortMock).toHaveBeenCalledWith(DESC);
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('should call onClose when close button is pressed', () => {
    const onCloseMock = jest.fn();
    const props = { ...defaultProps, visible: true, onClose: onCloseMock };

    const { getByText } = render(<SortFilterModal {...props} />);

    const closeButton = getByText('Close');
    fireEvent.press(closeButton);

    expect(onCloseMock).toHaveBeenCalled();
  });

  it('should call onClose when modal backdrop is pressed', () => {
    const onCloseMock = jest.fn();
    const props = { ...defaultProps, visible: true, onClose: onCloseMock };

    const { UNSAFE_getAllByType } = render(<SortFilterModal {...props} />);

    const TouchableWithoutFeedback =
      require('react-native').TouchableWithoutFeedback;
    const touchables = UNSAFE_getAllByType(TouchableWithoutFeedback);

    if (touchables.length > 0) {
      fireEvent.press(touchables[0]);
      expect(onCloseMock).toHaveBeenCalled();
    }
  });

  it('should handle onRequestClose callback', () => {
    const onCloseMock = jest.fn();
    const props = { ...defaultProps, visible: true, onClose: onCloseMock };

    const { UNSAFE_getByType } = render(<SortFilterModal {...props} />);

    const Modal = require('react-native').Modal;
    const modal = UNSAFE_getByType(Modal);

    if (modal.props.onRequestClose) {
      modal.props.onRequestClose();
      expect(onCloseMock).toHaveBeenCalled();
    }
  });

  it('should prevent event bubbling on modal content touch', () => {
    const onCloseMock = jest.fn();
    const props = { ...defaultProps, visible: true, onClose: onCloseMock };

    const { getByText } = render(<SortFilterModal {...props} />);

    const modalTitle = getByText('Sort Repositories');
    fireEvent.press(modalTitle);

    expect(onCloseMock).toHaveBeenCalled();
  });

  it('should handle multiple rapid presses on sort options', () => {
    const onSortMock = jest.fn();
    const onCloseMock = jest.fn();
    const props = {
      ...defaultProps,
      visible: true,
      onSort: onSortMock,
      onClose: onCloseMock,
    };

    const { getByText } = render(<SortFilterModal {...props} />);

    const ascendingOption = getByText('Ascending (A-Z)');

    fireEvent.press(ascendingOption);
    fireEvent.press(ascendingOption);
    fireEvent.press(ascendingOption);

    expect(onSortMock).toHaveBeenCalledTimes(3);
    expect(onCloseMock).toHaveBeenCalledTimes(3);
  });

  it('should handle switching between sort options', () => {
    const onSortMock = jest.fn();
    const onCloseMock = jest.fn();
    let props = {
      ...defaultProps,
      visible: true,
      currentOrder: ASC as TSortOrder,
      onSort: onSortMock,
      onClose: onCloseMock,
    };

    const { getByText, rerender } = render(<SortFilterModal {...props} />);

    const descendingOption = getByText('Descending (Z-A)');
    fireEvent.press(descendingOption);

    expect(onSortMock).toHaveBeenCalledWith(DESC);
    expect(onCloseMock).toHaveBeenCalled();

    jest.clearAllMocks();
    props = { ...props, currentOrder: DESC };
    rerender(<SortFilterModal {...props} />);

    const ascendingOption = getByText('Ascending (A-Z)');
    fireEvent.press(ascendingOption);

    expect(onSortMock).toHaveBeenCalledWith(ASC);
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('should maintain modal visibility state correctly', () => {
    let props = { ...defaultProps, visible: false };
    const { queryByText, rerender } = render(<SortFilterModal {...props} />);

    expect(queryByText('Sort Repositories')).toBeNull();

    props = { ...props, visible: true };
    rerender(<SortFilterModal {...props} />);

    expect(queryByText('Sort Repositories')).toBeTruthy();

    props = { ...props, visible: false };
    rerender(<SortFilterModal {...props} />);

    expect(queryByText('Sort Repositories')).toBeNull();
  });

  it('should display correct modal animation type', () => {
    const props = { ...defaultProps, visible: true };
    const { UNSAFE_getByType } = render(<SortFilterModal {...props} />);

    const Modal = require('react-native').Modal;
    const modal = UNSAFE_getByType(Modal);

    expect(modal.props.animationType).toBe('fade');
    expect(modal.props.transparent).toBe(true);
  });

  it('should handle edge cases with undefined callbacks', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const props = {
      ...defaultProps,
      visible: true,
      onSort: undefined as any,
      onClose: undefined as any,
    };

    const { getByText } = render(<SortFilterModal {...props} />);

    expect(() => {
      fireEvent.press(getByText('Ascending (A-Z)'));
    }).toThrow();

    expect(() => {
      fireEvent.press(getByText('Close'));
    }).not.toThrow();

    consoleSpy.mockRestore();
  });

  it('should handle all TSortOrder values', () => {
    const onSortMock = jest.fn();
    const props = {
      ...defaultProps,
      visible: true,
      onSort: onSortMock,
    };

    const { getByText } = render(<SortFilterModal {...props} />);

    fireEvent.press(getByText('Ascending (A-Z)'));
    expect(onSortMock).toHaveBeenCalledWith('ASC');

    jest.clearAllMocks();

    fireEvent.press(getByText('Descending (Z-A)'));
    expect(onSortMock).toHaveBeenCalledWith('DESC');
  });

  it('should match snapshot when not visible', () => {
    const props = { ...defaultProps, visible: false };
    const { toJSON } = render(<SortFilterModal {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot when visible with ASC selected', () => {
    const props = {
      ...defaultProps,
      visible: true,
      currentOrder: ASC as TSortOrder,
    };
    const { toJSON } = render(<SortFilterModal {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot when visible with DESC selected', () => {
    const props = {
      ...defaultProps,
      visible: true,
      currentOrder: DESC as TSortOrder,
    };
    const { toJSON } = render(<SortFilterModal {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
