import { useMutation } from '@apollo/client';
import { UserRole } from '@prisma/client';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { Comments } from '../../components/Comments';
import { PUBLISH_POST } from '../../graphql/mutations/PUBLISH_POST';
import { DELETE_POST } from '../../graphql/mutations/DELETE_POST';
import { UserHeader } from '../../components/UserHeader';
import { toastPromise } from '../../utils/toastPromise';
import { prisma } from '../../prisma';
import { ClientPost, ServerPost } from '../../types/Post';
import { jsonify } from '../../utils/jsonify';
import { setCacheControlHeader } from '../../utils/setCacheControlHeader';
import { Button } from '../../components/Button';

export const getServerSideProps: GetServerSideProps<
  { post: ClientPost },
  { postId: string }
> = async ({ res, params }) => {
  setCacheControlHeader(res);
  if (!params || typeof params.postId !== 'string') return { notFound: true };

  try {
    const prismaPost: ServerPost = await prisma.post.findUnique({
      where: { id: params.postId },
      include: { comments: { orderBy: { date: 'desc' }, include: { user: true } }, user: true },
    });

    const post = jsonify(prismaPost);
    return { props: { post } };
  } catch (_) {
    return { notFound: true };
  }
};

const PostPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  post: { id, category, title, date, image, text, published, user, comments },
}) => {
  const router = useRouter();
  const [publishPostMutation] = useMutation(PUBLISH_POST);
  const [deletePostMutation] = useMutation(DELETE_POST);

  const publishPost = () =>
    toastPromise(publishPostMutation({ variables: { id } }), {
      pending: 'Апубликовывоем...',
      success: 'Невероятно, оно сработало!',
      fail: 'Странно, должно работать...',
    });

  const deletePost = () =>
    toastPromise(deletePostMutation({ variables: { id } }), {
      pending: 'Удоляем...',
      success() {
        router.push(`/categories/${category}`);
        return 'Невероятно, оно сработало!';
      },
      fail: 'Странно, должно работать...',
    });

  const { data: session } = useSession();

  return (
    <article className="contents">
      <header className="max-w-3xl mx-auto">
        <h2
          className="mb-4 text-2xl font-medium text-center xl:text-4xl"
          style={{ wordBreak: 'break-word' }}
        >
          {title.trim()}
        </h2>
        <UserHeader
          image={user.image ?? undefined}
          name={user.name ?? undefined}
          date={new Date(date)}
        />
        <img
          src={image || '/placeholder.png'}
          alt=""
          className="my-4 w-full h-60 rounded-lg md:h-[22rem]"
        />
      </header>
      <div className="max-w-lg mx-auto">
        <p className="whitespace-pre-line" style={{ wordBreak: 'break-word' }}>
          {text.trim()}
        </p>
        {session?.user?.role === UserRole.ADMIN && (
          <div aria-hidden className="contents md:flex">
            <Button
              className="w-full mt-4 text-white bg-green-700"
              onDoubleClick={publishPost}
              disabled={published}
            >
              Опубликовать
            </Button>
            <Button
              className="w-full mt-4 text-green-700 border border-green-700 md:mx-2"
            >
              Редактировать
            </Button>
            <Button
              className="w-full mt-4 text-white bg-red-600"
              onDoubleClick={deletePost}
            >
              Удалить
            </Button>
          </div>
        )}
        {published && (
          <section className="contents">
            <h3 className="my-4 text-2xl font-medium text-center">Комментарии</h3>
            <Comments comments={comments} />
          </section>
        )}
      </div>
    </article>
  );
};

export default PostPage;
