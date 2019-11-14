export interface iDisqusProxyStates {
  comments: undefined | object,
  commentsLoaded: boolean,
  replyToCommentObj: undefined | iReplyToCommentObj, /* new comment or reply to existed comment */
  thread: undefined, /* specify which thread id to reply to  */
}

export interface iNetworkWrapperStates {
  disqusLoaded: boolean;
  disqusType: string;
}

interface iAuthor {
  name: string;
}

export interface iReplyToCommentObj {
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
  openAboutPage: boolean,
}

export interface iCommentBoxProps {
  cancelOnClick: any;
  thread: undefined | string;
  replyToCommentObj: undefined | iReplyToCommentObj;
}
