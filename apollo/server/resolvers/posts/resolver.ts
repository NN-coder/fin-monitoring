import { PostCategory, UserRole } from '@prisma/client';
import { UploadClient } from '@uploadcare/upload-client';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { fileTypeFromBuffer } from 'file-type';
import { serverEnv } from '../../../../env/serverEnv';
import { AuthorizedError } from '../../../../errors/AuthorizedError';
import { PermissionError } from '../../../../errors/PermissionError';
import { prisma } from '../../../../prisma';
import { Context } from '../../types/Context';
import { ObjectIdScalar } from '../../types/ObjectIdScalar';
import { CreatePostInput, Post, PostPreview, UpdatePostInput } from './types';
import { isSupportedImageType } from '../../../../types/supportedImageType';
import { UnsupportedFileTypeError } from '../../../../errors/UnsupportedFileTypeError';

const uploadClient = new UploadClient({ publicKey: serverEnv.uploadClientPublicKey });

const uploadImage = async (imageData: number[]) => {
  const imageBuffer = Buffer.from(imageData);
  const fileTypeResult = await fileTypeFromBuffer(imageBuffer);

  if (!fileTypeResult || !isSupportedImageType(fileTypeResult.mime))
    throw new UnsupportedFileTypeError();

  const { uuid } = await uploadClient.uploadFile(imageBuffer);
  return `https://ucarecdn.com/${uuid}/`;
};

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
    @Arg('input') { imageData, ...input }: CreatePostInput
  ) {
    if (!session?.user) throw new AuthorizedError();

    return await prisma.post.create({
      data: {
        ...input,
        userId: session.user.id,
        image: imageData ? await uploadImage(imageData) : null,
      },
      include: { comments: { orderBy: { date: 'desc' }, include: { user: true } }, user: true },
    });
  }

  @Mutation(() => Post)
  async updatePost(
    @Ctx() { session }: Context,
    @Arg('id', () => ObjectIdScalar) id: string,
    @Arg('input') { imageData, ...input }: UpdatePostInput
  ): Promise<Post> {
    if (!session?.user) throw new AuthorizedError();
    const post = await prisma.post.findUnique({ where: { id } });

    if (
      session.user.role === UserRole.ADMIN ||
      (!post.published && session.user.id === post.userId)
    )
      return await prisma.post.update({
        where: { id },
        data: { ...input, image: imageData ? await uploadImage(imageData) : post.image },
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
