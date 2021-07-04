import React, { Component } from "react";
import { toast } from "react-toastify";
import Popup from "reactjs-popup";
import API from "../API";

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

class GroupCreator extends Component {
  state = { usersIds: [], channel: {}, name: "" };

  handleGroupCreation = async (closePopup) => {
    if (this.state.channel != {}) {
      try {
        const { name } = this.state;
        const { data: channel } = await API.post("/channels/create", { name });
        console.log(channel);
        this.setState({ channel });
      } catch (error) {
        return toast.error("Error while creating channel");
      }
    }

    const { usersIds: users } = this.state;

    users.forEach(async (newUserID) => {
      try {
        const { channel } = this.state;
        const { data: members } = await API.post(
          `/channels/${channel._id}/addMember`,
          {
            newUserID,
          }
        );
      } catch (error) {
        toast.error(
          "Error while adding " +
            this.props.find((u) => u.id == newUserID).username
        );
      }
    });
    closePopup();
  };

  handleCheck = ({ target: { checked } }, userId) => {
    let usersIds = [...this.state.usersIds];
    if (checked) {
      usersIds.push(userId);
    } else {
      usersIds = usersIds.filter((id) => id != userId);
    }
    this.setState({ usersIds });
  };

  render() {
    const { name } = this.state;
    const { users } = this.props;
    return (
      <div className="relative w-full h-8 flex flex-row pl-2 my-2">
        Channels
        <Popup
          modal
          trigger={
            <button className="absolute right-2 px-1 flex flex-row items-center space-x-4 bg-gray-300 rounded text-black">
              New
              <PlusIcon />
            </button>
          }
          arrow={false}
        >
          {(close) => (
            <div className="bg-red-900 rounded flex flex-col items-center p-4">
              <div className="flex flex-col overflow-y-auto h-64">
                <div>
                  <input
                    className="bg-black text-white rounded mb-2"
                    placeholder="Group name here"
                    type="text"
                    onChange={({ target: { value: name } }) =>
                      this.setState({ name })
                    }
                    value={name}
                  />
                </div>
                {users.map((user) => (
                  <label className="flex flex-row" key={user._id}>
                    <input
                      type="checkbox"
                      onChange={(e) => this.handleCheck(e, user._id)}
                    />
                    <img src={user.pp} className="h-8 w-8 mx-2" />
                    <span>{user.username}</span>
                  </label>
                ))}
              </div>
              <button
                className="bg-gray-600 mt-2 rounded"
                onClick={() => this.handleGroupCreation(close)}
              >
                Create
              </button>
            </div>
          )}
        </Popup>
      </div>
    );
  }
}

export default GroupCreator;
