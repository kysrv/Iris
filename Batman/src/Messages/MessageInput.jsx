import React, { Component } from "react";
import { toast } from "react-toastify";
import API from "../API";

class MessageInput extends Component {
  state = {
    message: "",
  };

  componentDidMount() {
    // setTimeout(() => this.messageInput.focus(), 3000);
  }

  handleChange = ({ currentTarget: { value: input }, ...args }) => {
    console.log(args);
    if (input[input.length - 1] != "\n") {
      this.setState({ message: input });
    } else {
      this.sendMessage();
    }
  };

  sendMessage = async () => {
    const { channelId } = this.props;

    console.log(this.state.message);
    try {
      const payload = { content: this.state.message };
      const { data: message } = await API.post(
        `/channels/${channelId}/message`,
        payload
      );

      if (message.error) {
        return toast.error("Error while sending message");
      }

      this.setState({ message: "" });
      // this.props.handleNewMessage(channelId, message);
    } catch (error) {
      console.log(error);
      toast.error("Error while sending message :C");
    }
  };

  render() {
    const { message } = this.state;
    return (
      <textarea
        className="outline-none resize-none px-4 py-1 h-16 mt-1 w-full overflow-y-scroll bg-gray-800 rounded"
        placeholder="C'est ici qu'on écrit les messages !"
        onChange={this.handleChange}
        value={message}
        ref={(element) => {
          this.messageInput = element;
        }}
      />
    );
  }
}

export default MessageInput;
