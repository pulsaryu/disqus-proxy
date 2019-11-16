import React from 'react';
import { Row, Col } from 'reactstrap';
import CommentTree from './CommentTree';
import CommentBox from './CommentBox';
import { iDisqusProxyStates, iReplyCommentObj } from './Interfaces';
import { config } from './Config';

class DisqusProxy extends React.Component<{}, iDisqusProxyStates> {
  constructor(props: any, context?: any) {
    super(props, context);
    this.state = {
      comments: undefined,
      commentsLoaded: false,
      replyCommentObj: undefined,
      thread: undefined,
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
      }));
  }

  toggleReplyMode = (replyCommentObj: undefined | iReplyCommentObj): void => {
    this.setState({
      replyCommentObj,
    });
  }

  cancelReply = (): void => {
    this.toggleReplyMode(undefined);
  }

  render = (): JSX.Element => {
    const {
      thread, replyCommentObj, commentsLoaded, comments,
    } = this.state;

    return (
      <div className="p-1">
        {
          (commentsLoaded === true)
          && <CommentBox replyToCommentObj={replyCommentObj} cancelOnClick={this.cancelReply} thread={thread} />
        }
        {
          (commentsLoaded === true)
          && <CommentTree comments={comments} replyOnClick={this.toggleReplyMode} />
        }
        {
          (commentsLoaded === false)
          && (
            <Row>
              <Col>Loading...</Col>
            </Row>
          )
        }
      </div>
    );
  }
}

export default DisqusProxy;
