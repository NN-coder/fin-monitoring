import { gql, TypedDocumentNode } from '@apollo/client';
import { ClientPost, CreatePost } from '../../types/Post';
import { FULL_POST_FIELDS } from '../fragments/FULL_POST_FIELDS';

export interface Result {
  post: ClientPost;
}

export interface Variables {
  data: CreatePost;
}

export const CREATE_POST: TypedDocumentNode<Result, Variables> = gql`
  ${FULL_POST_FIELDS}

  mutation CreatePost($data: CreatePostInput!) {
    post: createPost(data: $data) {
      ...FULL_POST_FIELDS
    }
  }
`;
