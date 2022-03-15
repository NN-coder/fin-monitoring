import { Comment } from '@prisma/client';
import { Jsonify } from 'type-fest';
import { ServerUser } from './User';

export type ServerComment = Comment & { user: ServerUser };
export type ClientComment = Jsonify<ServerComment>;

export type CreateComment = Pick<ServerComment, 'text'>;
export type UpdateComment = Partial<Pick<ServerComment, 'text'>>;
