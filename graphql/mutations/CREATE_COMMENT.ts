import { gql, TypedDocumentNode } from '@apollo/client';
import { ClientComment, CreateComment } from '../../types/Comment';
import { FULL_COMMENT_FIELDS } from '../fragments/FULL_COMMENT_FIELDS';

export interface Result {
  comment: ClientComment;
}

export interface Variables {
  postId: string;
  data: CreateComment;
}

export const CREATE_COMMENT: TypedDocumentNode<Result, Variables> = gql`
  ${FULL_COMMENT_FIELDS}

  mutation CreateComment($postId: ObjectId!, $data: CreateCommentInput!) {
    comment: createComment(postId: $postId, data: $data) {
      ...FULL_COMMENT_FIELDS
    }
  }
`;
