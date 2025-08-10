import React from 'react';
import { render } from '@testing-library/react-native';
import ItemSeparator from '../ItemSeparator';

describe('ItemSeparator', () => {
  it('should match snapshot', () => {
    const { toJSON } = render(<ItemSeparator />);
    expect(toJSON()).toMatchSnapshot();
  });
});
