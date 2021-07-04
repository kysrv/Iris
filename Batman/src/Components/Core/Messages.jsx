import React, { Component } from 'react';




class Compteur extends Component {
    state = { counter: 0 }
    render() {
        const { counter } = this.state;
        return (<div className="flex flex-col">
            <button onClick={() => this.setState({ counter: counter + 1 })}>+1</button>
            counter: {counter}
        </div>);
    }
}




class Messages extends Component {
    state = { users: ["Kysan", "Corpse"] }



    render() {
        return (
            <div className="flex flex-col">
                <Compteur />
            </div>
        );
    }
}

export default Messages;