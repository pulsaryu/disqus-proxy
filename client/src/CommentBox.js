import React, { Component } from 'react';
import moment from 'moment';
import { Container, Row, Col, Card, CardBody, InputGroup, InputGroupAddon, InputGroupText, Alert, Input, CardHeader, Button } from 'reactstrap';
import renderHTML from 'react-render-html';


class CommentBox extends Component {

  constructor(){
    super()
    this.state = {
      comments: null,
      commentsLoaded: null,
      name: '',
      email: '',
      content: '',
      msg: '',
    }
  }

  cancelOnClick(){
    this.props.cancelOnClick();
  }

  emailOnChange(e){
    this.setState({
      email: e.target.value,
    })
  }

  contentOnChange(e){
    this.setState({
      content: e.target.value,
    })
  }

  nameOnChange(e){
    this.setState({
      name: e.target.value,
    });
  };

  postComment(e){
    const { email, name, content } = this.state;
    const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    let msg = '';
    if(content.trim().length == 0){
      msg = 'Content is blank';
    }else if(name.length == 0){
      msg = 'Invalid Name';
    }else if(!regex.test(email)){
      msg = 'Invalid Email';
    }
    if (msg.length > 0) {
      this.setState({
        msg,
      });
      return;
    }

    const {server,port} = window.disqusProxy;
    fetch(`http://${server}:${port}/api/createComment`,{
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        author_email: email,
        author_name: name,
        message: content,
        thread: window.disqusProxy.thread,
        parent: (this.props.replyToCommentObj && this.props.replyToCommentObj.id) ? this.props.replyToCommentObj.id : null
      }),
    })
    .then( (res) => res.json() )
    .then( (res) => {
      if (res.code == 0) {
        this.setState({
          comments: null,
          commentsLoaded: null,
          name: '',
          email: '',
          content: '',
          msg: '评论成功, 请等待审核...',
        });
      }else{
        this.setState({
          msg: res.response,
        });
      }
    })

  };

  render(){
    return (
      <Row>
        <Col>
          <Card>
            <CardHeader className="p-1 small">
              留言板
            </CardHeader>
            <CardBody className="m-0 p-0">
              <InputGroup className="p-1" size="small">
              {
                this.props.replyToCommentObj &&
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                  Reply to
                    <span className="text-primary pl-1">
                        {this.props.replyToCommentObj.author.name}
                    </span>
                  </InputGroupText>
                </InputGroupAddon>
              }
                <Input type="text" id="comment-input-name" placeholder="Your Name" className="form-control form-control-sm" value={this.state.name} onChange={this.nameOnChange.bind(this)}/>
                <Input type="email" id="comment-input-name" placeholder="Your Email" className="form-control form-control-sm" value={this.state.email} onChange={this.emailOnChange.bind(this)}/>
              </InputGroup>
              <Row className="m-0 p-0">
                <Col className="d-flex m-0 p-1 border-0">
                  <textarea className="form-control p-2 m-0" id="comment-input-content" onChange={this.contentOnChange.bind(this)} value={this.state.content}></textarea>
                </Col>
              </Row>
            </CardBody>
            <div className="card-footer text-muted m-0 p-0 form-group">
              <span id="comment-msg" className="small text-danger"></span>
              <button type="button" className="comment-btn btn btn-secondary btn-sm pull-right m-1" id="comment-send" onClick={this.postComment.bind(this)}>Post</button>
              {
                this.props.replyToCommentObj &&
                <button type="button" className="comment-btn btn btn-outline-secondary btn-sm pull-right m-1" onClick={this.cancelOnClick.bind(this)}>Cancel</button>
              }
            </div>
          </Card>
          {
            this.state.msg.length > 0
            &&
            <Alert color="dark" className="small p-2">
              {this.state.msg}
            </Alert>
          }
        </Col>
      </Row>
    );
  }
}
export default CommentBox;