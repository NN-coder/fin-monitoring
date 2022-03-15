import { gql } from '@apollo/client';
import { FULL_COMMENT_FIELDS } from './FULL_COMMENT_FIELDS';
import { FULL_USER_FIELDS } from './FULL_USER_FIELDS';

export const FULL_POST_FIELDS = gql`
  ${FULL_USER_FIELDS}
  ${FULL_COMMENT_FIELDS}

  fragment FULL_POST_FIELDS on Post {
    id
    title
    text
    image
    date
    category
    published
    userId
    user {
      ...FULL_USER_FIELDS
    }
    comments {
      ...FULL_COMMENT_FIELDS
    }
  }
`;
