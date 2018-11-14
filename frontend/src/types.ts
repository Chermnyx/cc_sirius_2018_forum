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
  vote?: 1 | -1;
  creationDate: string;
}

interface IPost {
  _id: string;
  threadId: string;
  author: IUser;
  text?: string;
  pic?: string;
  creationDate: string;
}
