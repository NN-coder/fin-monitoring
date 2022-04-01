import { useMutation } from '@apollo/client';
import { PostCategory } from '@prisma/client';
import clsx from 'clsx';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEventHandler, useRef, useState } from 'react';
import { Button } from '../components/Button';
import { TextField } from '../components/TextField';
import { CREATE_POST } from '../graphql/mutations/CREATE_POST';
import { SupportedImageType } from '../types/supportedImageType';
import { getImageData } from '../utils/getImageData';
import { toastPromise } from '../utils/toastPromise';

const categorySelectPlaceholder = 'placeholder';
type Category = PostCategory | typeof categorySelectPlaceholder;

// TODO
const categorySelectLabels: { [key in PostCategory]: string } = {
  [PostCategory.blacklist]: 'Чёрный список',
  [PostCategory.education]: 'Финансовая грамотность',
};

const CreationPage: NextPage = () => {
  const [title, setTitle] = useState('');
  const [isTitleValid, setIsTitleValid] = useState(true);
  const titleInputRef = useRef<HTMLTextAreaElement>(null);

  const [category, setCategory] = useState<Category>(categorySelectPlaceholder);
  const [isCategoryValid, setIsCategoryValid] = useState(true);
  const categorySelectRef = useRef<HTMLSelectElement>(null);

  const [image, setImage] = useState<File | null>(null);
  const [isImageValid, setIsImageValid] = useState(true);
  const imageInputRef = useRef<HTMLLabelElement>(null);

  const [text, setText] = useState('');
  const [isTextValid, setIsTextValid] = useState(true);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const [createPost] = useMutation(CREATE_POST);
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const imageData = image && (await getImageData(image));
    const trimmedText = text.trim();

    setIsTextValid(!!trimmedText);
    if (!trimmedText) textInputRef.current?.focus();

    setIsImageValid(!image || !!imageData);
    if (image && !imageData) imageInputRef.current?.focus();

    setIsCategoryValid(category !== categorySelectPlaceholder);
    if (category === categorySelectPlaceholder) categorySelectRef.current?.focus();

    setIsTitleValid(!!trimmedTitle);
    if (!trimmedTitle) titleInputRef.current?.focus();

    if (trimmedTitle && trimmedText && category !== categorySelectPlaceholder)
      toastPromise(
        createPost({
          variables: {
            input: {
              title: trimmedTitle,
              text: trimmedText,
              imageData: imageData ?? undefined,
              category,
            },
          },
        }),
        {
          pending: 'Подождите...',
          async success({ data }) {
            if (data) await router.push(`/post/${data.post.id}`);
            return 'Пост отправлен на проверку модераторам';
          },
          fail: 'Ошибка при попытке создания поста',
        }
      );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto flex flex-col items-center">
      <h2 className="font-medium text-2xl xl:text-4xl">Предложить пост</h2>
      <TextField
        ref={titleInputRef}
        required
        autoComplete="off"
        value={title}
        onChange={({ target }) => setTitle(target.value)}
        label="Введите заголовок"
        className="w-full mt-4"
        invalid={!isTitleValid}
        errorText="Заголовок не может быть пустой строкой"
      />
      <div className="w-full contents md:flex">
        <select
          ref={categorySelectRef}
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
          ref={imageInputRef}
          tabIndex={0}
          className={clsx(
            'w-full mt-4 px-4 py-2 cursor-pointer rounded-lg bg-neutral-200 md:ml-2',
            image ? 'text-black' : 'text-neutral-500'
          )}
        >
          <span className="line-clamp-1">{image ? image.name : 'Выберите изображение'}</span>
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
      <TextField
        ref={textInputRef}
        required
        autoComplete="off"
        rows={10}
        value={text}
        onChange={({ target }) => setText(target.value)}
        label="Введите текст"
        className="w-full mt-4"
        invalid={!isTextValid}
        errorText="Текст не может быть пустой строкой"
      />
      <Button type="submit" className="w-full max-w-sm mx-auto mt-4 bg-green-700 text-white">
        Предложить пост
      </Button>
    </form>
  );
};

export default CreationPage;
