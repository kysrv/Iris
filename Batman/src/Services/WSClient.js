


class WSClient extends WebSocket {
    constructor(url, token, component) {
        super(`${url}/${token}`)
        this.component = component
    }

    onmsg = (msg) => {
        console.log("ws:", msg); // * event handler

        if (msg.event == "channelUpdate") {
            let channels = [...this.component.state.channels];
            // * complexité médiocre
            channels = channels.map((channel) => {
                return channel._id === msg.channel._id ? msg.channel : channel;
            });
            this.component.setState({ channels });
        }

        if (msg.event == "userUpdate") {
            if (msg.user._id == this.component.state.user._id) {
                this.component.setState({ user: Object.assign({ ...this.component.state.user }, msg.user) })
            }

            let users = [...this.component.state.users];
            users = users.map((user) =>
                user._id === msg.user._id ? msg.user : user
            );

            this.component.setState({ users });
        }

        if (msg.event == "newChannel") {
            this.component.setState({ channels: [...this.component.state.channels, msg.channel] });
        }

        if (msg.event == "newUser") {
            this.component.setState({ users: [...this.component.state.users, msg.user] });
        }
    };



    onmessage = ({ data }) => {
        try {
            this.onmsg(JSON.parse(data));
        } catch { }
    };
}

export default WSClient;