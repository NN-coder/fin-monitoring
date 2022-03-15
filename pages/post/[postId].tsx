import { useMutation, useQuery } from '@apollo/client';
import { UserRole } from '@prisma/client';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { Comments } from '../../components/Comments';
import { POST, Result as PostResult } from '../../graphql/queries/POST';
import { PUBLISH_POST } from '../../graphql/mutations/PUBLISH_POST';
import { DELETE_POST } from '../../graphql/mutations/DELETE_POST';
import { UserHeader } from '../../components/UserHeader';
import { toastPromise } from '../../utils/toastPromise';
import { prisma } from '../../prisma';
import { InferGetStaticPathsType } from '../../types/InferGetStaticPathsType';
import { ServerPost } from '../../types/Post';
import { jsonify } from '../../utils/jsonify';

export const getStaticPaths: GetStaticPaths<{ postId: string }> = async () => {
  const postIds = await prisma.post.findMany({ select: { id: true } });

  return {
    paths: postIds.map(({ id }) => ({ params: { postId: id } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<
  PostResult,
  InferGetStaticPathsType<typeof getStaticPaths>
> = async ({ params }) => {
  try {
    if (!params) return { notFound: true };

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

const PostPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  const router = useRouter();
  const postId = router.query.postId as string;

  const [publishPostMutation] = useMutation(PUBLISH_POST);
  const [deletePostMutation] = useMutation(DELETE_POST);

  const publishPost = () =>
    toastPromise(publishPostMutation({ variables: { id: postId } }), {
      pending: 'Апубликовывоем...',
      success: 'Невероятно, оно сработало!',
      fail: 'Странно, должно работать...',
    });

  const deletePost = () =>
    toastPromise(deletePostMutation({ variables: { id: postId } }), {
      pending: 'Удоляем...',
      success() {
        router.back();
        return 'Невероятно, оно сработало!';
      },
      fail: 'Странно, должно работать...',
    });

  const { data: session } = useSession();
  const { data = props } = useQuery(POST, { variables: { id: postId } });

  if (router.isFallback) return null;
  const { title, date, image, text, published, user, comments } = data.post;

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
        <img src={image} alt="" className="my-4 w-full h-60 rounded-lg md:h-[22rem]" />
      </header>
      <div className="max-w-lg mx-auto">
        <p className="whitespace-pre-line" style={{ wordBreak: 'break-word' }}>
          {text.trim()}
        </p>
        {session?.user?.role === UserRole.ADMIN && (
          <div aria-hidden className="contents md:flex">
            <button
              type="button"
              className={clsx(
                'mt-4 py-2 w-full rounded-lg text-white',
                published ? 'bg-neutral-500' : 'bg-green-700'
              )}
              onDoubleClick={publishPost}
              disabled={published}
            >
              Опубликовать
            </button>
            <button
              type="button"
              className="mt-4 py-2 w-full rounded-lg text-green-700 border border-green-700 md:mx-2"
            >
              Редактировать
            </button>
            <button
              type="button"
              className="mt-4 py-2 w-full rounded-lg text-white bg-red-600"
              onDoubleClick={deletePost}
            >
              Удалить
            </button>
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
