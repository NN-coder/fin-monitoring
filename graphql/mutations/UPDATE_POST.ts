import { gql, TypedDocumentNode } from '@apollo/client';
import { ClientPost, UpdatePost } from '../../types/Post';
import { FULL_POST_FIELDS } from '../fragments/FULL_POST_FIELDS';

export interface Result {
  post: ClientPost;
}

export interface Variables {
  id: string;
  input: UpdatePost;
}

export const UPDATE_POST: TypedDocumentNode<Result, Variables> = gql`
  ${FULL_POST_FIELDS}

  mutation UpdatePost($id: ObjectId!, $input: UpdatePostInput!) {
    post: updatePost(id: $id, input: $input) {
      ...FULL_POST_FIELDS
    }
  }
`;
