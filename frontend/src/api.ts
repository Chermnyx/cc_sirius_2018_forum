// FIXME: connect to the backend
import { UserExistError, UserNotFoundError, UnauthorizedError } from './errors';

/**
 * @returns token
 */
export async function register(email: string, username: string, password: string): Promise<string> {
  throw new UserExistError(email, username);
}

/**
 * @returns token
 */
export async function login(email: string, password: string): Promise<string> {
  throw new UserNotFoundError(email);
}

/**
 * @returns voted?
 */
export async function vote(threadId: string, vote: -1 | 1) {
  return true;
}

export async function editProfile(
  username?: string,
  email?: string,
  password?: string,
): Promise<void> {
  throw new UnauthorizedError();
}

export async function newThread(title: string): Promise<IThread> {
  return {
    _id: '1',
    creator: {
      _id: 'user1',
      email: 'kek@kek.kek',
      username: 'kek',
    },
    rating: 0,
    title,
    creationDate: new Date().toISOString(),
  };
}

export async function getThreads(
  count: number,
  skip: number,
): Promise<{ threads: IThread[]; total: number }> {
  return {
    threads: [
      {
        _id: 'th1',
        title: 'THREAD',
        creator: {
          _id: 'user1',
          email: 'kek@kek.kek',
          username: 'kek',
        },
        rating: 1,
        creationDate: new Date().toISOString(),
      },
    ],
    total: 1,
  };
}

export async function getPosts(
  threadId: string,
  count: number,
  skip: number,
): Promise<{ posts: IPost[]; total: number }> {
  return {
    total: 2,
    posts: [
      {
        _id: 'kek',
        creationDate: new Date().toISOString(),
        threadId: 'th1',
        author: {
          _id: 'user1',
          email: 'kek@kek.kek',
          username: 'kek',
        },
        text: `\
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce in orci nec sapien varius iaculis. Donec rutrum elit facilisis, porttitor eros et, bibendum velit. Sed diam tellus, sodales ut euismod sed, molestie mollis urna. Pellentesque eu dolor hendrerit eros porta eleifend sit amet eget nunc. Vivamus a luctus ex. Pellentesque consectetur tristique mi, a iaculis nulla ultricies non. Sed purus erat, ultrices eu justo et, ullamcorper bibendum nulla. Phasellus non dignissim tellus. Sed blandit pharetra felis. Morbi aliquam eleifend diam sed rutrum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam efficitur risus quis nunc consequat, in tincidunt mi feugiat. Nulla id diam in erat pharetra efficitur vel et quam. Aenean pharetra, dolor vitae rhoncus tincidunt, eros lorem convallis nulla, sed dignissim erat tortor sed metus. Mauris tristique, felis ac auctor cursus, mi nunc mollis tortor, eget maximus nisi sem vel massa. Donec consectetur ultricies pretium.

Aliquam pulvinar nisi enim, ut aliquam urna auctor nec. Nunc nibh quam, efficitur at massa non, molestie eleifend mi. Vestibulum neque leo, aliquet ut porta eu, tempor eu lorem. Donec bibendum lacus vel tellus placerat vestibulum. Aliquam ullamcorper mauris non molestie mattis. Duis vestibulum orci vel justo sollicitudin, pretium posuere justo finibus. In dignissim a nunc id malesuada. Donec id dolor enim. Morbi dignissim finibus ipsum, quis rhoncus elit.`,
      },

      {
        _id: 'kek1',
        creationDate: new Date().toISOString(),
        pic: 'https://www.rd.com/wp-content/uploads/2016/04/01-cat-wants-to-tell-you-laptop.jpg',
        threadId: 'th1',
        author: {
          _id: 'user1',
          email: 'kek@kek.kek',
          username: 'kek',
        },
      },
    ],
  };
}
