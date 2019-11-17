import React from 'react';
import { Picker } from 'emoji-mart';
import {
  Row, Col, Card, CardBody, Badge, InputGroup, Modal,
  ModalHeader, ModalBody, InputGroupAddon, InputGroupText, Alert, Input, CardHeader, Button, Tooltip,
} from 'reactstrap';
import { iCommentBoxStates, iCommentBoxProps } from '../Interfaces/Interfaces';
import { config } from '../Interfaces/Config';
import 'emoji-mart/css/emoji-mart.css';

const { server, port, protocol } = config.disqusProxy;

export class CommentBox extends React.Component<iCommentBoxProps, iCommentBoxStates> {
  constructor(props: iCommentBoxProps, context?: any) {
    super(props, context);
    this.state = {
      comments: '',
      commentsLoaded: false,
      name: '',
      email: '',
      url: '',
      message: '',
      error: '',
      modalType: '',
      showEmojiPicker: false,
      showNewFeature: false,
    };
  }

  toggleNewFeature = (e: any): void => {
    const { showNewFeature } = this.state;
    this.setState({
      showNewFeature: !showNewFeature,
    });
  }

  componentDidMount = (): void => {
    // show new feature until 2020
    if (new Date().getFullYear() === 2019) {
      this.setState({
        showNewFeature: true,
      });
    }
  }


  inputOnChange = (e: any): void => {
    const newState: any = { ...this.state };
    const target = e.currentTarget as HTMLInputElement;
    newState[target.name] = target.value;
    this.setState(newState);
  }

  toggleEmojiPicker = (): void => {
    const { showEmojiPicker } = this.state;

    this.setState({
      showEmojiPicker: !showEmojiPicker,
    });
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
    const {
      email, name, url, message,
    } = this.state;
    const { thread, replyToCommentObj } = this.props;

    /* validation */
    const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    let error = '';
    if (message.trim().length === 0) {
      error = 'Message is blank';
    } else if (name.length === 0) {
      error = 'Invalid Name';
    } else if (!regex.test(email)) {
      error = 'Invalid Email';
    }
    if (error.length > 0) {
      this.setState({
        error,
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
        author_url: url,
        message,
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
            message: '',
            error: '评论成功, 等待审核...',
          });
        } else {
          this.setState({
            error: res.response,
          });
        }
      })
      .catch(() => {
        this.setState({
          error: '啊哈好像出错了, 刷新试试...',
        });
      });
    e.target.disabled = undefined;
  }

  render = (): JSX.Element => {
    const {
      name, message, email, url, error, modalType, showEmojiPicker, showNewFeature,
    } = this.state;
    const { cancelOnClick, replyToCommentObj } = this.props;
    const closeBtn = <button className="close" onClick={this.hideModal}>&times;</button>;

    return (
      <Row>
        <Col>
          <Card>
            <CardHeader className="card-header d-flex justify-content-between p-1">
              <div style={{ fontSize: '1rem' }} className="mr-auto">留言板</div>
              <Button color="url" className="p-0 mr-1 text-primary" pageName="about" onClick={this.toggleModal}>关于</Button>
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
                <Input type="text" placeholder="Name" className="" value={name} name="name" onChange={this.inputOnChange} />
                <Input type="email" placeholder="Email" className="" value={email} name="email" onChange={this.inputOnChange} />
                <Input type="url" placeholder="URL (Optional)" className="" value={url} name="url" onChange={this.inputOnChange} />
              </InputGroup>
              <Row className="m-0 p-0">
                <Col className="d-flex m-0 p-1 border-0">
                  <textarea className="form-control p-2 m-0" name="message" onChange={this.inputOnChange} value={message} placeholder="Message" />
                </Col>
              </Row>
            </CardBody>
            <div className="card-footer text-muted m-0 p-0 form-group d-flex flex-row-reverse position-relative">

              <span className="small text-danger" />
              {
                (replyToCommentObj)
                && <Button className="btn-sm m-1" onClick={cancelOnClick}>Cancel</Button>
              }
              <Button color="primary" size="sm" className="m-1" onClick={this.postComment}>Post</Button>
              <Button color="light" size="sm" className="m-1" onClick={this.toggleEmojiPicker} id="emoji">
                <i className="fa fa-smile-o" />
              </Button>
              <Tooltip placement="top" isOpen={showNewFeature} autohide target="emoji" toggle={this.toggleNewFeature}>
                New! Try emoji here~
              </Tooltip>
              {
                showEmojiPicker
                && (
                  <span className="position-absolute mt-5" style={{ zIndex: 1000 }}>
                    <Picker
                      set="google"
                      onSelect={(e: any): void => {
                        this.setState({
                          message: message + e.native,
                        });
                      }}
                    />
                  </span>
                )
              }
            </div>
          </Card>
          {
            (error.length > 0)
            && (
              <Alert color="danger" className="small p-2">
                {error}
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
