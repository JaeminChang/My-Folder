import React from "react";
import * as profileService from "../../services/profileService";
import "../../assets/scss/style.css";
import * as influencerService from "../../services/influencerService";
import PropTypes from "prop-types";
import InstagramFeed from "./InstagramFeed";
import logger from "../../logger";

const _logger = logger.extend("Instagram");

class Instagram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model: {},
      instagramFeed: [],
      hasFeed: false,
      accessToken: "",
      profile: false,
      instagramInfo: {
        instagramFollowers: 0,
        instagramUsername: "",
        instagramBio: "",
        instagramAvatar: "",
        instagramPosts: 0,
        instagramFollowing: 0,
        instagramFullName: ""
      }
    };
  }

  componentDidMount() {
    this.selectAccessToken();
  }

  getAccessToken = () => {
    if (window.location.search) {
      let search = window.location.search;
      let params = new URLSearchParams(search);
      let query = params.get("code");
      _logger("Search Query: ", query);
      profileService
        .instaProfile(query)
        .then(this.instaSuccess)
        .catch(this.instaFeedError);
    }
  };

  instaFeedError = error => {
    _logger(error);
  };

  instaSuccess = success => {
    this.setState({
      accessToken: success.access_token
    });
    profileService
      .insertAccess(this.state.accessToken)
      .then(this.insertAccessSuccess)
      .catch(this.error);
  };

  getInstaFeed = token => {
    profileService
      .instaFeed(token)
      .then(this.instaFeedSuccess)
      .catch(this.instaFeedError);
  };

  selectAccessToken = () => {
    profileService
      .selectAccessToken()
      .then(this.selectSuccess)
      .catch(this.selectError);
  };

  selectError = err => {
    _logger(err);
    this.getAccessToken();
  };

  instaFeedSuccess = success => {
    _logger(success.data);
    this.setState({
      instagramFeed: success.data,
      hasFeed: true
    });
  };

  getFollowers = token => {
    profileService
      .followers(token)
      .then(this.success)
      .catch(this.error);
  };

  success = success => {
    this.setState(prevState => ({
      instagramInfo: {
        ...prevState.instagramInfo,
        instagramFollowers: success.data.counts.followed_by,
        instagramUsername: success.data.username,
        instagramBio: success.data.bio,
        instagramAvatar: success.data.profile_picture,
        instagramPosts: success.data.counts.media,
        instagramFollowing: success.data.counts.follows,
        instagramFullName: success.data.full_name
      }
    }));
    profileService
      .UpdateInstagram(this.state.instagramInfo)
      .then(this.updateSuccess)
      .catch(this.error);
  };

  becomeInfluencer = e => {
    e.preventDefault();
    let object = {
      account: this.state.instagramInfo.instagramUsername,
      bio: this.state.instagramInfo.instagramBio
    };
    influencerService
      .insert(object)
      .then(this.updateSuccess)
      .catch(this.error);
    this.setState({
      modal: true
    });
  };

  updateSuccess = success => {
    _logger(success);
  };

  error = error => {
    _logger(error);
  };

  insertAccessSuccess = success => {
    _logger(success);
    this.selectAccessToken();
  };

  selectSuccess = success => {
    _logger("I AM SELECTING", success);
    this.setState({
      accessToken: success.item.accessToken
    });
    this.getInstaFeed(this.state.accessToken);
    this.getFollowers(this.state.accessToken);
  };

  confirmAction = () => {
    this.setState({
      modal: false
    });
  };

  render() {
    const {
      instagramInfo,
      modal,
      instagramFeed,
      hasFeed,
      profile
    } = this.state;
    return (
      <InstagramFeed
        {...this.props}
        currentRoles={this.props.currentRoles}
        confirmAction={this.confirmAction}
        modal={modal}
        hasFeed={hasFeed}
        instagramInfo={instagramInfo}
        instagramFeed={instagramFeed}
        becomeInfluencer={this.becomeInfluencer}
        profile={profile}
      />
    );
  }
}

Instagram.propTypes = {
  currentRoles: PropTypes.array
};

export default Instagram;
