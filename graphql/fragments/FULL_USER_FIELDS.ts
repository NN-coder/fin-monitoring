import { gql } from '@apollo/client';

export const FULL_USER_FIELDS = gql`
  fragment FULL_USER_FIELDS on User {
    id
    name
    image
    email
    emailVerified
    role
  }
`;
