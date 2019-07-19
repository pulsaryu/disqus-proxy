import React, { Component } from 'react';
import CommentTree from './CommentTree';
import CommentBox from './CommentBox';
import { Row, Col } from 'reactstrap';

class DisqusProxy extends Component {

  constructor() {
    super()
    this.state = {
      comments: null,
      commentsLoaded: null,
      replyToCommentObj: null,
    }
  }

  componentDidMount() {
    const { server, port, identifier, https } = window.disqusProxy;
    console.log(port)
    fetch(`${(https === true ? 'https' : 'http')}://${server}${port !== undefined ? (':' + port) : ''}/api/getComments?identifier=${identifier}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => this.setState({
        comments: (res.code == 0) ? res : null,
        commentsLoaded: true,
      }))

    fetch(`${(https === true ? 'https' : 'http')}://${server}${port !== undefined ? (':' + port) : ''}/api/getThreads?identifier=${identifier}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => {
        window.disqusProxy.thread = res.response[0].id
      });


  }

  toggleReply(replyToCommentObj) {
    this.setState({
      replyToCommentObj,
    });
  }

  cancelReply() {
    this.toggleReply(null);
  }

  render() {
    return (
      <div className="p-1">
        {
          (this.state.commentsLoaded == true)
          &&
          <CommentBox replyToCommentObj={this.state.replyToCommentObj} cancelOnClick={this.cancelReply.bind(this)} />
        }
        {
          (this.state.commentsLoaded == true)
          &&
          <CommentTree comments={this.state.comments} replyOnClick={this.toggleReply.bind(this)} />
        }
        {
          (this.state.commentsLoaded == false) &&
          <Row>
            <Col>Error</Col>
          </Row>
        }
      </div>
    );
  }
}

export default DisqusProxy;
