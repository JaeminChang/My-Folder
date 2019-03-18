import React from "react";
import styles from "../dashboards/customer.module.css";
import PropTypes from "prop-types";

const MapInstagramFeed = ({ instagramFeed }) => {
  return instagramFeed.map(data => {
    return (
      <div key={data.id} className="col-md-3 card el-element-overlay">
        <div className="el-card-item">
          <div className="el-card-avatar el-overlay-1 pt-3">
            <img
              //className="col-md-4"
              src={data.images.standard_resolution.url}
              alt="instafeedpic"
            />
            <div className="el-overlay pt-2 pl-2 pr-2">
              <ul
                className={`el-info 
                          ${styles.textCapitalize}`}
              >
                <li className="mb-2">
                  <label>Number Of Likes: {data.likes.count}</label>
                  <label>{data.user.username + ": " + data.caption.text}</label>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  });
};

MapInstagramFeed.propTypes = {
  instagramFeed: PropTypes.array
};

export default React.memo(MapInstagramFeed);
