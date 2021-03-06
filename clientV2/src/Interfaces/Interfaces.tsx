export interface iComment {
  response: iComment[];
  parent: number;
  id: number;
  author: any;
  level: number;
  createdAt: string;
  message: string;
  parentCommentObj: iComment;
}

export interface iDisqusProxyStates {
  comments: undefined | iComment;
  commentsLoaded: boolean;
  replyCommentObj: undefined | iComment; /* new comment or reply to existed comment */
  thread: undefined; /* specify which thread id to reply to  */
  msg: string;
}

export interface iNetworkWrapperStates {
  disqusLoaded: boolean;
  disqusType: string;
}


export interface iCommentBoxStates {
  comments: string;
  commentsLoaded: boolean;
  name: string;
  email: string;
  url: string;
  message: string;
  error: string;
  modalType: string;
  showEmojiPicker: boolean;
  showNewFeature: boolean;
}

export interface iCommentBoxProps {
  cancelOnClick(): void;
  thread: undefined | string;
  replyToCommentObj: undefined | iComment;
}

export interface iCommentTreeStates {
  arrangedComments: iComment[];
  currentPage: number;
}

export interface iCommentTreeProps {
  comments: undefined | iComment;
  replyOnClick(replyCommentObj: undefined | iComment): void;
}
