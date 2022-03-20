import { ApolloError, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { FC, FormEventHandler, useState } from 'react';
import { MdSend } from 'react-icons/md';
import { AuthorizedError } from '../../errors/AuthorizedError';
import { CREATE_COMMENT } from '../../graphql/mutations/CREATE_COMMENT';
import { toastPromise } from '../../utils/toastPromise';

export const AddComment: FC = () => {
  const {
    query: { postId },
  } = useRouter();

  const [text, setText] = useState('');
  const [createCommentMutation, { loading }] = useMutation(CREATE_COMMENT);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (text && !loading)
      toastPromise(
        createCommentMutation({ variables: { postId: postId as string, input: { text } } }),
        {
          pending: 'Подождите...',
          success() {
            setText('');
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
    <form onSubmit={handleSubmit} className="relative">
      <input
        required
        value={text}
        onChange={({ target }) => setText(target.value)}
        type="text"
        placeholder="Новый комментарий"
        className="w-full py-2 pl-4 pr-12 bg-neutral-200 placeholder:text-neutral-500 rounded-lg"
      />
      <button
        type="submit"
        className="absolute right-0 h-full px-[0.625rem]"
        aria-label="Оставить комментарий"
      >
        <MdSend aria-hidden className="w-5 h-5" />
      </button>
    </form>
  );
};
