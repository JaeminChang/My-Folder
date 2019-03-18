import React from "react";
import * as messageBoardService from "../../../services/messageBoardService";
import styles from "./messageBoard.module.css";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import logger from "../../../logger";

const _logger = logger.extend("MessageBoard");

class MessageBoard extends React.Component {
  state = {
    usersInfo: [],
    infoComponents: []
  };

  componentDidMount() {
    this.onLoadPage();
  }
  onLoadPage = () => {
    messageBoardService
      .getConversationInfo()
      .then(this.onGetConversationSuccess)
      .catch(this.onGetConversationError);
  };

  onGetConversationSuccess = response => {
    _logger("JOSEPh MESSAGE BOARD", response);
    const profileInfo = response.item;
    const mappedInfo = this.mapUsersInfo(profileInfo);
    this.setState({
      profileInfo,
      infoComponents: mappedInfo
    });
  };

  onGetConversationError = error => {
    _logger(error);
  };

  handleClick = (convoId, participantId) => {
    this.props.history.push(
      `/chat?conversationId=${convoId}&recepientId=${participantId}`
    );
  };

  pushToChat = () => {
    this.props.history.push("/chat");
  };

  convertTime = time => {
    let result;
    let newTime = time.slice(12, 16);
    let test = Number(time.slice(11, 13));
    if (test > 12) {
      result = (test - 12).toString() + ":" + time.slice(14, 16) + " PM";
    } else {
      result = newTime + " AM";
    }
    return result;
  };

  checkMessageOrigin = payload => {
    let newMessage;
    if (payload.userId === payload.currentId) {
      newMessage = "You: " + payload.body;
    } else {
      newMessage = payload.body;
    }
    return newMessage;
  };

  mapUsersInfo = users => {
    const mappedUsers = users.map(user => (
      <div className="scrollbar scrollbar-rare-wind" key={user.conversationId}>
        <a
          href=""
          onClick={e => {
            e.preventDefault();
            this.handleClick(user.conversationId, user.participantId);
          }}
          key={user.conversationId}
          className={`${styles.a} a`}
        >
          <div className={`${styles.userImg} user-Img`}>
            <img
              src={user.avatarUrl}
              style={{ borderRadius: "75%" }}
              alt="user"
            />
            <span
              className={`${styles.profileStatus} ${
                styles.online
              } profile-status online pull-right`}
            />
          </div>

          <div className={`${styles.mailContent}`}>
            <h5>
              {user.firstName} {user.lastName}
            </h5>
            <span className={`${styles.mailDesc}`}>
              {this.checkMessageOrigin(user)}
            </span>
            <span className={`${styles.time}`}>
              {this.convertTime(user.timeSent)}
            </span>
          </div>
        </a>
      </div>
    ));
    return mappedUsers;
  };

  render() {
    return (
      <div className="card h-100">
        <div className="card-body">
          <h4 className="card-title">
            <a
              href=""
              onClick={e => {
                e.preventDefault();
                this.pushToChat();
              }}
            >
              Recent Messages
            </a>
            <hr />
          </h4>
          <div className={`${styles.messageBox} message-box`}>
            <div className={`${styles.messageWidget} message-widget`}>
              {this.state.infoComponents}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
MessageBoard.propTypes = {
  history: PropTypes.object
};

export default withRouter(MessageBoard);
