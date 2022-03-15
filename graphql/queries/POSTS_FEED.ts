import { gql, TypedDocumentNode } from '@apollo/client';
import { PostCategory } from '@prisma/client';
import { ClientPostPreview } from '../../types/Post';
import { FULL_POST_PREVIEW_FIELDS } from '../fragments/FULL_POST_PREVIEW_FIELDS';

export interface Result {
  postsFeed: ClientPostPreview[];
}

export interface Variables {
  category?: PostCategory;
}

export const POSTS_FEED: TypedDocumentNode<Result, Variables> = gql`
  ${FULL_POST_PREVIEW_FIELDS}

  query PostsFeed($category: PostCategory) {
    postsFeed(category: $category) {
      ...FULL_POST_PREVIEW_FIELDS
    }
  }
`;
