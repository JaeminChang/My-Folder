import React from "react";
import * as profileService from "../../services/profileService";
import "../../assets/scss/style.css";
import InstagramFeed from "./InstagramFeed";
import PropTypes from "prop-types";
import logger from "../../logger";

const _logger = logger.extend("InstagramProfile");

class InstagramProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 0,
      model: {},
      instagramFeed: [],
      hasFeed: false,
      accessToken: "",
      profile: true,
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
    this.getUserId();
  }

  getUserId = () => {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let query = params.get("userId");
    this.setState(
      {
        userId: query
      },
      this.selectInfluencer(query)
    );
  };

  getInstaFeed = token => {
    profileService
      .instaFeed(token)
      .then(this.instaFeedSuccess)
      .catch(this.instaFeedError);
  };

  selectInfluencer = userId => {
    profileService
      .selectInfluencer(userId)
      .then(this.selectSuccess)
      .catch(this.error);
  };

  instaFeedSuccess = success => {
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
        instagramFollowing: success.data.counts.follows,
        instagramFullName: success.data.full_name,
        instagramPosts: success.data.counts.media
      }
    }));
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
    this.setState({
      accessToken: success.item.accessToken
    });
    this.getInstaFeed(this.state.accessToken);
    this.getFollowers(this.state.accessToken);
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

InstagramProfile.propTypes = {
  currentRoles: PropTypes.array
};

export default InstagramProfile;
