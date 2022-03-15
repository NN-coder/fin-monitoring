import { useQuery } from '@apollo/client';
import { PostCategory } from '@prisma/client';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UserHeader } from '../../components/UserHeader';
import { POSTS_FEED, Result as PostsFeedResult } from '../../graphql/queries/POSTS_FEED';
import { prisma } from '../../prisma';
import { InferGetStaticPathsType } from '../../types/InferGetStaticPathsType';
import { ServerPostPreview } from '../../types/Post';
import { getFormattedDate } from '../../utils/getFormattedDate';
import { jsonify } from '../../utils/jsonify';

export const getStaticPaths: GetStaticPaths<{ category: 'all' | PostCategory }> = () => {
  return {
    paths: [
      { params: { category: 'all' } },
      ...Object.values(PostCategory).map((category) => ({ params: { category } })),
    ],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  PostsFeedResult,
  InferGetStaticPathsType<typeof getStaticPaths>
> = async ({ params }) => {
  const prismaPosts: ServerPostPreview[] = await prisma.post.findMany({
    where: { published: true, category: params!.category === 'all' ? undefined : params!.category },
    select: { id: true, date: true, image: true, title: true, user: true },
    orderBy: { date: 'desc' },
  });

  const postsFeed = jsonify(prismaPosts);
  return { props: { postsFeed } };
};

const CategoryPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  const {
    query: { category },
  } = useRouter();

  const { data: { postsFeed } = props } = useQuery(POSTS_FEED, {
    variables: {
      category: category === 'all' ? undefined : (category as PostCategory),
    },
  });

  return (
    <div className="max-w-3xl mx-auto grid gap-4 md:grid-cols-2">
      {postsFeed.map(({ id, title, date, image, user }, index) => (
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
      ))}
    </div>
  );
};

export default CategoryPage;
