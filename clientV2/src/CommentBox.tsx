import React, { Component } from 'react';
import { Row, Col, Card, CardBody, InputGroup, Modal, ModalHeader, ModalBody, ModalFooter, InputGroupAddon, InputGroupText, Alert, Input, CardHeader, Button } from 'reactstrap';

interface CommentBoxStates {
  comments: string,
  commentsLoaded: boolean,
  name: string,
  email: string,
  content: string,
  msg: string,
  openAboutPage: boolean,
}

interface CommentBoxProps {
  cancelOnClick: any;
}

export class NetworkWrapper extends React.Component<CommentBoxProps, CommentBoxStates> {
  constructor(props: any, context?: any) {
    super(props, context);
    this.state = {
      comments: '',
      commentsLoaded: false,
      name: '',
      email: '',
      content: '',
      msg: '',
      openAboutPage: false,
    }
  }

  cancelOnClick() {
    this.props.cancelOnClick();
  }

  emailOnChange(e: any) {
    this.setState({
      email: e.target.value,
    })
  }

  contentOnChange(e: any) {
    this.setState({
      content: e.target.value,
    })
  }

  nameOnChange(e: any) {
    this.setState({
      name: e.target.value,
    });
  };

  toggleAboutPage(e: any) {
    this.setState({
      openAboutPage: !this.state.openAboutPage,
    });
  }

  postComment(e: any) {
    const { email, name, content } = this.state;
    const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    let msg = '';
    if (content.trim().length == 0) {
      msg = 'Content is blank';
    } else if (name.length == 0) {
      msg = 'Invalid Name';
    } else if (!regex.test(email)) {
      msg = 'Invalid Email';
    }
    if (msg.length > 0) {
      this.setState({
        msg,
      });
      return;
    }

    const { server, port, identifier, protocol, debug } = window.disqusProxy;
    const host = [
      (protocol + '://' + server),
      (port !== undefined ? (':' + port) : ''),
    ].join('');

    fetch(`${host}/api/createComment`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        author_email: email,
        author_name: name,
        message: content,
        thread: window.disqusProxy.thread, //TODO: pass the value via props
        parent: (this.props.replyToCommentObj && this.props.replyToCommentObj.id) ? this.props.replyToCommentObj.id : null
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code == 0) {
          this.setState({
            comments: '',
            commentsLoaded: false,
            name: '',
            email: '',
            content: '',
            msg: '评论成功, 请等待审核...',
          });
        } else {
          this.setState({
            msg: res.response,
          });
        }
      })

  };

  render() {
    return (
      <Row>
        <Col>
          <Card>
            <CardHeader className="p-1 small">
              <span style={{ fontSize: '1rem' }}>留言板</span>
              <Button color="link" className="pull-right p-0" onClick={this.toggleAboutPage.bind(this)}>关于</Button>
            </CardHeader>
            <CardBody className="m-0 p-0">
              <InputGroup className="p-1" size="small">
                {
                  this.props.replyToCommentObj &&
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      回复:
                    <span className="text-primary pl-1">
                        {this.props.replyToCommentObj.author.name}
                      </span>
                    </InputGroupText>
                  </InputGroupAddon>
                }
                <Input type="text" placeholder="Your Name" className="form-control form-control-sm" value={this.state.name} onChange={this.nameOnChange.bind(this)} />
                <Input type="email" placeholder="Your Email" className="form-control form-control-sm" value={this.state.email} onChange={this.emailOnChange.bind(this)} />
              </InputGroup>
              <Row className="m-0 p-0">
                <Col className="d-flex m-0 p-1 border-0">
                  <textarea className="form-control p-2 m-0" onChange={this.contentOnChange.bind(this)} value={this.state.content}></textarea>
                </Col>
              </Row>
            </CardBody>
            <div className="card-footer text-muted m-0 p-0 form-group">

              <span className="small text-danger"></span>
              <button type="button" className="comment-btn btn btn-primary btn-sm pull-right m-1" onClick={this.postComment.bind(this)}>Post</button>
              {
                this.props.replyToCommentObj &&
                <button type="button" className="comment-btn btn btn-outline-secondary btn-sm pull-right m-1" onClick={this.cancelOnClick.bind(this)}>Cancel</button>
              }
            </div>
          </Card>
          {
            this.state.msg.length > 0
            &&
            <Alert color="primary" className="small p-2">
              {this.state.msg}
            </Alert>
          }
          <Modal isOpen={this.state.openAboutPage}>
            <ModalHeader>关于</ModalHeader>
            <ModalBody>
              使用 React 通过 Bootstrap4 设计实现
              <br />
              <a target="_blank" rel="noopener noreferrer" href="https://github.com/szhielelp/disqus-proxy">Github</a>
              <br />
              <a target="_blank" rel="noopener noreferrer" href="http://szhshp.org/tech/2018/09/16/disqusrebuild2.html">使用指导</a>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggleAboutPage.bind(this)}>OK</Button>
            </ModalFooter>
          </Modal>
        </Col>
      </Row>
    );
  }
}
export default CommentBox;