import { ApolloError, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { FC, FormEventHandler, useState } from 'react';
import { MdSend } from 'react-icons/md';
import { AuthorizedError } from '../../errors/AuthorizedError';
import { CREATE_COMMENT } from '../../graphql/mutations/CREATE_COMMENT';
import { toastPromise } from '../../utils/toastPromise';
import { Textarea } from '../Textarea';

export const AddComment: FC = () => {
  const {
    query: { postId },
  } = useRouter();

  const [text, setText] = useState('');
  const [createCommentMutation, { loading }] = useMutation(CREATE_COMMENT);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (text.trim() && !loading)
      toastPromise(
        createCommentMutation({
          variables: { postId: postId as string, input: { text: text.trim() } },
        }),
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
    // флекс нужен для того, чтобы высота формы была равна высоте инпута
    <form onSubmit={handleSubmit} className="relative flex">
      <Textarea
        required
        value={text}
        onChange={({ target }) => setText(target.value)}
        placeholder="Новый комментарий"
        className="w-full pl-4 pr-12"
      />
      <button
        type="submit"
        aria-label="Оставить комментарий"
        className="absolute right-0 bottom-0 p-[0.625rem] rounded-lg"
      >
        <MdSend aria-hidden className="w-5 h-5" />
      </button>
    </form>
  );
};
