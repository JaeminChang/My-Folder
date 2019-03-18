import React from "react";
import PageLoader from "../ui/PageLoader";
import style from "./Instagram.module.css";
import SweetAlertWarning from "../ui/SweetAlertWarning";
import PropTypes from "prop-types";
import MapInstagramFeed from "./MapInstagramFeed";

const instagramFeed = ({
  confirmAction,
  currentRoles,
  hasFeed,
  modal,
  instagramInfo,
  instagramFeed,
  becomeInfluencer,
  profile
}) => {
  return hasFeed ? (
    <div className="row">
      <div className="col-lg-12 col-md-12 mb-4">
        <div className="row justify-content-md-center">
          <div className="mr-4">
            <img
              src={instagramInfo.instagramAvatar}
              className="rounded-circle"
              alt="instapic"
            />
          </div>
          <div className="align-middle">
            <h3>{instagramInfo.instagramUsername}</h3>

            <ul className="list-inline">
              <li className="list-inline-item">
                <strong>{instagramInfo.instagramPosts}</strong> posts
              </li>
              <li className="list-inline-item">
                <strong>{instagramInfo.instagramFollowers}</strong> followers
              </li>
              <li className="list-inline-item">
                <strong>{instagramInfo.instagramFollowing}</strong> following
              </li>
            </ul>
            <strong>{instagramInfo.instagramFullName}</strong>
            <br />
            {instagramInfo.instagramBio}
            <br />
            {!currentRoles.includes("Influencer") ? (
              !profile ? (
                <button className={style.button} onClick={becomeInfluencer}>
                  Become An Influencer
                </button>
              ) : (
                <div />
              )
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <MapInstagramFeed instagramFeed={instagramFeed} />
      </div>
      {modal ? (
        <SweetAlertWarning
          type="success"
          title="You are now an Influencer!"
          confirmAction={confirmAction}
          message="Please Re-Login!"
        />
      ) : (
        <div />
      )}
    </div>
  ) : (
    <PageLoader />
  );
};

instagramFeed.propTypes = {
  currentRoles: PropTypes.array.isRequired,
  modal: PropTypes.bool.isRequired,
  confirmAction: PropTypes.func,
  hasFeed: PropTypes.bool.isRequired,
  instagramInfo: PropTypes.object.isRequired,
  instagramFeed: PropTypes.array.isRequired,
  becomeInfluencer: PropTypes.func,
  profile: PropTypes.bool.isRequired
};

export default React.memo(instagramFeed);
