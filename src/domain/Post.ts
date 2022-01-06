import { AuthorPostUUID } from './AuthorPostUUID';
import { Reaction } from './Reaction';
import { Comment } from './Comment';

export type Post = {
  uuid: string;
  timestamp: number;
  title: string;
  content: string;
  author: string;
  rewins: AuthorPostUUID[];
  comments: Comment[];
  reactions: Reaction[];
  upvotes: number;
  downvotes: number;
};
