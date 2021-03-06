import React from 'react';
import { Row, Col } from 'reactstrap';
import CommentTree from './CommentTree';
import CommentBox from './CommentBox';
import { iDisqusProxyStates, iComment } from '../Interfaces/Interfaces';
import { config } from '../Interfaces/Config';

class DisqusProxy extends React.Component<{}, iDisqusProxyStates> {
  constructor(props: any, context?: any) {
    super(props, context);
    this.state = {
      comments: undefined,
      commentsLoaded: false,
      replyCommentObj: undefined,
      thread: undefined,
      msg: 'Loading...',
    };
    this.toggleReplyMode = this.toggleReplyMode.bind(this);
    this.cancelReply = this.cancelReply.bind(this);
  }

  componentDidMount = (): void => {
    const {
      server, port, identifier, protocol, debug,
    } = config.disqusProxy;
    const host = [
      (`${protocol}://${server}`),
      (port !== undefined ? (`:${port}`) : ''),
    ].join('');

    if (debug) {
      console.log(`Host Name: ${host}`);
    }
    fetch(`${host}/api/getComments?identifier=${identifier}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => this.setState({
        comments: (res.code === 0) ? res : null,
        commentsLoaded: true,
      }));

    fetch(`${host}/api/getThreads?identifier=${identifier}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => this.setState({
        thread: res.response[0].id,
      }))
      .catch(() => this.setState({
        msg: 'Load Failed',
      }));
  }

  toggleReplyMode = (replyCommentObj: undefined | iComment): void => {
    this.setState({
      replyCommentObj,
    });
  }

  cancelReply = (): void => {
    this.toggleReplyMode(undefined);
  }

  render = (): JSX.Element => {
    const {
      thread, replyCommentObj, commentsLoaded, comments, msg,
    } = this.state;

    return (
      <div className="p-1">
        <CommentBox replyToCommentObj={replyCommentObj} cancelOnClick={this.cancelReply} thread={thread} />
        {
          (commentsLoaded === true)
          && <CommentTree comments={comments} replyOnClick={this.toggleReplyMode} />
        }
        {
          (commentsLoaded === false)
          && (
            <Row>
              <Col>{msg}</Col>
            </Row>
          )
        }
      </div>
    );
  }
}

export default DisqusProxy;
