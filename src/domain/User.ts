import { Post } from './Post';

export type User = {
  username: string;
  password?: string;
  tags: string[];
  posts: {
    [key: string]: Post;
  };
  followers: string[];
  following: string[];
};
