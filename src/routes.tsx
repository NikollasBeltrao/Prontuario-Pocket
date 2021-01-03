import React from 'react'
import { Route, BrowserRouter } from 'react-router-dom';

import Login from './Login/LoginPage';
import Header from './Header';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Login} exact path="/"/>
            <Route render={props => <Header {...props} title={props.match.params.t} />} path="/header/:teste"/>
        </BrowserRouter>
    );
}

export default Routes;