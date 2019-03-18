import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Button } from "reactstrap";
import * as styles from "./Chat.module.css";

const SearchUsersToAddMap = ({ searchResults, setRecepientUserId }) => {
  const searchResultsList = searchResults.map(result => (
    <div key={result.userId}>
      <Row>
        <Col sm={{ size: 2 }} md={{ size: 2 }} lg={{ size: 2 }}>
          <img
            src={result.avatarUrl}
            className={styles.SearchAvatar}
            alt="AvatarURL"
          />
        </Col>
        <Col sm={{ size: 8 }} md={{ size: 8 }} lg={{ size: 8 }}>
          <h5>
            {result.firstName}
            {"  "}
            {result.lastName}
            <br />
            <small>{result.email}</small>
          </h5>
        </Col>
        <Col>
          <Button
            type="button"
            color="link"
            size="sm"
            onClick={() => setRecepientUserId(result.userId)}
            className={styles.SelectUserBtn}
          >
            Select
          </Button>
        </Col>
      </Row>
      <hr />
    </div>
  ));
  return searchResultsList;
};

SearchUsersToAddMap.propTypes = {
  searchResults: PropTypes.array.isRequired,
  setRecepientUserId: PropTypes.func.isRequired
};

export default React.memo(SearchUsersToAddMap);
