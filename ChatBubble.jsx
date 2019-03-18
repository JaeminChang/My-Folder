import React from "react";
import PropTypes from "prop-types";
import "./ChatTheme.css";

const ChatBubble = ({ firstName, lastName, body, dateCreated, isUser }) => {
  return isUser ? (
    <li className="reverse">
      <div className="chat-time">{dateCreated}</div>
      <div className="chat-content">
        <h5>
          {firstName} {"  "}
          {lastName}
        </h5>
        <div className="box bg-light-info">{body}</div>
      </div>
      <div className="chat-img" />
    </li>
  ) : (
    <li>
      <div className="chat-img" />
      <div className="chat-content">
        <h5>
          {firstName} {"  "}
          {lastName}
        </h5>
        <div className="box bg-light-inverse">{body}</div>
      </div>
      <div className="chat-time">{dateCreated}</div>
    </li>
  );
};

ChatBubble.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  body: PropTypes.object.isRequired,
  dateCreated: PropTypes.object.isRequired,
  isUser: PropTypes.bool.isRequired
};

export default React.memo(ChatBubble);
