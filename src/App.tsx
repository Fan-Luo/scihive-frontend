import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import axios from 'axios';
import React from 'react';
import * as ReactHintFactory from 'react-hint';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import shallow from 'zustand/shallow';
import GroupLoader from './components/Groups/GroupLoader';
import LoginSignupModal from './components/Login/LoginSignupModal';
import Admin from './pages/Admin';
import Groups from './pages/Groups';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Paper from './pages/Paper';
import './react-hint.css';
import { useUserStore } from './stores/user';
import { useTracker } from './Tracker';
import ChromeExtensionPopup from './utils/chromeExtension';
import { themePalette } from './utils/presets';
import { useCookies } from 'react-cookie';

const theme = createMuiTheme({
  palette: themePalette,
  typography: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
  },
});

const ReactHint = ReactHintFactory(React);

const App: React.FC = () => {
  const [, setCookie] = useCookies();
  const { user } = useUserStore(state => ({ user: Boolean(state.userData) }), shallow);

  React.useEffect(() => {
    setCookie('first_load', true, { domain: '.scihive.org', sameSite: true, path: '/' });
  }, [setCookie]);

  React.useEffect(() => {
    if (user) {
      axios
        .get('/user/validate')
        .then(() => {})
        .catch(err => {
          if (err.response && err.response.status) {
            localStorage.removeItem('username');
            window.location.reload();
          }
        });
    }
  }, []);

  useTracker();

  return (
    <React.Fragment>
      <MuiThemeProvider theme={theme}>
        <LoginSignupModal />
        <Switch>
          <Route path="/library" exact component={Home} />
          <Route path="/" exact component={Home} />
          <Route path="/home" exact component={Home} />
          <Route path="/search/" exact component={Home} />
          <Route path="/author/:authorId" exact component={Home} />
          <Route path="/paper/:PaperId" exact component={Paper} />
          <Route path="/list/:groupId" exact component={Home} />
          <Route path="/lists" exact component={Groups} />
          <Route path="/admin" exact component={Admin} />
          <Route component={NotFound} />
        </Switch>
        <GroupLoader />
        <ToastContainer
          position="bottom-center"
          autoClose={false}
          newestOnTop={false}
          closeOnClick={false}
          className="base-toast"
          rtl={false}
          draggable
        />
        <ReactHint autoPosition events={{ hover: true }} delay={{ show: 300, hide: 0 }} />
        <ChromeExtensionPopup />
      </MuiThemeProvider>
    </React.Fragment>
  );
};

export default App;
