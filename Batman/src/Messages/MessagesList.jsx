import React, { Component } from "react";

const Message = ({
  author: { username, pp, _id },
  content,
  date,
  currentUser,
}) => {
  date = new Date(date);
  date = date.getHours() + ":" + date.getMinutes();

  const selfMsg = _id === currentUser._id;

  return (
    <div
      className={`select-text w-full flex flex-row${
        selfMsg && "-reverse"
      } items-center gap-2`}
    >
      <div className="relative w-10 h-full flex-none">
        <img className={`absolute top-2 rounded-full h-10 w-10`} src={pp} />
      </div>
      <div className="max-w-2xl flex p-2 flex-col bg-gray-800 rounded">
        <div className="text-red-500">{username}</div>
        <div className="h-full w-full mt-1">
          {content.split("\n").map((txt, i) => (
            <p style={{ wordBreak: "break-word" }} key={i}>
              {txt}
            </p>
          ))}
        </div>
      </div>
      <div className="relative w-10 h-full flex-none">
        <div className="absolute bottom-2 text-gray-200 text-sm text-opacity-10 hover:text-opacity-100">
          {date}
        </div>
      </div>
    </div>
  );
};

class MessagesList extends Component {
  componentDidMount() {
    this.scrollToBottom();
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.messageEnd.scrollIntoView({ behavior: "auto" });
  };

  render() {
    const { channel, currentUser } = this.props;

    // channel = channel ? channel : [];
    return (
      <div className="w-full h-full flex flex-col overflow-auto space-y-10">
        {channel && channel.messages.length > 0 ? (
          <>
            {channel.messages.map((msg) => (
              <Message key={msg._id} {...msg} currentUser={currentUser} />
            ))}
          </>
        ) : (
          <>Aucun message.</>
        )}
        <div
          ref={(element) => {
            this.messageEnd = element;
          }}
        />
      </div>
    );
  }
}

export default MessagesList;
