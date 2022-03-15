import { User } from '@prisma/client';
import { Jsonify } from 'type-fest';

export type ServerUser = User;
export type ClientUser = Jsonify<ServerUser>;
