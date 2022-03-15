import { PostCategory, UserRole } from '@prisma/client';
import { UploadClient } from '@uploadcare/upload-client';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { serverEnv } from '../../../../env/serverEnv';
import { AuthorizedError } from '../../../../errors/AuthorizedError';
import { PermissionError } from '../../../../errors/PermissionError';
import { prisma } from '../../../../prisma';
import { Context } from '../../types/Context';
import { ObjectIdScalar } from '../../types/ObjectIdScalar';
import { CreatePostInput, Post, PostPreview, UpdatePostInput } from './types';

const uploadClient = new UploadClient({ publicKey: serverEnv.uploadClientPublicKey });

@Resolver()
export class PostsResolver {
  @Query(() => [PostPreview])
  async postsFeed(
    @Arg('category', () => PostCategory, { nullable: true }) category?: PostCategory
  ): Promise<PostPreview[]> {
    return await prisma.post.findMany({
      where: { published: true, category },
      orderBy: { date: 'desc' },
      select: { id: true, date: true, image: true, title: true, user: true },
    });
  }

  @Query(() => [PostPreview])
  async postDrafts(
    @Ctx() { session }: Context,
    @Arg('category', () => PostCategory, { nullable: true }) category?: PostCategory
  ): Promise<PostPreview[]> {
    if (!session?.user) throw new AuthorizedError();
    if (session.user.role !== UserRole.ADMIN) throw new PermissionError();

    return await prisma.post.findMany({
      where: { published: false, category },
      orderBy: { date: 'desc' },
      select: { id: true, date: true, image: true, title: true, user: true },
    });
  }

  @Query(() => Post)
  async post(
    @Ctx() { session }: Context,
    @Arg('id', () => ObjectIdScalar) id: string
  ): Promise<Post> {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { comments: { orderBy: { date: 'desc' }, include: { user: true } }, user: true },
    });

    if (
      post.published ||
      post.userId === session?.user?.id ||
      session?.user?.role === UserRole.ADMIN
    )
      return post;

    throw new PermissionError();
  }

  @Mutation(() => Post)
  async publishPost(
    @Ctx() { session }: Context,
    @Arg('id', () => ObjectIdScalar) id: string
  ): Promise<Post> {
    if (!session?.user) throw new AuthorizedError();
    if (session.user.role !== UserRole.ADMIN) throw new PermissionError();

    return await prisma.post.update({
      where: { id },
      data: { published: true },
      include: { comments: { orderBy: { date: 'desc' }, include: { user: true } }, user: true },
    });
  }

  @Mutation(() => Post)
  async createPost(
    @Ctx() { session }: Context,
    @Arg('data') { imageData, ...data }: CreatePostInput
  ) {
    if (!session?.user) throw new AuthorizedError();
    const { uuid } = await uploadClient.uploadFile(Buffer.from(imageData));

    return await prisma.post.create({
      data: {
        ...data,
        userId: session.user.id,
        image: `https://ucarecdn.com/${uuid}/`,
      },
      include: { comments: { orderBy: { date: 'desc' }, include: { user: true } }, user: true },
    });
  }

  @Mutation(() => Post)
  async updatePost(
    @Ctx() { session }: Context,
    @Arg('id', () => ObjectIdScalar) id: string,
    @Arg('data') data: UpdatePostInput
  ): Promise<Post> {
    if (!session?.user) throw new AuthorizedError();
    const post = await prisma.post.findUnique({ where: { id } });

    if (
      session.user.role === UserRole.ADMIN ||
      (!post.published && session.user.id === post.userId)
    )
      return await prisma.post.update({
        where: { id },
        data,
        include: { comments: { orderBy: { date: 'desc' }, include: { user: true } }, user: true },
      });

    throw new PermissionError();
  }

  @Mutation(() => Post)
  async deletePost(
    @Ctx() { session }: Context,
    @Arg('id', () => ObjectIdScalar) id: string
  ): Promise<Post> {
    if (!session?.user) throw new AuthorizedError();
    const post = await prisma.post.findUnique({ where: { id } });

    if (
      session.user.role === UserRole.ADMIN ||
      (!post.published && session.user.id === post.userId)
    )
      return await prisma.post.delete({
        where: { id },
        include: { comments: { orderBy: { date: 'desc' }, include: { user: true } }, user: true },
      });

    throw new PermissionError();
  }
}
