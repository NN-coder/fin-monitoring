import { ApolloError, useMutation } from '@apollo/client';
import { PostCategory } from '@prisma/client';
import clsx from 'clsx';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEventHandler, useState } from 'react';
import { AuthorizedError } from '../errors/AuthorizedError';
import { UnsupportedFileTypeError } from '../errors/UnsupportedFileTypeError';
import { CREATE_POST } from '../graphql/mutations/CREATE_POST';
import { SupportedImageType } from '../types/supportedImageType';
import { getImageData } from '../utils/getImageData';
import { toastPromise } from '../utils/toastPromise';

const categorySelectPlaceholder = 'placeholder';

// TODO
const categorySelectLabels: { [key in PostCategory]: string } = {
  [PostCategory.blacklist]: 'Чёрный список',
  [PostCategory.education]: 'Финансовая грамотность',
};

const CreationPage: NextPage = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [category, setCategory] = useState<PostCategory | typeof categorySelectPlaceholder>(
    categorySelectPlaceholder
  );

  const [createPost] = useMutation(CREATE_POST);
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const imageData = image ? await getImageData(image) : undefined;

    if (title && text && category !== categorySelectPlaceholder)
      toastPromise(createPost({ variables: { input: { title, imageData, text, category } } }), {
        pending: 'Подождите...',
        success({ data }) {
          if (data) router.push(`/post/${data.post.category}`);
          return 'Пост отправлен на проверку модераторам';
        },
        fail(error) {
          if (error instanceof Error && error.message === UnsupportedFileTypeError.message)
            return 'Неподдерживаемый тип изображения';

          if (error instanceof ApolloError && error.message === AuthorizedError.message)
            return 'Для создания поста необходимо авторизоваться';

          return 'Ошибка при попытке создания поста';
        },
      });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto flex flex-col items-center">
      <h2 className="font-medium text-2xl xl:text-4xl">Предложить пост</h2>
      <input
        required
        autoComplete="off"
        type="text"
        value={title}
        onChange={({ target }) => setTitle(target.value)}
        placeholder="Введите заголовок"
        className={clsx(
          'w-full mt-4 px-4 py-2 rounded-lg',
          'bg-neutral-200 placeholder:text-neutral-500 placeholder:opacity-100'
        )}
      />
      <div className="w-full contents md:flex">
        <select
          required
          autoComplete="off"
          value={category}
          onChange={({ target }) => setCategory(target.value as PostCategory)}
          className={clsx(
            'w-full mt-4 px-4 py-2 appearance-none rounded-lg bg-neutral-200 md:mr-2',
            'bg-dropdown bg-no-repeat bg-[right_0.5rem_center]',
            category === categorySelectPlaceholder ? 'text-neutral-500' : 'text-black'
          )}
        >
          <option value={categorySelectPlaceholder} disabled hidden>
            Выберите категорию
          </option>
          {Object.entries(categorySelectLabels).map(([value, label]) => (
            <option key={value} value={value} className="text-black">
              {label}
            </option>
          ))}
        </select>
        <label
          tabIndex={0}
          className={clsx(
            'w-full mt-4 px-4 py-2 cursor-pointer rounded-lg bg-neutral-200 md:ml-2',
            image ? 'text-black' : 'text-neutral-500'
          )}
        >
          {image ? image.name : 'Выберите изображение'}
          <input
            autoComplete="off"
            type="file"
            tabIndex={-1}
            accept={Object.values(SupportedImageType).join(',')}
            className="sr-only"
            onChange={({ target }) => {
              const file = target.files?.item(0);
              if (file) setImage(file);
            }}
          />
        </label>
      </div>
      <textarea
        required
        autoComplete="off"
        value={text}
        onChange={({ target }) => setText(target.value)}
        rows={10}
        placeholder="Введите текст"
        className={clsx(
          'w-full mt-4 px-4 py-2 rounded-lg resize-none',
          'bg-neutral-200 placeholder:text-neutral-500 placeholder:opacity-100'
        )}
      />
      <button
        type="submit"
        className="w-full max-w-sm mx-auto mt-4 p-2 rounded-lg bg-green-700 text-white"
      >
        Предложить пост
      </button>
    </form>
  );
};

export default CreationPage;
