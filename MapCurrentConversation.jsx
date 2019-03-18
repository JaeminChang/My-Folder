import React from "react";
import PropTypes from "prop-types";
import MapSolo from "./MapSolo";

const MapCurrentConversation = ({
  conversation,
  currentUserId,
  getPreview
}) => {
  if (conversation !== null) {
    const mappedConversationList = conversation.map(message => (
      <MapSolo
        key={message.id}
        message={message}
        currentUserId={currentUserId}
        conversation={conversation}
        getPreview={getPreview}
      />
    ));
    return mappedConversationList;
  } else {
    conversation = [];
  }
};

MapCurrentConversation.propTypes = {
  conversation: PropTypes.array,
  currentUserId: PropTypes.number,
  getPreview: PropTypes.func.isRequired
};

export default React.memo(MapCurrentConversation);
