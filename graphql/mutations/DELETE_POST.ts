import { gql, TypedDocumentNode } from '@apollo/client';
import { ClientPost } from '../../types/Post';
import { FULL_POST_FIELDS } from '../fragments/FULL_POST_FIELDS';

export interface Result {
  post: ClientPost;
}

export interface Variables {
  id: string;
}

export const DELETE_POST: TypedDocumentNode<Result, Variables> = gql`
  ${FULL_POST_FIELDS}

  mutation DeletePost($id: ObjectId!) {
    post: deletePost(id: $id) {
      ...FULL_POST_FIELDS
    }
  }
`;
