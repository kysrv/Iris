import React, { Component } from 'react';
import axios from "axios"
import { API_URL } from "../../app-config"

class PostMaker extends Component {
    state = { content: "" }




    handleSubmit = async (e) => {
        e.preventDefault();
        const { title, content } = this.state;

        try {
            const req = await axios.post(API_URL + "/posts", { ...this.state }, { headers: { authorization: "B " + localStorage.token } });
            this.props.history.push("/app/messages");
        } catch (err) {
            console.log(err);
        }

    }

    handleChange = ({ currentTarget: input }) => {
        this.setState({ [input.name]: input.value });
    }

    render() {
        const { title, content } = this.state;
        return (
            <form onSubmit={this.handleSubmit} className="w-full grid grid-cols-11 space-x-5">
                <div className="col-start-0 col-span-10">
                    {/* faire en sorte que la redimension soit sur mesure (heigt = nombre de ligne) */}
                    <textarea name="content" className="bg-gray-200 rounded text-black w-full h-32  " value={content} onChange={this.handleChange} />
                </div>
                <div className="col-start-11">
                    <button className="bg-red-500 rounded p-1 w-min self-center">Post!</button>
                </div>
            </form>
        );
    }
}

export default PostMaker;