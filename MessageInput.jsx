import React from "react";
import { Row, Col, Form, Input, Button } from "reactstrap";
import * as styles from "./Chat.module.css";
import PropTypes from "prop-types";

class MessageInput extends React.Component {
  render() {
    return (
      <div className="ConversationContainer">
        <Row>
          <Col>
            <Form onSubmit={this.props.handleSubmitKeyPress}>
              <Row>
                <Col
                  sm={{ size: 9 }}
                  md={{ size: 10 }}
                  lg={{ size: 10 }}
                  className={styles.MessageInputCol}
                >
                  <Input
                    type="text"
                    name="body"
                    value={this.props.body}
                    onChange={this.props.handleChange}
                    className={styles.MessageInputBox}
                    placeholder="Type your message here"
                  />
                </Col>
                <Col
                  sm={{ size: 3 }}
                  md={{ size: 2 }}
                  lg={{ size: 2 }}
                  className={styles.MessageSendBtnCol}
                >
                  <Button
                    type="submit"
                    color="primary"
                    size="md"
                    onClick={this.props.onSubmit}
                    onKeyDown={this.props.handleSubmitKeyPress}
                    disabled={!this.props.body}
                    className={styles.MessageInputBox}
                  >
                    Send
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

MessageInput.propTypes = {
  handleSubmitKeyPress: PropTypes.func.isRequired,
  body: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default MessageInput;
