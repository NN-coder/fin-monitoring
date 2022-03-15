import { gql, TypedDocumentNode } from '@apollo/client';
import { ClientComment } from '../../types/Comment';
import { FULL_COMMENT_FIELDS } from '../fragments/FULL_COMMENT_FIELDS';

export interface Result {
  comment: ClientComment;
}

export interface Variables {
  id: string;
}

export const DELETE_COMMENT: TypedDocumentNode<Result, Variables> = gql`
  ${FULL_COMMENT_FIELDS}

  mutation DeleteComment($id: ObjectId!) {
    comment: deleteComment(id: $id) {
      ...FULL_COMMENT_FIELDS
    }
  }
`;
