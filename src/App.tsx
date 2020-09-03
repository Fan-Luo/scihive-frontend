import { MuiThemeProvider } from '@material-ui/core/styles';
import axios from 'axios';
import React from 'react';
import { useCookies } from 'react-cookie';
import * as ReactHintFactory from 'react-hint';
import { ReactQueryDevtools } from 'react-query-devtools';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import shallow from 'zustand/shallow';
import CollabMain from './collab';
import GroupLoader from './components/Groups/GroupLoader';
import LoginSignupModal from './components/Login/LoginSignupModal';
import { LocationProvider } from './LocationContext';
import Admin from './pages/Admin';
import Groups from './pages/Groups';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Paper from './pages/Paper';
import { Unsubscribe } from './pages/Unsubscribe';
import './react-hint.css';
import { useUserStore } from './stores/user';
import { theme } from './themes';
import { useTracker } from './Tracker';
import ChromeExtensionPopup from './utils/chromeExtension';

const ReactHint = ReactHintFactory(React);

const OldApp: React.FC = () => {
  const [, setCookie] = useCookies([]);
  const { user } = useUserStore(state => ({ user: Boolean(state.userData) }), shallow);
  const [key, setKey] = React.useState(Math.random());
  const isFirstLoad = React.useRef(true);

  React.useEffect(() => {
    setCookie('first_load', true, { domain: '.scihive.org', sameSite: true, path: '/' });
  }, [setCookie]);

  React.useEffect(() => {}, [user]);

  React.useEffect(() => {
    if (user && !isFirstLoad.current) {
      setKey(Math.random());
    }
    if (user && isFirstLoad.current) {
      axios
        .get<{ status: boolean }>('/user/validate')
        .then(response => {
          if (!response.data.status) {
            localStorage.removeItem('username');
            window.location.reload();
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
    isFirstLoad.current = false;
  }, [user]);
  return (
    <React.Fragment>
      <LoginSignupModal />
      <LocationProvider>
        <Switch key={key}>
          <Route path="/library" exact component={Home} />
          <Route path="/" exact component={Home} />
          <Route path="/home" exact component={Home} />
          <Route path="/search/" exact component={Home} />
          <Route path="/author/:authorId" exact component={Home} />
          <Route path="/paper/:paperId" exact component={Paper} />
          <Route path="/paper/:field/:paperId" exact component={Paper} />
          <Route path="/user/unsubscribe/:token" exact component={Unsubscribe} />
          <Route path="/list/:groupId" exact component={Home} />
          <Route path="/lists" exact component={Groups} />
          <Route path="/collection/:groupId" exact component={Home} />
          <Route path="/collections" exact component={Groups} />
          <Route path="/admin" exact component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </LocationProvider>
      <GroupLoader />
      <ChromeExtensionPopup />
    </React.Fragment>
  );
};

const App: React.FC = () => {
  useTracker();

  return (
    <MuiThemeProvider theme={theme}>
      <Switch>
        <Route path="/collab" component={CollabMain} />
        <Route component={OldApp} />
      </Switch>
      <ToastContainer
        position="bottom-center"
        autoClose={false}
        newestOnTop={false}
        closeOnClick={false}
        className="base-toast"
        rtl={false}
        draggable
      />
      <ReactQueryDevtools />
      <ReactHint autoPosition events={{ hover: true }} delay={{ show: 300, hide: 0 }} />
    </MuiThemeProvider>
  );
};

export default App;
