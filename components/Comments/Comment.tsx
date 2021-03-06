import { useMutation } from '@apollo/client';
import { UserRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { FC } from 'react';
import { DELETE_COMMENT } from '../../graphql/mutations/DELETE_COMMENT';
import { ClientComment } from '../../types/Comment';
import { toastPromise } from '../../utils/toastPromise';
import { Button } from '../Button';
import { UserHeader } from '../UserHeader';

export type Props = ClientComment;

export const Comment: FC<Props> = ({ id, date, text, user }) => {
  const [deleteCommentMutation] = useMutation(DELETE_COMMENT);

  const deleteComment = () =>
    toastPromise(deleteCommentMutation({ variables: { id } }), {
      pending: 'Удоляем...',
      success: 'Невероятно, оно сработало!',
      fail: 'Странно, должно работать...',
    });

  const { data: session } = useSession();

  return (
    <div className="mb-4 flex flex-col">
      <UserHeader
        image={user.image ?? undefined}
        name={user.name ?? undefined}
        date={new Date(date)}
      />
      <p className="my-2 whitespace-pre-line">{text.trim()}</p>
      {session?.user?.role === UserRole.ADMIN && (
        <Button
          onDoubleClick={deleteComment}
          className="mt-auto text-white bg-red-600"
        >
          Удалить
        </Button>
      )}
    </div>
  );
};
