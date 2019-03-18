import React from "react";
import PropTypes from "prop-types";
import ChatBubble from "./ChatBubble";
import ConvertTime from "./ConvertTime";

const MapSolo = ({ message, currentUserId, getPreview }) => {
  let search = window.location.search;
  let params = new URLSearchParams(search);
  let query = Number(params.get("conversationId"));
  let isUser = false;
  if (message.userId === currentUserId) {
    isUser = true;
  }
  if (message.conversationId === query) {
    return (
      <ChatBubble
        key={message.id}
        firstName={message.firstName}
        lastName={message.lastName}
        body={getPreview(message.body)}
        dateCreated={<ConvertTime time={message.dateCreated} />}
        isUser={isUser}
      />
    );
  }
};

MapSolo.propTypes = {
  conversation: PropTypes.array,
  currentUserId: PropTypes.number,
  getPreview: PropTypes.func
};

export default React.memo(MapSolo);
