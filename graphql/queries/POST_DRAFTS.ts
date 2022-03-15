import { gql, TypedDocumentNode } from '@apollo/client';
import { PostCategory } from '@prisma/client';
import { ClientPostPreview } from '../../types/Post';
import { FULL_POST_PREVIEW_FIELDS } from '../fragments/FULL_POST_PREVIEW_FIELDS';

export interface Result {
  postDrafts: ClientPostPreview[];
}

export interface Variables {
  category?: PostCategory;
}

export const POST_DRAFTS: TypedDocumentNode<Result, Variables> = gql`
  ${FULL_POST_PREVIEW_FIELDS}

  query PostDrafts($category: PostCategory) {
    postDrafts(category: $category) {
      ...FULL_POST_PREVIEW_FIELDS
    }
  }
`;
