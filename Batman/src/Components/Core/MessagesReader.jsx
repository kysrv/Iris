import React, { Component } from "react";
import axios from "axios";
import { API_URL } from "../../app-config";

const Post = ({ author: { username, pp }, content, date, attachments }) => {
  date = new Date(date);
  date = date.getHours() + ":" + date.getMinutes();
  content =
    content.lenght < 30
      ? content + " ".repeat(content.length - 30) + "."
      : content;
  return (
    <div className="flex flex-row items-center space-x-2 ">
      <div className="relative">
        {/* <div className="text-gray-300 text-sm absolute -top-4 left-0">{date}</div> */}
        <img className="rounded-full h-10 w-10" src={pp} />
      </div>

      <div className="flex my-2 px-2 flex-col m-y-10 bg-gray-800 rounded">
        <div className="relative flex flex-row items-center space-x-50">
          <div className="text-red-500">{username}</div>
        </div>
        <div>
          {content.split("\n").map((txt, i) => (
            <p key={i}>{txt}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

class PostReader extends Component {
  state = { posts: [] };

  componentDidMount() {
    this.props.handlePostsUpdate();
    this.scrollToBottom();
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.messageEnd.scrollIntoView({ behavior: "smooth" });
  };

  render() {
    const { handlePostsUpdate, posts } = this.props;
    return (
      <div className="h-full flex flex-col">
        <div className="overflow-y-scroll h-full overflow-x-hidden flex flex-col">
          {[...posts].map((message, i) => (
            <Post {...message} key={i} />
          ))}
          <div
            className=""
            ref={(element) => {
              this.messageEnd = element;
            }}
          />
        </div>
        <button
          className="w-min bg-green-900 self-center p-1 rounded"
          onClick={handlePostsUpdate}
        >
          Update
        </button>
      </div>
    );
  }
}

export default PostReader;
