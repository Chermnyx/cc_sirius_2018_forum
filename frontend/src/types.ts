interface IUser {
  _id: string;
  email: string;
  username: string;
}

interface IThread {
  _id: string;
  title: string;
  rating: number;
  creator: IUser;
  canVote?: boolean;
}

interface IPost {
  _id: string;
  threadId: string;
  author: IUser;
  text?: string;
  pic?: string;
  creationDate: string;
}
