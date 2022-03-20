import { gql, TypedDocumentNode } from '@apollo/client';
import { ClientPost, CreatePost } from '../../types/Post';
import { FULL_POST_FIELDS } from '../fragments/FULL_POST_FIELDS';

export interface Result {
  post: ClientPost;
}

export interface Variables {
  input: CreatePost;
}

export const CREATE_POST: TypedDocumentNode<Result, Variables> = gql`
  ${FULL_POST_FIELDS}

  mutation CreatePost($input: CreatePostInput!) {
    post: createPost(input: $input) {
      ...FULL_POST_FIELDS
    }
  }
`;
