import { gql, TypedDocumentNode } from '@apollo/client';
import { ClientComment, UpdateComment } from '../../types/Comment';
import { FULL_COMMENT_FIELDS } from '../fragments/FULL_COMMENT_FIELDS';

export interface Result {
  comment: ClientComment;
}

export interface Variables {
  id: string;
  input: UpdateComment;
}

export const UPDATE_COMMENT: TypedDocumentNode<Result, Variables> = gql`
  ${FULL_COMMENT_FIELDS}

  mutation UpdateComment($id: ObjectId!, $input: UpdateCommentInput!) {
    comment: updateComment(id: $id, input: $input) {
      ...FULL_COMMENT_FIELDS
    }
  }
`;
