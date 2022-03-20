import { UserRole } from '@prisma/client';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Comment } from '../components/Comments/Comment';
import { prisma } from '../prisma';
import { ClientComment, ServerComment } from '../types/Comment';
import { ClientPostPreview, ServerPostPreview } from '../types/Post';
import { getFormattedDate } from '../utils/getFormattedDate';
import { jsonify } from '../utils/jsonify';
import { setCacheControlHeader } from '../utils/setCacheControlHeader';

export const getServerSideProps: GetServerSideProps<{
  posts: ClientPostPreview[];
  comments: ClientComment[];
}> = async ({ res }) => {
  setCacheControlHeader(res);

  const prismaPosts: ServerPostPreview[] = await prisma.post.findMany({
    where: { published: false },
    select: { id: true, date: true, image: true, title: true, user: true },
    orderBy: { date: 'desc' },
  });

  const prismaComments: ServerComment[] = await prisma.comment.findMany({
    include: { user: true },
    orderBy: { date: 'desc' },
  });

  const posts = jsonify(prismaPosts);
  const comments = jsonify(prismaComments);

  return { props: { posts, comments } };
};

const AdminPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  posts,
  comments,
}) => {
  const { data: session } = useSession();
  if (session?.user?.role !== UserRole.ADMIN) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="mb-6 text-2xl font-medium text-center xl:text-4xl">Неопубликованные посты</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {posts.map(({ id, title, date, image }) => (
          <Link key={id} href={`/post/${id}`}>
            <a className="w-full flex justify-between items-center">
              <article className="contents">
                <header className="min-h-full flex flex-col justify-between">
                  <h3
                    className="text-lg font-medium line-clamp-3"
                    style={{ wordBreak: 'break-word' }}
                  >
                    {title}
                  </h3>
                  <time dateTime={date} className="text-neutral-500">
                    {getFormattedDate(new Date(date))}
                  </time>
                </header>
                <img
                  src={image || '/placeholder.png'}
                  alt=""
                  className="w-24 h-24 ml-4 rounded-lg"
                />
              </article>
            </a>
          </Link>
        ))}
      </div>
      <h2 className="my-6 text-2xl font-medium text-center xl:text-4xl">Последние комментарии</h2>
      <div className="grid gap-x-4 md:grid-cols-2">
        {comments.map((comment) => (
          <Comment key={comment.id} {...comment} />
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
