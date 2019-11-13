import React, { Component } from 'react';
// import CommentTree from './CommentTree';
// import CommentBox from './CommentBox';
import { Row, Col } from 'reactstrap';


interface DisqusProxyStates {
  comments: undefined | object,
  commentsLoaded: boolean,
  isReplyMode: boolean, /* new comment or reply to existed comment */
  thread: undefined, /* specify which thread id to reply to  */
}

class DisqusProxy extends React.Component<{}, DisqusProxyStates> {

  constructor(props: any, context?: any) {
    super(props, context);
    this.state = {
      comments: undefined,
      commentsLoaded: false,
      isReplyMode: false,
      thread: undefined,
    }
  }

  componentDidMount() {
    const { server, port, identifier, protocol, debug } = window.disqusProxy;
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

  toggleReplyMode(isReplyMode: boolean) {
    this.setState({
      isReplyMode,
    });
  }

  cancelReply() {
    this.toggleReplyMode(false);
  }

  render() {
    return (
      <div className="p-1">
        {
          (this.state.commentsLoaded === true)
          &&
          <CommentBox isReplyMode={this.state.isReplyMode} cancelOnClick={this.cancelReply.bind(this)} />
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
