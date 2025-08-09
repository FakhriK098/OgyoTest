export interface IUser {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: IUserOwner;
  html_url: string;
  description: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  forks_count: number;
  open_issues_count: number;
  license: ILicense;
  topics: string[];
  network_count: number;
  subscribers_count: number;
}

export interface ILicense {
  key: string;
  name: string;
  spdx_id: string;
  url: string;
  node_id: string;
}

export interface IUserOwner {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
}

export interface IFetchUserPayload {
  fullName?: string;
}

export interface ILabelProps {
  title: string;
  value?: string;
}
