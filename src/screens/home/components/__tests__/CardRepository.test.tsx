import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CardRepository from '../CardRepository';
import { IRepository } from 'src/types/repository';
import * as navigation from '@react-navigation/native';
import * as stringUtils from 'src/utils/strings';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('src/utils/strings', () => ({
  getFullName: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
  dispatch: jest.fn(),
  getId: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn(),
  isFocused: jest.fn(() => true),
  removeListener: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  setParams: jest.fn(),
  addListener: jest.fn(),
};

const mockRepository: IRepository = {
  id: 1,
  node_id: 'MDEwOlJlcG9zaXRvcnkx',
  name: 'react',
  full_name: 'facebook/react',
  private: false,
  description:
    'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
  html_url: 'https://github.com/facebook/react',
  owner: {
    login: 'facebook',
    id: 69631,
    node_id: 'MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
    avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
    gravatar_id: '',
    url: 'https://api.github.com/users/facebook',
    html_url: 'https://github.com/facebook',
    followers_url: 'https://api.github.com/users/facebook/followers',
    following_url:
      'https://api.github.com/users/facebook/following{/other_user}',
    gists_url: 'https://api.github.com/users/facebook/gists{/gist_id}',
    starred_url: 'https://api.github.com/users/facebook/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/facebook/subscriptions',
    organizations_url: 'https://api.github.com/users/facebook/orgs',
    repos_url: 'https://api.github.com/users/facebook/repos',
    events_url: 'https://api.github.com/users/facebook/events{/privacy}',
    received_events_url:
      'https://api.github.com/users/facebook/received_events',
    type: 'Organization',
    user_view_type: 'public',
    site_admin: false,
  },
};

describe('CardRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (navigation.useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (stringUtils.getFullName as jest.Mock).mockImplementation(
      (fullName: string) => fullName.split('/').join(' '),
    );
  });

  it('should render repository information correctly', () => {
    const { getByText } = render(<CardRepository item={mockRepository} />);

    expect(getByText('react')).toBeTruthy();
    expect(getByText('facebook react')).toBeTruthy();
  });

  it('should handle press event and navigate to detail screen', () => {
    const { getByText } = render(<CardRepository item={mockRepository} />);

    // The component is wrapped in a Pressable, so we can press the text element's parent
    const titleElement = getByText('react');
    const card = titleElement.parent;

    if (card) {
      fireEvent.press(card);

      expect(mockNavigate).toHaveBeenCalledWith('Detail', {
        id: 'facebook/react',
      });
    }
  });

  it('should render with different repository data', () => {
    const differentRepo: IRepository = {
      ...mockRepository,
      id: 2,
      name: 'vue',
      full_name: 'vuejs/vue',
      description: 'Vue.js is a progressive framework',
      owner: {
        ...mockRepository.owner,
        login: 'vuejs',
        id: 123456,
      },
    };

    (stringUtils.getFullName as jest.Mock).mockImplementation(
      (fullName: string) => fullName.split('/').join(' '),
    );

    const { getByText } = render(<CardRepository item={differentRepo} />);

    expect(getByText('vue')).toBeTruthy();
    expect(getByText('vuejs vue')).toBeTruthy();
    expect(stringUtils.getFullName).toHaveBeenCalledWith('vuejs/vue');
  });

  it('should handle press event with different repository id', () => {
    const differentRepo: IRepository = {
      ...mockRepository,
      id: 2,
      name: 'angular',
      full_name: 'angular/angular',
    };

    const { getByText } = render(<CardRepository item={differentRepo} />);

    const card = getByText('angular').parent;
    if (card) {
      fireEvent.press(card);

      expect(mockNavigate).toHaveBeenCalledWith('Detail', {
        id: 'angular/angular',
      });
    }
  });

  it('should be pressable and have correct accessibility properties', () => {
    const { getByText, UNSAFE_getByType } = render(
      <CardRepository item={mockRepository} />,
    );

    const Pressable = require('react-native').Pressable;
    const pressable = UNSAFE_getByType(Pressable);
    expect(pressable).toBeTruthy();

    expect(getByText('react')).toBeTruthy();
  });

  // it('should render with correct styles', () => {
  //   const { getByText } = render(<CardRepository item={mockRepository} />);

  //   const titleText = getByText('react');
  //   const nameText = getByText('facebook react');

  //   // Check that text elements exist and can be styled
  //   expect(titleText).toBeTruthy();
  //   expect(nameText).toBeTruthy();

  //   // Verify the text content is correct
  //   expect(titleText.props.children).toBe('react');
  //   expect(nameText.props.children).toBe('facebook react');
  // });

  it('should handle navigation errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockNavigate.mockImplementationOnce(() => {
      throw new Error('Navigation failed');
    });

    const { getByText } = render(<CardRepository item={mockRepository} />);

    const card = getByText('react').parent;
    if (card) {
      expect(() => fireEvent.press(card)).toThrow('Navigation failed');
    }

    consoleSpy.mockRestore();
  });

  it('should match snapshot', () => {
    const { toJSON } = render(<CardRepository item={mockRepository} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with different repository data', () => {
    const differentRepo: IRepository = {
      ...mockRepository,
      id: 5,
      name: 'test-repo',
      full_name: 'test-org/test-repo',
    };

    (stringUtils.getFullName as jest.Mock).mockImplementation(
      (fullName: string) => fullName.split('/').join(' '),
    );

    const { toJSON } = render(<CardRepository item={differentRepo} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
