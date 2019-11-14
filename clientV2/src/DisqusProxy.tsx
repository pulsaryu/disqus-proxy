import React from 'react';
// import CommentTree from './CommentTree';
import CommentBox from './CommentBox';
import { Row, Col } from 'reactstrap';
import { iDisqusProxyStates, iReplyToCommentObj } from './Interfaces'
import { config } from './Config';

class DisqusProxy extends React.Component<{}, iDisqusProxyStates> {

  constructor(props: any, context?: any) {
    super(props, context);
    this.state = {
      comments: undefined,
      commentsLoaded: false,
      replyToCommentObj: undefined,
      thread: undefined,
    }
  }

  componentDidMount() {
    const { server, port, identifier, protocol, debug } = config.disqusProxy;
    const host = [
      (protocol + '://' + server),
      (port !== undefined ? (':' + port) : ''),
    ].join('');

    if (debug) {
      console.log(`Host Name: ${host}`)
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
        thread: res.response[0].id
      }));
  }

  toggleReplyMode(replyToCommentObj: undefined | iReplyToCommentObj) {
    this.setState({
      replyToCommentObj,
    });
  }

  cancelReply() {
    this.toggleReplyMode(undefined);
  }

  render() {

    const { thread, replyToCommentObj } = this.state;

    return (
      <div className="p-1">
        {
          (this.state.commentsLoaded === true)
          &&
          <CommentBox replyToCommentObj={replyToCommentObj} cancelOnClick={this.cancelReply.bind(this)} thread={thread} />
        }
        {
          (this.state.commentsLoaded === true)
          &&
          <div >2222222222</div>
          // <CommentTree comments={this.state.comments} replyOnClick={this.toggleReplyMode.bind(this)} />
        }
        {
          (this.state.commentsLoaded === false) &&
          <Row>
            <Col>Error</Col>
          </Row>
        }
      </div>
    );
  }
}

export default DisqusProxy;
