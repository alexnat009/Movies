import React from "react";
//Input: liked  boolean
//Output: onClick
const Liked = ({ liked, onClick }) => {
  let classes = "far fa-heart";
  if (liked) classes = "fas fa-heart";
  return (
    <i className={classes} onClick={onClick} style={{ cursor: "pointer" }}></i>
  );
};

export default Liked;
