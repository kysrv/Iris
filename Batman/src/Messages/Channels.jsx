import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import GroupCreator from "./GroupCreator";

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const ChannelButton = ({ channel, url }) => {
  return (
    <NavLink
      to={url}
      key={channel._id}
      className="relative bg-gray-700 text-center w-full h-10 rounded items-center p-2 flex flex-row"
    >
      <div>{channel.name}</div>
      <div className="absolute right-4">
        <CloseIcon />
      </div>
    </NavLink>
  );
};

class Channels extends Component {
  render() {
    let { channels, users } = this.props;
    const { url } = this.props;
    return (
      <div className="rounded w-full h-full bg-gray-800 space-y-1 p-1 flex flex-col items-center overflow-y-auto">
        <GroupCreator {...this.props} />
        {channels ? (
          channels.map((chan) => (
            <ChannelButton
              key={chan._id}
              url={`${url}/${chan._id}`}
              channel={chan}
            />
          ))
        ) : (
          <div> No channels </div>
        )}
      </div>
    );
  }
}

export default Channels;
