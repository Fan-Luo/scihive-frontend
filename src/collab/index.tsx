import React from 'react';
import { Redirect, Route, RouteProps, Switch, useRouteMatch } from 'react-router-dom';
import { useIsLoggedIn } from '../auth/utils';
import NotFound from '../pages/NotFound';
import { useUserNewStore } from '../stores/userNew';
import { Landing } from './Landing';
import { CollaboratedPdf } from './Paper';
import { Upload } from './upload';
import { CenteredFullScreen } from './utils/CenteredFullScreen';

const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const user = useUserNewStore();
  return (
    <Route {...rest}>
      {user.status === 'loggedIn' ? (
        children
      ) : user.status === 'loggingIn' ? (
        <CenteredFullScreen>Logging in</CenteredFullScreen>
      ) : (
        <Redirect to="/collab/start" />
      )}
    </Route>
  );
};

const Main: React.FC = () => {
  const { path } = useRouteMatch();
  useIsLoggedIn();
  return (
    <Switch>
      <Route path={`${path}/start`} exact>
        <Landing />
      </Route>
      <PrivateRoute path={`${path}/upload`} exact>
        <Upload />
      </PrivateRoute>
      <PrivateRoute path={`${path}/paper/:paperId/invite`} exact>
        <CollaboratedPdf showInviteOnLoad />
      </PrivateRoute>
      <PrivateRoute path={`${path}/paper/:paperId`} exact>
        <CollaboratedPdf />
      </PrivateRoute>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
};

export default Main;
