import { ApolloError, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { FC, FormEventHandler, useRef, useState } from 'react';
import { MdSend } from 'react-icons/md';
import { AuthorizedError } from '../../errors/AuthorizedError';
import { CREATE_COMMENT } from '../../graphql/mutations/CREATE_COMMENT';
import { toastPromise } from '../../utils/toastPromise';
import { TextField } from '../TextField';

export const AddComment: FC = () => {
  const {
    query: { postId },
  } = useRouter();

  const [text, setText] = useState('');
  const [isTextValid, setIsTextValid] = useState(true);

  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const [createComment, { loading }] = useMutation(CREATE_COMMENT);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const trimmedText = text.trim();

    if (!trimmedText) {
      setIsTextValid(false);
      return textInputRef.current?.focus();
    }

    if (!loading) {
      setIsTextValid(true);

      toastPromise(
        createComment({ variables: { postId: postId as string, input: { text: trimmedText } } }),
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
    }
  };

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <TextField
        ref={textInputRef}
        required
        label="Новый комментарий"
        errorText="Нельзя оставить пустой комментарий"
        className="w-full"
        value={text}
        onChange={({ target }) => setText(target.value)}
        invalid={!isTextValid}
        endAdornment={
          <button
            type="submit"
            aria-label="Оставить комментарий"
            className="p-[0.625rem] self-end rounded-lg"
          >
            <MdSend aria-hidden className="w-5 h-5" />
          </button>
        }
      />
    </form>
  );
};
