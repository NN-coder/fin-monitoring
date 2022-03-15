import { signIn, useSession } from 'next-auth/react';
import { FC } from 'react';
import { ClientComment } from '../../types/Comment';
import { AddComment } from './AddComment';
import { Comment } from './Comment';

export interface Props {
  comments: ClientComment[];
}

export const Comments: FC<Props> = ({ comments }) => {
  const { status } = useSession();

  return (
    <>
      {comments.length === 0 ? (
        <p className="mb-4 text-neutral-500">
          Здесь пока нет ни одного комментария, вы можете стать первым!
        </p>
      ) : (
        comments.map((comment) => <Comment key={comment.id} {...comment} />)
      )}
      {status === 'authenticated' ? (
        <AddComment />
      ) : (
        <div>
          <button
            type="button"
            onClick={() => signIn('google')}
            className="text-green-700 font-medium"
          >
            Войдите
          </button>
          , чтобы оставить комментарий
        </div>
      )}
    </>
  );
};
