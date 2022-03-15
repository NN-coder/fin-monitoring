import { gql, TypedDocumentNode } from '@apollo/client';
import { ClientPost } from '../../types/Post';
import { FULL_POST_FIELDS } from '../fragments/FULL_POST_FIELDS';

export interface Result {
  post: ClientPost;
}

export interface Variables {
  id: string;
}

export const POST: TypedDocumentNode<Result, Variables> = gql`
  ${FULL_POST_FIELDS}

  query Post($id: ObjectId!) {
    post(id: $id) {
      ...FULL_POST_FIELDS
    }
  }
`;
