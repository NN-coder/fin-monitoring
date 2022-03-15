import { gql } from '@apollo/client';
import { FULL_USER_FIELDS } from './FULL_USER_FIELDS';

export const FULL_COMMENT_FIELDS = gql`
  ${FULL_USER_FIELDS}

  fragment FULL_COMMENT_FIELDS on Comment {
    id
    text
    date
    userId
    postId
    user {
      ...FULL_USER_FIELDS
    }
  }
`;
