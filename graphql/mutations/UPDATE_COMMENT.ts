import { gql, TypedDocumentNode } from '@apollo/client';
import { ClientComment, UpdateComment } from '../../types/Comment';
import { FULL_COMMENT_FIELDS } from '../fragments/FULL_COMMENT_FIELDS';

export interface Result {
  comment: ClientComment;
}

export interface Variables {
  id: string;
  data: UpdateComment;
}

export const UPDATE_COMMENT: TypedDocumentNode<Result, Variables> = gql`
  ${FULL_COMMENT_FIELDS}

  mutation UpdateComment($id: ObjectId!, $data: UpdateCommentInput!) {
    comment: updateComment(id: $id, data: $data) {
      ...FULL_COMMENT_FIELDS
    }
  }
`;
