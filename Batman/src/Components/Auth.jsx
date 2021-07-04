import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './Auth/Login';
import Register from './Auth/Register';




class Auth extends Component {
    state = {}
    render() {
        const { path, url } = this.props.match;
        return (
            <div className="h-full w-full">

                <Switch>
                    <Route exact path={path + "/register"} component={Register} />
                    <Route exact path={path + "/login"} component={Login} />


                    <Redirect path={path + "/"} to={path + "/login"} />
                </Switch>
            </div>);

    }
}
export default Auth;