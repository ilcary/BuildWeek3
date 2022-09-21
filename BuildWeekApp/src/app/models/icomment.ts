export interface IComment {
  id: number|undefined;
  content: string;
  userId: number;
  postId: number;
  dateOfPublish: Date;
}
