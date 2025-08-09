import { ILinkHeader } from '../types/repository';

export const getFullName = (name: string): string => {
  return name.split('/').join(' ');
};

export const parseLinkHeader = (linkHeader?: string): ILinkHeader => {
  const links: ILinkHeader = {};
  if (!linkHeader) return links;

  const parts = linkHeader.split(',');
  parts.forEach(part => {
    const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (match) {
      const [, url, rel] = match;
      links[rel as keyof ILinkHeader] = url;
    }
  });

  return links;
};

export const extractSinceFromUrl = (url?: string): number | null => {
  if (!url) return null;
  const match = url.match(/since=(\d+)/);
  return match ? parseInt(match[1], 10) : null;
};
