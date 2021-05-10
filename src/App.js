import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import * as ROUTES from './constants/routes';
import UserContext from './context/user';
import UserAuthListener from './hooks/user-auth-listener';

import ProtectedRoute from './helpers/protected-route';

import SignUp from "./pages/sign-up"; 
import Login from "./pages/login"; 
import Dashboard from "./pages/dashboard"; 
import Profile from './pages/profile';
import Settings from './pages/settings';

export default function App() {
  const { user } = UserAuthListener();
  return (
    <UserContext.Provider value={{ user }}>
      <Router>
        <Switch>
          <Route path={ROUTES.LOGIN} component={Login} />
          <Route path={ROUTES.SIGN_UP} component={SignUp} />
          <Route path={ROUTES.PROFILE} component={Profile} />
          <ProtectedRoute user={user} path={ROUTES.DASHBOARD} exact>
            <Dashboard />
          </ProtectedRoute>
          <ProtectedRoute user={user} path={ROUTES.SETTINGS}>
            <Settings />
          </ProtectedRoute>
        </Switch>
      </Router>
    </UserContext.Provider>
  )
}