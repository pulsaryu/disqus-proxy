export interface iComment {
  response: iComment[];
  parent: number;
  id: number;
}

export interface iDisqusProxyStates {
  comments: undefined | iComment,
  commentsLoaded: boolean,
  replyCommentObj: undefined | iReplyCommentObj, /* new comment or reply to existed comment */
  thread: undefined, /* specify which thread id to reply to  */
}

export interface iNetworkWrapperStates {
  disqusLoaded: boolean;
  disqusType: string;
}

interface iAuthor {
  name: string;
}

export interface iReplyCommentObj {
  id: number;
  author: iAuthor;
}

export interface iCommentBoxStates {
  comments: string,
  commentsLoaded: boolean,
  name: string,
  email: string,
  content: string,
  msg: string,
  modalType: string,
}

export interface iCommentBoxProps {
  cancelOnClick: any;
  thread: undefined | string;
  replyToCommentObj: any;
}

export interface iCommentTreeStates {
  arrangedComments: any[],
  currentPage: number,
}

export interface iCommentTreeProps {
  comments: undefined | iComment,
  replyToCommentObj: undefined | iReplyCommentObj,
}