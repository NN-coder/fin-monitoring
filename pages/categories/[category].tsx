import { PostCategory } from '@prisma/client';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';
import { UserHeader } from '../../components/UserHeader';
import { prisma } from '../../prisma';
import { ClientPostPreview, ServerPostPreview } from '../../types/Post';
import { getFormattedDate } from '../../utils/getFormattedDate';
import { jsonify } from '../../utils/jsonify';
import { setCacheControlHeader } from '../../utils/setCacheControlHeader';

type CategoryParam = 'all' | PostCategory;
const categoryParams: CategoryParam[] = ['all', ...Object.values(PostCategory)];

const isCategoryParam = (value: unknown): value is CategoryParam =>
  categoryParams.includes(value as CategoryParam);

export const getServerSideProps: GetServerSideProps<
  { posts: ClientPostPreview[] },
  { category: CategoryParam }
> = async ({ res, params }) => {
  setCacheControlHeader(res);
  if (!params || !isCategoryParam(params.category)) return { notFound: true };

  const prismaPosts: ServerPostPreview[] = await prisma.post.findMany({
    where: {
      published: true,
      category: params.category === 'all' ? undefined : params.category,
    },
    select: { id: true, date: true, image: true, title: true, user: true },
    orderBy: { date: 'desc' },
  });

  const posts = jsonify(prismaPosts);
  return { props: { posts } };
};

const CategoryPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  posts,
}) => (
  <div className="max-w-3xl mx-auto grid gap-4 md:grid-cols-2">
    {posts.length === 0 ? (
      <div className="col-span-full text-center text-neutral-500">
        К сожалению, здесь пока нет ни одного поста
      </div>
    ) : (
      posts.map(({ id, title, date, image, user }, index) => (
        <Link key={id} href={`/post/${id}`}>
          {index === 0 ? (
            <a className="col-span-full">
              <article className="contents">
                <header className="contents">
                  <h3
                    className="mb-4 text-2xl font-medium text-center line-clamp-3 xl:text-4xl"
                    style={{ wordBreak: 'break-word' }}
                  >
                    {title}
                  </h3>
                  <UserHeader
                    image={user.image ?? undefined}
                    name={user.name ?? undefined}
                    date={new Date(date)}
                  />
                </header>
                <img src={image} alt="" className="w-full h-60 mt-4 rounded-lg md:h-[22rem]" />
              </article>
            </a>
          ) : (
            <a className="flex justify-between items-center">
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
                <img src={image} alt="" className="w-24 h-24 ml-4 rounded-lg" />
              </article>
            </a>
          )}
        </Link>
      ))
    )}
  </div>
);

export default CategoryPage;
