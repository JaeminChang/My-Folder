import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Row,
  Col,
  Input,
  Button,
  ModalFooter
} from "reactstrap";
import "./ChatTheme.css";
import * as styles from "./Chat.module.css";
import PropTypes from "prop-types";
import SearchUsersToAddMap from "./SearchUsersToAddMap";

class SearchUsersToAdd extends React.Component {
  render() {
    const { searchResults } = this.props;
    return (
      <div className="SearchUsersToAddContainer">
        <Modal
          className={styles.chatModalHeight}
          isOpen={this.props.modal}
          toggle={this.props.toggle}
        >
          <ModalHeader onClick={this.props.toggle}>
            Start a new chat
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.props.handleSearchKeyPress}>
              <Row>
                <Col sm="10" md="10" lg="10" className={styles.MessageInputCol}>
                  <Input
                    type="text"
                    name="search"
                    value={this.props.search}
                    onChange={this.props.handleChange}
                    className={styles.SearchInput}
                    placeholder="Search by Firstname, Lastname or Email..."
                  />
                </Col>
                <Col sm="2" md="2" lg="2" className={styles.MessageSendBtnCol}>
                  <Button
                    type="submit"
                    color="primary"
                    size="sm"
                    onClick={this.props.searchForUsersToAdd}
                    onKeyDown={this.props.handleSearchKeyPress}
                    className={styles.SearchBtn}
                  >
                    Search
                  </Button>
                </Col>
              </Row>
            </Form>
            <div className={styles.SearchResultsContainer}>
              {searchResults ? (
                <SearchUsersToAddMap
                  searchResults={searchResults}
                  setRecepientUserId={this.props.setRecepientUserId}
                />
              ) : (
                "There were no matched search results"
              )}
            </div>
            <ModalFooter>
              <Button
                type="button"
                color="danger"
                size="sm"
                onClick={this.props.toggle}
                className={styles.SearchBtn}
              >
                Cancel
              </Button>
              <Button
                type="button"
                color="primary"
                size="sm"
                onClick={this.props.createNewChat}
                className={styles.SearchBtn}
              >
                Create a new chat
              </Button>
            </ModalFooter>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

SearchUsersToAdd.propTypes = {
  createNewChat: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSearchKeyPress: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  search: PropTypes.string.isRequired,
  searchForUsersToAdd: PropTypes.func.isRequired,
  searchResults: PropTypes.array,
  setRecepientUserId: PropTypes.func.isRequired,
  recepientId: PropTypes.number,
  toggle: PropTypes.func.isRequired
};

export default SearchUsersToAdd;
