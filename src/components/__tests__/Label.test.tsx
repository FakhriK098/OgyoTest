import React from 'react';
import { render } from '@testing-library/react-native';
import Label from '../Label';

describe('Label', () => {
  it('should render title and value correctly', () => {
    const { getByText } = render(<Label title="Followers" value="100" />);

    expect(getByText('Followers:')).toBeTruthy();
    expect(getByText('100')).toBeTruthy();
  });

  it('should render nothing with empty value', () => {
    const { toJSON } = render(<Label title="Bio" />);

    expect(toJSON()).toBeNull();
  });

  it('should match snapshot', () => {
    const { toJSON } = render(<Label title="Test Label" value="Test Value" />);
    expect(toJSON()).toMatchSnapshot();
  });
});
