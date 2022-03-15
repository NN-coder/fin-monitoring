import { gql, TypedDocumentNode } from '@apollo/client';
import { ClientComment } from '../../types/Comment';
import { FULL_COMMENT_FIELDS } from '../fragments/FULL_COMMENT_FIELDS';

export interface Result {
  comments: ClientComment[];
}

export const COMMENTS: TypedDocumentNode<Result, never> = gql`
  ${FULL_COMMENT_FIELDS}

  {
    comments {
      ...FULL_COMMENT_FIELDS
    }
  }
`;
