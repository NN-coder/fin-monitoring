import { gql } from '@apollo/client';
import { FULL_USER_FIELDS } from './FULL_USER_FIELDS';

export const FULL_POST_PREVIEW_FIELDS = gql`
  ${FULL_USER_FIELDS}

  fragment FULL_POST_PREVIEW_FIELDS on PostPreview {
    id
    date
    image
    title
    user {
      ...FULL_USER_FIELDS
    }
  }
`;
