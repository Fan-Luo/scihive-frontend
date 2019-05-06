// @flow

import React, {useEffect, useState} from 'react';
import CommentsList from "./CommentsList";
import PdfViewer from "./PdfViewer";
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import {withRouter} from "react-router";
import './PdfCommenter.scss';
import SplitPane from "react-split-pane";
import ReadingProgress from "./ReadingProgress";
import CircularProgress from "@material-ui/core/CircularProgress";
import {actions } from "../actions";
import {connect} from "react-redux";
import * as queryString from "query-string";
import {toast} from "react-toastify";
import {isEmpty} from "lodash";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import {APP_BAR_HEIGHT} from "./TopBar/PrimaryAppBar";

const styles = theme => ({
  rootVert: {
    backgroundColor: '#eeeeee',
  },
  rootHorz: {
    paddingTop: '8px',
    backgroundColor: '#eeeeee',
  },
  spinner: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
});
const FETCHING = '-1';
const FAILED = '0';
const MOBILE_WIDTH = 800;

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({width: window.innerWidth, height: window.innerHeight});

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({width: window.innerWidth, height: window.innerHeight});
    }
    window.addEventListener('resize', handleResize);
    window.addEventListener('touchmove', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('touchmove', handleResize)
    };
  }, []);

  return windowDimensions;
}

const PdfCommenter = ({setBookmark, classes, location, match: {params}, selectGroup, setGroups, isLoggedIn}) => {

  const [highlights, setHighlights] = useState([]);
  const [url, setUrl] = useState(FETCHING);
  const {height: pageHeight} = useWindowDimensions();
  const contentHeight = pageHeight - APP_BAR_HEIGHT;
  const defaultPdfPrct = 0.75;
  const [commentsSectionHeight, setCommentsSectionHeight] = useState((1-defaultPdfPrct) * contentHeight);

  useEffect(() => {
    // Fetch paper data
    axios.get(`/paper/${params.PaperId}`)
      .then(res => {
        setUrl(res.data.url);
        setBookmark(res.data.saved_in_library);
      })
      .catch(err => {
        setUrl(FAILED)
      });

    const selectedGroupId = queryString.parse(location.search).group;

    // Fetch comments
    axios.get(`/paper/${params.PaperId}/comments`, {params: {group: selectedGroupId}})
      .then(res => {
        setHighlights(res.data.comments);
      }).catch(err => {
      console.log(err.response);
    });
    if (isLoggedIn) {
      if (selectedGroupId) {
        axios.post('/groups/all', {id: selectedGroupId})
          .then(res => {
            const groups = res.data;
            setGroups(groups);
            const group = groups.find(g => g.id === selectedGroupId);
            if (group) {
              selectGroup(group);
              toast.success(<span>Welcome to Group {group.name}</span>, {autoClose: 2000});
            }
          })
          .catch(e => console.warn(e.message));
      } else {
        axios.get('/groups/all')
          .then(res => {
            setGroups(res.data);
          })
          .catch(e => console.warn(e.message));
      }
    }

  }, [params]);

  const addHighlight = (highlight: T_NewHighlight) => {
    setHighlights([highlight, ...highlights]);
  };

  const updateHighlight = (highlight: T_NewHighlight) => {
    setHighlights(highlights.map(h => {
        return h.id === highlight.id ? highlight : h;
      })
    );
  };

  const removeHighlight = (highlightId: string) => {
    axios.delete(`/paper/${params.PaperId}/comment/${highlightId}`, {id: highlightId})
      .then(res => {
        setHighlights(highlights.filter(h => h.id !== highlightId));
      })
      .catch(err => console.log(err.response));
  };

  const Loader = <div className={classes.spinner}><CircularProgress /></div>
  const isVertical = window.innerWidth < MOBILE_WIDTH;

  let viewerRender = null;
  if (url === FETCHING) {
    viewerRender = Loader;
  }
  else if (url === FAILED) {
    viewerRender = <div style={{textAlign: 'center'}}>PDF file does not exist</div>
  } else {
    viewerRender = <PdfViewer
      updateHighlight={updateHighlight}
      addHighlight={addHighlight}
      highlights={highlights}
      beforeLoad={Loader}
      isVertical={isVertical}
      url={url}
    />
  }

  const comments = <CommentsList
    highlights={highlights}
    removeHighlight={removeHighlight}
    updateHighlight={updateHighlight}
    isVertical={isVertical}
  />

  // Vertical is for mobile phones
  return (
    <div style={{position: 'relative', height: contentHeight, overflowY: 'hidden'}}>
      <ReadingProgress />
      {isVertical ?
        <SplitPane split={"horizontal"}
                   defaultSize={defaultPdfPrct * contentHeight}
                   className={classes.rootHorz}
                   pane2Style={{paddingBottom: '5px', height: commentsSectionHeight}}
                   onChange={size => console.log(size)}
        >
          <React.Fragment>
            {viewerRender}
          </React.Fragment>
          <React.Fragment>
            {comments}
          </React.Fragment>
        </SplitPane>
        :
        <SplitPane split={"vertical"}
                   minSize={200}
                   maxSize={600}
                   defaultSize={'25%'}
                   className={classes.rootVert}
        >
          <React.Fragment>
            {comments}
          </React.Fragment>
          <React.Fragment>
            {viewerRender}
          </React.Fragment>
        </SplitPane>

      }
      <div className="comments-help">
        <Tooltip title="To create area highlight hold Option/Alt key, then click and drag." placement="bottom">
          <IconButton>
            <i className="fas fa-info-circle" style={{fontSize: 18}}></i>
          </IconButton>
        </Tooltip>
      </div>

    </div>
  )

};


const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: !isEmpty(state.user.userData),
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setBookmark: (value) => {
      dispatch(actions.setBookmark(value));
    },
    selectGroup: (group) => {
      dispatch(actions.selectGroup(group));
    },
    setGroups: (groups) => {
      dispatch(actions.setGroups(groups));
    },
  }
};
const withRedux = connect(mapStateToProps, mapDispatchToProps);

export default withRedux(withStyles(styles)(withRouter(PdfCommenter)));
