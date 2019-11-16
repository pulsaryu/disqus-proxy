import React from 'react';
import moment from 'moment';
import {
  Row, Col, Card, CardBody, Badge, CardHeader, Button, ButtonToolbar, ButtonGroup,
} from 'reactstrap';
import {
  iCommentTreeStates, iCommentTreeProps, iComment,
} from '../Interfaces/Interfaces';

const pageLength = 20; /* disqus API will return 100 comments at most */

class CommentTree extends React.Component<iCommentTreeProps, iCommentTreeStates> {
  constructor(props: iCommentTreeProps, context: any) {
    super(props, context);

    this.state = {
      arrangedComments: [],
      currentPage: 1,
    };
    this.replyToComment = this.replyToComment.bind(this);
    this.pageOnClick = this.pageOnClick.bind(this);
  }

  componentDidMount() {
    const { comments } = this.props;
    if (comments && comments.response.length > 0) {
      for (let i = 0; i < comments.response.length; i += 1) {
        if (comments.response[i].parent == null) {
          /* loop for first level comments */
          this.createCommentElem(comments.response[i], i, -1, 0);
        }
      }
    }
  }

  replyToComment = (e: any): void => {
    const { arrangedComments } = this.state;
    const { replyOnClick } = this.props;
    const index = e.target.getAttribute('index');
    const parentPostObj = arrangedComments[index];
    replyOnClick(parentPostObj);
  }

  pageOnClick = (currentPage: number): void => {
    this.setState({
      currentPage,
    });
  }

  /* Recursion: get child and add into array */
  createCommentElem(commentObj: iComment, thisPostID: number, parentPostID: number, level: number) {
    const { arrangedComments } = this.state;
    const { comments } = this.props;

    if (comments !== undefined) {
      arrangedComments.push({
        ...commentObj,
        level,
        parentCommentObj: comments.response[parentPostID],
      });

      this.setState({ arrangedComments });

      for (let i = 0; i < comments.response.length; i += 1) {
        if (+comments.response[i].parent === +comments.response[thisPostID].id) {
          this.createCommentElem(comments.response[i], i, thisPostID, level + 1);
        }
      }
    }
  }


  render(): JSX.Element[] {
    const { currentPage, arrangedComments } = this.state;
    const arrCommentsElem = [];

    if (arrangedComments && arrangedComments.length > 0) {
      for (let i = (currentPage - 1) * pageLength; (i < currentPage * pageLength) && (i < arrangedComments.length); i += 1) {
        const commentObj = arrangedComments[i];
        const { parentCommentObj } = commentObj;
        arrCommentsElem.push(
          <Row key={commentObj.id}>
            <Col>
              <Card className="mt-2" size="sm" style={{ marginLeft: `${30 * commentObj.level}px` }}>
                <CardHeader className="p-1">
                  <Badge color="primary">{commentObj.author.name}</Badge>
                  {
                    (parentCommentObj != null)
                    && [
                      <i className="fa fa-angle-right p-1" aria-hidden="true" key={commentObj.id} />,
                      <Badge color="primary">
                        {parentCommentObj.author.name}
                      </Badge>,
                    ]
                  }

                  <span className="font-weight-bold" />
                  <span className="pl-1">
                    -
                    {' '}
                    <Badge color="secondary">{moment(commentObj.createdAt).format('YYYY-MM-DD')}</Badge>
                  </span>
                  <span>
                    <Button size="sm" color="link" className="pull-right" style={{ lineHeight: 1 }} index={i} onClick={this.replyToComment}>回复</Button>
                  </span>
                </CardHeader>
                <CardBody className="p-1">
                  <Row className="m-0">
                    <div className="d-lg-block d-md-block d-none img-fluid">
                      <img className="img-fluid" width="50px" height="50px" src={commentObj.author.avatar.permalink} alt="" />
                    </div>
                    <div className="col">
                      <div dangerouslySetInnerHTML={{ __html: commentObj.message }} />
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>,
        );
      }
      const buttonGroup = [];

      if (arrangedComments.length > pageLength) {
        const isFirstPage = !!(currentPage === 1);
        const isLastPage = !!(currentPage === (Math.floor(arrangedComments.length / pageLength) + 1));

        buttonGroup.push(<Button size="sm" color="toolbar" key="0" disabled={isFirstPage} onClick={(): void => this.pageOnClick(currentPage - 1)}>{'<'}</Button>);
        for (let i = 1; i <= (arrangedComments.length / pageLength + 1); i += 1) {
          buttonGroup.push(<Button size="sm" key={i} color={(currentPage === i) ? 'primary' : 'toolbar'} onClick={(): void => this.pageOnClick(i)}>{i}</Button>);
        }
        buttonGroup.push(<Button size="sm" color="toolbar" key="-1" disabled={isLastPage} onClick={(): void => this.pageOnClick(currentPage + 1)}>{'>'}</Button>);
      }

      arrCommentsElem.push(
        <Row className="pt-3">
          <Col>
            {
              (arrangedComments.length <= pageLength)
              && (
                <span className="pl-1">
                  总计
                  {' '}
                  {arrangedComments.length}
                  {' '}
                  条评论,
                </span>
              )
            }
            {
              (arrangedComments.length > pageLength)
              && (
                <span className="pl-1">
                  总计
                  {' '}
                  {arrangedComments.length}
                  {' '}
                  条评论, 显示
                  {' '}
                  {(currentPage - 1) * pageLength + 1}
                  {' '}
                  -
                  {' '}
                  {Math.min(currentPage * pageLength, arrangedComments.length)}
                  {' '}
                  条评论
                </span>
              )
            }
            <span className="pull-right">
              <ButtonToolbar>
                <ButtonGroup>
                  {buttonGroup}
                </ButtonGroup>
              </ButtonToolbar>
            </span>
          </Col>
        </Row>,
      );
    } else {
      arrCommentsElem.push(
        <Row>
          <Col>
            这篇文章暂时没有人评论, 欢迎评论。
          </Col>
        </Row>,
      );
    }

    return arrCommentsElem;
  }
}
export default CommentTree;
