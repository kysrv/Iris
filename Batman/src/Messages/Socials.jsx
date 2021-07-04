import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import API from "../API";
import ChannelBar from "./ChannelBar";

import Channels from "./Channels";
import MembersList from "./MemberList";
import MessageInput from "./MessageInput";
import Messages from "./Messages";

class Socials extends Component {
  state = {
    showMemberList: false,
  };

  triggerMembersList = () => {
    this.setState({ showMemberList: !this.state.showMemberList });
  };

  render() {
    const { showMemberList } = this.state;
    const { channels, users, handleNewMessage, currentUser } = this.props;
    const { path, url, params } = this.props.match;

    return (
      <div className="h-full w-full flex flex-row overflow-hidden">
        <Switch>
          <Route
            exact
            path={`${path}/:channelId`}
            render={(props) => {
              // * on récupère l'id du channel
              const { channelId } = props.match.params;
              // * on récupère son objet
              const channel = channels.find((chan) => chan._id == channelId);
              if (!channel) return;
              return (
                <>
                  <div className="invisible absolute md:relative md:visible md:h-full md:w-64 md:flex-none">
                    <Channels url={url} channels={channels} users={users} />
                  </div>
                  <div className="h-full w-full flex flex-col gap-1 ml-1">
                    <ChannelBar
                      channel={channel}
                      triggerMembersList={this.triggerMembersList}
                    />
                    <div className="h-full w-full flex flex-row overflow-hidden gap-1">
                      <div className="h-full w-full flex flex-col overflow-hidden">
                        <Messages channel={channel} currentUser={currentUser} />
                        <MessageInput
                          channelId={channelId}
                          handleNewMessage={handleNewMessage}
                        />
                      </div>
                      {showMemberList && (
                        <MembersList members={channel.members} />
                      )}
                    </div>
                  </div>
                </>
              );
            }}
          />
          <Route
            path={`${path}/`}
            render={() => (
              <div className="relative visible h-full w-64 flex-none">
                <Channels url={url} channels={channels} users={users} />
              </div>
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default Socials;
