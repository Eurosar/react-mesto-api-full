import React from 'react';
import {Route, Redirect} from 'react-router-dom';

/**
 * Защищенный роут
 * @param Component
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const ProtectedRoute = ({component: Component, ...props}) => {
  return (
    <Route>
      {
        () => props.loggedIn ? <Component {...props} /> : <Redirect to="./sign-in"/>
      }
    </Route>
  );
};

export default ProtectedRoute;