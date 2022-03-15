import { Post } from '@prisma/client';
import { Jsonify } from 'type-fest';
import { ServerComment } from './Comment';
import { ServerUser } from './User';

export type ServerPost = Post & { user: ServerUser; comments: ServerComment[] };
export type ClientPost = Jsonify<ServerPost>;

export type ServerPostPreview = Pick<
  ServerPost,
  'date' | 'id' | 'image' | 'title' | 'user'
>;

export type ClientPostPreview = Jsonify<ServerPostPreview>;

export type CreatePost = Pick<ServerPost, 'category' | 'text' | 'title'> & { imageData: number[] };
export type UpdatePost = Partial<
  Pick<ServerPost, 'category' | 'text' | 'title'> & { imageData: number[] }
>;
