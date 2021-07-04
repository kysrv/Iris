import React from "react";

const Avatar = ({ username, pp_url }) => {
  return (
      <div className="flex flex-row space-x-5 items-center">
        <div>{username}</div>{" "}
        <img className="h-8 w-8 rounded-full" src={pp_url} />
      </div>
  );
};

export default Avatar;
