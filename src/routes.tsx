import React from 'react'
import { Route, BrowserRouter } from 'react-router-dom';

import Login from './Login/LoginPage';
import Home from './Home/HomePage';
import Register from './Register/RegisterPage';
import HomeMedico from './medico/Home';
import HomePaciente from './paciente/Home';


const Routes = () => {
    return (
        <BrowserRouter>            
            <Route component={Login} exact path="/"/>
            <Route component={Home} path="/home"/>
            <Route component={Register} path="/register"/>
            <Route component={HomeMedico} exact path="/medico"/>
            <Route component={HomePaciente} exact path="/paciente"/>
            <Route render={props => <HomePaciente {...props} page={props.match.params.page} />} path="/paciente/:page"/>
            <Route render={props => <HomeMedico {...props} page={props.match.params.page} />} path="/medico/:page"/>
        </BrowserRouter>
    );
}

export default Routes;