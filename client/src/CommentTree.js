import React, { Component } from 'react';
import moment from 'moment';
import { Container, Row, Col, Card, CardBody, InputGroup, InputGroupAddon, InputGroupText, Input, CardHeader, Button } from 'reactstrap';
import renderHTML from 'react-render-html';


class CommentTree extends Component {

  constructor(){
    super()
    this.state = {
      arrangedComments: [],
    }
  }

  componentDidMount(){
    const comments = this.props.comments;
    let arrangedComments = [];
    if (comments && comments.response.length > 0) {
      for (var i = 0; i < comments.response.length; i++) {
        if (comments.response[i].parent == null) {
          /* loop for first level comments */
          this.createCommentElem(comments.response[i], i, null, 0);
        }
      }
    }
  }

  /* Recursion: get child and add into array */
  createCommentElem(commentObj, thisPostID, parentPostID, level){
    let arrangedComments = this.state.arrangedComments;
    const comments = this.props.comments;
    arrangedComments.push({
      ...commentObj,
      level,
      parentCommentObj: comments.response[parentPostID]
    })

    this.setState({arrangedComments: arrangedComments});

    for (var i = 0; i < comments.response.length; i++){
      if (comments.response[i].parent == comments.response[thisPostID].id) {
        this.createCommentElem(comments.response[i], i, thisPostID, level + 1);
      }
    }
  }

  replyToComment(e){
    let index = e.target.getAttribute('index');
    var parentPostObj = this.state.arrangedComments[index];
    this.props.replyOnClick(parentPostObj);
  }

  render(){

    let arrCommentsElem = [];

    if (this.state.arrangedComments && this.state.arrangedComments.length > 0) {
      for (let i = 0; i < this.state.arrangedComments.length; i++) {
        let commentObj = this.state.arrangedComments[i];
        let parentCommentObj = commentObj.parentCommentObj;
        arrCommentsElem.push(
          <Row key={commentObj.id}>
            <Col>
              <Card className="small mt-2" style={{'marginLeft': 30 * commentObj.level + 'px'}}>
                <CardHeader className="p-1">
                  <span>
                    {moment(commentObj.createdAt).format('L')}
                  </span>
                  <span>
                    <Button color="link" className="pull-right" style={{'lineHeight': 1}} index={i} onClick={this.replyToComment.bind(this)}>回复</Button>
                  </span>
                </CardHeader>
                <CardBody className="p-1">
                  <Row className="m-0">
                    <div className="d-lg-block d-md-block d-none img-fluid">
                      <img className="img-fluid" width="60px" height="60px" src={commentObj.author.avatar.permalink} alt="" />
                    </div>
                    <div className="col">
                      <div className="font-weight-bold">
                        {commentObj.author.name} 
                        {
                          (parentCommentObj!=null)
                          && 
                          <span>
                            <i className="fa fa-angle-right p-1" aria-hidden="true"/>
                            {parentCommentObj.author.name}
                          </span>
                        }
                      </div>
                      <div >{renderHTML(commentObj.message)}</div>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )
      }
    }else{
      arrCommentsElem.push(
        <Row>
          <Col>
            这篇文章暂时没有人评论, 欢迎评论。
          </Col>
        </Row>
        );
    }

    return arrCommentsElem;
  }
}
export default CommentTree;