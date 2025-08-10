import React from 'react';
import { render } from '@testing-library/react-native';
import Avatar from '../Avatar';

describe('Avatar', () => {
  const defaultProps = {
    url: 'https://example.com/avatar.jpg',
    width: 100,
    height: 100,
  };

  it('should render correctly with provided props', () => {
    const { getByTestId } = render(<Avatar {...defaultProps} />);

    const image = getByTestId('avatar-image');
    expect(image).toBeTruthy();
    expect(image.props.source.uri).toBe('https://example.com/avatar.jpg');
    expect(image.props.style).toContainEqual({ width: 100, height: 100 });
  });

  it('should match snapshot', () => {
    const { toJSON } = render(<Avatar {...defaultProps} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
