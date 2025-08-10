import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FloatingActionButton from '../FloatingActionButton';
import { IFloatingActionButtonProps } from 'src/types/home';

describe('FloatingActionButton', () => {
  const defaultProps: IFloatingActionButtonProps = {
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with default props', () => {
    const { getByText } = render(<FloatingActionButton {...defaultProps} />);

    expect(getByText('Filter Sort')).toBeTruthy();
  });

  it('should handle press event', () => {
    const onPressMock = jest.fn();
    const props = { onPress: onPressMock };

    const { getByText } = render(<FloatingActionButton {...props} />);

    const button = getByText('Filter Sort');
    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should be touchable and accessible', () => {
    const { getByText, UNSAFE_getByType } = render(
      <FloatingActionButton {...defaultProps} />,
    );

    const TouchableOpacity = require('react-native').TouchableOpacity;
    const touchable = UNSAFE_getByType(TouchableOpacity);
    expect(touchable).toBeTruthy();

    expect(getByText('Filter Sort')).toBeTruthy();
  });

  it('should match snapshot', () => {
    const { toJSON } = render(<FloatingActionButton {...defaultProps} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with different onPress handler', () => {
    const customOnPress = jest.fn();
    const { toJSON } = render(<FloatingActionButton onPress={customOnPress} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
