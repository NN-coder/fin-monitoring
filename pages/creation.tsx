import { ApolloError, useMutation } from '@apollo/client';
import { PostCategory } from '@prisma/client';
import clsx from 'clsx';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AuthorizedError } from '../errors/AuthorizedError';
import { CREATE_POST } from '../graphql/mutations/CREATE_POST';
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
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [category, setCategory] = useState<PostCategory | typeof categorySelectPlaceholder>(
    categorySelectPlaceholder
  );

  const selectImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/avif,image/jpeg,image/png,image/tiff,image/webp';

    input.addEventListener('change', ({ target }) => {
      const file = (target as HTMLInputElement).files?.item(0);
      if (file) setImage(file);
    });

    input.click();
  };

  const [createPostMutation] = useMutation(CREATE_POST);
  const router = useRouter();

  const createPost = async () => {
    if (title && text && image && category !== categorySelectPlaceholder)
      toastPromise(
        createPostMutation({
          variables: { data: { title, text, category, imageData: await getImageData(image) } },
        }),
        {
          pending: 'Подождите...',
          success({ data }) {
            if (data) router.push(`/post/${data.post.id}`);
            return 'Пост отправлен на проверку модераторам';
          },
          fail(error) {
            if (error instanceof ApolloError) {
              if (error.message === AuthorizedError.message)
                return 'Для создания поста необходимо авторизоваться';

              return 'Ошибка при попытке создания поста';
            }

            return 'Ошибка при попытке загрузить изображение';
          },
        }
      );
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <h2 className="font-medium text-2xl xl:text-4xl">Предложить пост</h2>
      <input
        value={title}
        onChange={({ target }) => setTitle(target.value)}
        type="text"
        autoComplete="off"
        placeholder="Введите заголовок"
        className="bg-neutral-200 placeholder-black placeholder-opacity-50 px-4 py-2 w-full mt-4 rounded-lg"
      />
      <div className="contents md:w-full md:flex">
        <select
          value={category}
          onChange={({ target }) => setCategory(target.value as PostCategory)}
          autoComplete="off"
          className={clsx(
            'px-4 py-2 text-black bg-neutral-200 w-full relative mt-4 rounded-lg appearance-none',
            'bg-dropdown bg-no-repeat bg-[right_0.5rem_center] md:mr-2',
            category === categorySelectPlaceholder && 'text-opacity-50'
          )}
        >
          <option value={categorySelectPlaceholder} disabled hidden>
            Выберите категорию
          </option>
          {Object.entries(categorySelectLabels).map(([value, label]) => (
            <option key={value} value={value} className="text-black text-opacity-100">
              {label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={selectImage}
          aria-label={`Выберите изображение${image ? `. Выбранное: ${image.name}` : ''}`}
          className={clsx(
            'bg-neutral-200 text-black py-2 px-4 w-full overflow-hidden text-ellipsis mt-4 md:ml-2 text-left rounded-lg',
            !image && 'text-opacity-50'
          )}
        >
          <span aria-hidden className="contents line-clamp-1">
            {image ? image.name : 'Выберите изображение'}
          </span>
        </button>
      </div>
      <textarea
        value={text}
        onChange={({ target }) => setText(target.value)}
        autoComplete="off"
        placeholder="Введите текст"
        className="bg-neutral-200 px-4 py-2 placeholder-black placeholder-opacity-50 w-full mt-4 rounded-lg resize-none"
        rows={11}
      />
      <button
        type="button"
        onClick={createPost}
        className="w-full max-w-xs mt-4 mx-auto p-2 rounded-lg text-white bg-green-700"
      >
        Предложить пост
      </button>
    </div>
  );
};

export default CreationPage;
