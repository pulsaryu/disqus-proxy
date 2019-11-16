import React from 'react';
import {
  Row, Col, Input ,
} from 'reactstrap';


export class CommentManageModal extends React.Component {
  constructor(props: any, context?: any) {
    super(props, context);
    this.state = {
      access_token: '',
    };
  }

  render = (): JSX.Element => (
    <Row>
      <Col>
        <Input placeholder="Access Token" />
      </Col>
    </Row>
  )
}
export default CommentManageModal;
