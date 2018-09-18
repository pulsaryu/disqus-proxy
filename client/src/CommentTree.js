import React, { Component } from 'react';
import moment from 'moment';
import { Row, Col, Card, CardBody, Badge, CardHeader, Button, ButtonToolbar, ButtonGroup } from 'reactstrap';
import renderHTML from 'react-render-html';

const pageLength = 20; /* disqus API will return 100 comments at most */

class CommentTree extends Component {

  constructor(){
    super()
    this.state = {
      arrangedComments: [],
      currentPage: 1,
    }
  }

  componentDidMount(){
    const comments = this.props.comments;
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

  pageOnClick(e){
    this.setState({
      currentPage: e.target.getAttribute('page')
    })
  }

  replyToComment(e){
    let index = e.target.getAttribute('index');
    let parentPostObj = this.state.arrangedComments[index];
    this.props.replyOnClick(parentPostObj);
  }

  render(){

    let arrCommentsElem = [];

    if (this.state.arrangedComments && this.state.arrangedComments.length > 0) {
      for (let i = ( this.state.currentPage -1 ) * pageLength ; (i < this.state.currentPage * pageLength) && (i < this.state.arrangedComments.length); i++) {
        let commentObj = this.state.arrangedComments[i];
        let parentCommentObj = commentObj.parentCommentObj;
        arrCommentsElem.push(
          <Row key={commentObj.id}>
            <Col>
              <Card className="mt-2" size="sm" style={{'marginLeft': 30 * commentObj.level + 'px'}}>
                <CardHeader className="p-1">
                  <Badge color="primary">{commentObj.author.name}</Badge>
                    {
                      (parentCommentObj!=null)
                      && 
                        [
                          <i className="fa fa-angle-right p-1" aria-hidden="true" key={commentObj.id}/>,
                          <Badge color="primary">
                            {parentCommentObj.author.name}
                          </Badge>
                        ]
                    }

                  <span className="font-weight-bold">
                  </span>
                  <span className="pl-1">
                    - <Badge color="secondary">{moment(commentObj.createdAt).format('YYYY-MM-DD')}</Badge>
                  </span>
                  <span>
                    <Button size="sm" color="link" className="pull-right" style={{'lineHeight': 1}} index={i} onClick={this.replyToComment.bind(this)}>回复</Button>
                  </span>
                </CardHeader>
                <CardBody className="p-1">
                  <Row className="m-0">
                    <div className="d-lg-block d-md-block d-none img-fluid">
                      <img className="img-fluid" width="50px" height="50px" src={commentObj.author.avatar.permalink} alt="" />
                    </div>
                    <div className="col">
                      <div >{renderHTML(commentObj.message)}</div>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )
      }
      let buttonGroup = [];

      if (this.state.arrangedComments.length > pageLength) {
        let previousBtnProp = {};
        let nextBtnProp = {};

        if (this.state.currentPage == 1) previousBtnProp['disabled'] = true;
        if (this.state.currentPage == (Math.floor(this.state.arrangedComments.length / pageLength) + 1)) nextBtnProp['disabled'] = true;

        buttonGroup.push(<Button size="sm" color="toolbar" key="0" page={parseInt(this.state.currentPage) - 1} {...previousBtnProp} onClick={this.pageOnClick.bind(this)}>{'<'}</Button>)
        for (let i = 1; i <= (this.state.arrangedComments.length / pageLength + 1) ; i++) {
          buttonGroup.push(<Button size="sm" page={i} key={i} color={(this.state.currentPage == i)?'primary':'toolbar'} onClick={this.pageOnClick.bind(this)}>{i}</Button>);
        }
        buttonGroup.push(<Button size="sm" color="toolbar" key="-1" page={parseInt(this.state.currentPage) + 1} {...nextBtnProp} onClick={this.pageOnClick.bind(this)}>{'>'}</Button>)
      }

      arrCommentsElem.push(
        <Row className="pt-3">
          <Col>
            {
              (this.state.arrangedComments.length <= pageLength)
              && 
              <span className="pl-1">
                总计 {this.state.arrangedComments.length} 条评论,
              </span>
            }
            {
              (this.state.arrangedComments.length > pageLength)
              && 
              <span className="pl-1">
                总计 {this.state.arrangedComments.length} 条评论, 显示 {( this.state.currentPage -1 ) * pageLength +1 } - {Math.min(this.state.currentPage * pageLength, this.state.arrangedComments.length)} 条评论
              </span>
            } 
            <span className="pull-right">
              <ButtonToolbar>
                <ButtonGroup>
                  {buttonGroup}
                </ButtonGroup>
              </ButtonToolbar>
            </span>
          </Col>
        </Row>
      )
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