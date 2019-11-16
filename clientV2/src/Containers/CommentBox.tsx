import React from 'react';
import {
  Row, Col, Card, CardBody, Badge, InputGroup, Modal,
  ModalHeader, ModalBody, InputGroupAddon, InputGroupText, Alert, Input, CardHeader, Button,
} from 'reactstrap';
import { iCommentBoxStates, iCommentBoxProps } from '../Interfaces/Interfaces';
import { config } from '../Interfaces/Config';

const { server, port, protocol } = config.disqusProxy;

export class CommentBox extends React.Component<iCommentBoxProps, iCommentBoxStates> {
  constructor(props: iCommentBoxProps, context?: any) {
    super(props, context);
    this.state = {
      comments: '',
      commentsLoaded: false,
      name: '',
      email: '',
      content: '',
      msg: '',
      modalType: '',
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.inputOnChange = this.inputOnChange.bind(this);
    this.postComment = this.postComment.bind(this);
  }

  inputOnChange = (e: any): void => {
    const newState: any = { ...this.state };
    const target = e.currentTarget as HTMLInputElement;
    newState[target.name] = target.value;
    this.setState(newState);
  }

  toggleModal = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const pageName: string | null = (e.target as HTMLInputElement).getAttribute('pageName');
    this.setState({
      modalType: (pageName === null) ? '' : pageName,
    });
  }

  hideModal = (): void => {
    this.setState({
      modalType: '',
    });
  }


  postComment = async (e: any) => {
    e.persist(); /* keep event from event pool, otherwise we cannot access event after async  */
    e.target.disabled = true;
    const { email, name, content } = this.state;
    const { thread, replyToCommentObj } = this.props;

    /* validation */
    const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    let msg = '';
    if (content.trim().length === 0) {
      msg = 'Content is blank';
    } else if (name.length === 0) {
      msg = 'Invalid Name';
    } else if (!regex.test(email)) {
      msg = 'Invalid Email';
    }
    if (msg.length > 0) {
      this.setState({
        msg,
      });
      e.target.disabled = false;
      return;
    }

    const host = [
      (`${protocol}://${server}`),
      (port !== undefined ? (`:${port}`) : ''),
    ].join('');

    await fetch(`${host}/api/createComment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        author_email: email,
        author_name: name,
        message: content,
        thread,
        parent: (replyToCommentObj !== undefined) ? replyToCommentObj.id : null,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 0) {
          this.setState({
            comments: '',
            commentsLoaded: false,
            name: '',
            email: '',
            content: '',
            msg: 'Success, pending approval from Szhshp...',
          });
        } else {
          this.setState({
            msg: res.response,
          });
        }
      })
      .catch(() => {
        this.setState({
          msg: 'Error occured, please refresh and try again...',
        });
      });
    e.target.disabled = undefined;
  }

  render = (): JSX.Element => {
    const {
      name, content, email, msg, modalType,
    } = this.state;
    const { cancelOnClick, replyToCommentObj } = this.props;
    const closeBtn = <button className="close" onClick={this.hideModal}>&times;</button>;

    return (
      <Row>
        <Col>
          <Card>
            <CardHeader className="card-header d-flex justify-content-between p-1">
              <div style={{ fontSize: '1rem' }} className="mr-auto">留言板</div>
              <Button color="link" className="p-0 mr-1" pageName="about" onClick={this.toggleModal}>关于</Button>
            </CardHeader>
            <CardBody className="m-0 p-0">
              <InputGroup className="p-1 pt-2" size="small">
                {
                  (replyToCommentObj)
                  && (
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText size="small">
                        回复:
                        {' '}
                        {replyToCommentObj.author.name}
                      </InputGroupText>
                    </InputGroupAddon>
                  )
                }
                <Input type="text" placeholder="Your Name" className="" value={name} name="name" onChange={this.inputOnChange} />
                <Input type="email" placeholder="Your Email" className="" value={email} name="email" onChange={this.inputOnChange} />
              </InputGroup>
              <Row className="m-0 p-0">
                <Col className="d-flex m-0 p-1 border-0">
                  <textarea className="form-control p-2 m-0" name="content" onChange={this.inputOnChange} value={content} />
                </Col>
              </Row>
            </CardBody>
            <div className="card-footer text-muted m-0 p-0 form-group">

              <span className="small text-danger" />
              <button type="button" className="comment-btn btn btn-primary btn-sm pull-right m-1" onClick={this.postComment}>Post</button>
              {
                (replyToCommentObj)
                && <button type="button" className="comment-btn btn btn-outline-secondary btn-sm pull-right m-1" onClick={cancelOnClick}>Cancel</button>
              }
            </div>
          </Card>
          {
            (msg.length > 0)
            && (
              <Alert color="primary" className="small p-2">
                {msg}
              </Alert>
            )
          }
          <Modal isOpen={modalType === 'about'} size="lg">
            <ModalHeader close={closeBtn}>Disqus Proxy</ModalHeader>
            <ModalBody>
              <span>Powered By: </span>
              {['React', 'Bootstrap', 'Typescript', 'Koa'].map((e) => <Badge color="secondary" className="m-1">{e}</Badge>)}
              <br />
              <a target="_blank" rel="noopener noreferrer" href="https://github.com/szhielelp/disqus-proxy">Github</a>
              <br />
              <a target="_blank" rel="noopener noreferrer" href="http://szhshp.org/tech/2018/09/16/disqusrebuild2.html">使用指导</a>
            </ModalBody>
          </Modal>
        </Col>
      </Row>
    );
  }
}
export default CommentBox;
