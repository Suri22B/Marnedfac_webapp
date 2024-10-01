import Post, { PostModel } from '../model/Post';

async function create(post: Post): Promise<Post> {
  const now = new Date();
  post.createdAt = post.updatedAt = now;
  const createdPost = await PostModel.create(post);
  return createdPost.toObject();
}

async function getAll(): Promise<Post[]> {
  return await PostModel.find()
    .select('+name +createdBy +createdAt +updatedAt')
    .populate({ path: 'createdBy', select: '_id name' })
    .lean()
    .exec();
}

async function getById(postId: string): Promise<Post | null> {
  return await PostModel.findById(postId)
    .select('+name +createdBy +createdAt +updatedAt')
    .populate({ path: 'createdBy', select: '_id name' })
    .lean()
    .exec();
}

async function deleteById(postId: string): Promise<{ isDeleted: boolean }> {
  await PostModel.findByIdAndDelete(postId);
  return { isDeleted: true };
}

async function update(post: Post): Promise<Post | null> {
  const now = new Date();
  post.updatedAt = now;
  return await PostModel.findByIdAndUpdate(post._id, post, {
    new: true,
  });
}

async function findByPost(postName: string): Promise<Post | null> {
  return await PostModel.findOne({ name: postName })
    .select('+name +createdBy')
    .lean()
    .exec();
}

export default {
  create,
  getAll,
  getById,
  deleteById,
  update,
  findByPost,
};
