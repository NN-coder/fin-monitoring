import { ApolloError, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { FC, useRef } from 'react';
import { MdSend } from 'react-icons/md';
import { AuthorizedError } from '../../errors/AuthorizedError';
import { CREATE_COMMENT } from '../../graphql/mutations/CREATE_COMMENT';
import { toastPromise } from '../../utils/toastPromise';

export const AddComment: FC = () => {
  const {
    query: { postId },
  } = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);
  const [createCommentMutation, { loading }] = useMutation(CREATE_COMMENT);

  const createComment = () => {
    const text = inputRef.current?.value;

    if (text && !loading)
      toastPromise(
        createCommentMutation({ variables: { postId: postId as string, input: { text } } }),
        {
          pending: 'Подождите...',
          success() {
            if (inputRef.current) inputRef.current.value = '';
            return 'Комментарий отправлен';
          },
          fail(error) {
            if (error instanceof ApolloError && error.message === AuthorizedError.message)
              return 'Авторизуйтесь, чтобы оставить комментарий';

            return 'Ошибка при попытке оставить комментарий';
          },
        }
      );
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Новый комментарий"
        className="w-full py-2 pl-4 pr-12 bg-neutral-200 placeholder:text-neutral-500 rounded-lg"
        ref={inputRef}
        onKeyPress={({ key }) => {
          if (key === 'Enter') createComment();
        }}
      />
      <button
        type="button"
        className="absolute right-0 h-full px-[0.625rem]"
        aria-label="Оставить комментарий"
        onClick={createComment}
      >
        <MdSend aria-hidden className="w-5 h-5" />
      </button>
    </div>
  );
};
