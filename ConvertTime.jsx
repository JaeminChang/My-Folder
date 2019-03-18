import React from "react";
import PropTypes from "prop-types";

const ConvertTime = ({ time }) => {
  let result;
  let newTime = time.slice(12, 16);
  let test = Number(time.slice(11, 13));
  if (test > 12) {
    result = (test - 12).toString() + ":" + time.slice(14, 16) + " PM";
  } else if (test === 0) {
    result = (test + 12).toString() + ":" + time.slice(14, 16) + " AM";
  } else {
    result = newTime + " AM";
  }
  return result;
};

ConvertTime.propTypes = {
  time: PropTypes.string.isRequired
};

export default React.memo(ConvertTime);
