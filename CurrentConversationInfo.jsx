import React from "react";
import { Col } from "reactstrap";
import * as styles from "./Chat.module.css";
import PropTypes from "prop-types";

class CurrentConversationInfo extends React.PureComponent {
  render() {
    const { currentConvoName, currentConvoAvatar } = this.props;
    return (
      <Col sm="6" md="6" lg="6">
        <img
          src={currentConvoAvatar}
          className={`${styles.ConversationAvatar}`}
          alt=""
        />
        <h2 className={`${styles.ConversationName}`}>{currentConvoName}</h2>
      </Col>
    );
  }
}

CurrentConversationInfo.propTypes = {
  currentConvoName: PropTypes.string.isRequired,
  currentConvoAvatar: PropTypes.string.isRequired
};

export default CurrentConversationInfo;
