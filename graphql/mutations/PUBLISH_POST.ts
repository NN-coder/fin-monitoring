import { gql, TypedDocumentNode } from '@apollo/client';
import { ClientPost } from '../../types/Post';
import { FULL_POST_FIELDS } from '../fragments/FULL_POST_FIELDS';

export interface Result {
  post: ClientPost;
}

export interface Variables {
  id: string;
}

export const PUBLISH_POST: TypedDocumentNode<Result, Variables> = gql`
  ${FULL_POST_FIELDS}

  mutation PublishPost($id: ObjectId!) {
    post: publishPost(id: $id) {
      ...FULL_POST_FIELDS
    }
  }
`;
