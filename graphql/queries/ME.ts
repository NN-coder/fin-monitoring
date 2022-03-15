import { gql, TypedDocumentNode } from '@apollo/client';
import { ClientUser } from '../../types/User';
import { FULL_USER_FIELDS } from '../fragments/FULL_USER_FIELDS';

export interface Result {
  me: ClientUser;
}

export const ME: TypedDocumentNode = gql`
  ${FULL_USER_FIELDS}

  {
    me {
      ...FULL_USER_FIELDS
    }
  }
`;
