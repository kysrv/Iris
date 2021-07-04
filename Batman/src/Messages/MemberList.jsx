import React, { Component } from "react";

class MembersList extends Component {
  render() {
    let { members } = this.props;
    if (members == undefined) members = [{ username: "no user" }];
    return (
      <div className="w-64 flex-none h-full p-4 rounded bg-gray-800 over overflow-auto">
        <div className="text-center mb-4">Members - {members.length}</div>
        <div className="flex flex-col gap-5 overflow-auto">
          {members.map(({ username, pp, _id }) => {
            console.log({ pp, username, _id });
            return (
              <div className="flex flex-row space-x-5" key={_id}>
                <img className="h-8 w-8 rounded-full" src={pp} />
                <div>{username}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default MembersList;
