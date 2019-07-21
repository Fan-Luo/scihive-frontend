// @flow
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import React, { Component } from 'react';
import { TextField, Button, Select, Input, MenuItem, FormControl, FormControlLabel, Checkbox } from '@material-ui/core';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { actions } from '../../../actions';
import { presets } from '../../../utils';

type State = {
  compact: boolean,
  text: string,
};
type Visibilty = {
  type: string,
  id?: string,
};

type Props = {
  onConfirm: (comment: { text: string }, visibility: Visibilty) => void,
  onOpen: () => void,
  isLoggedIn: boolean,
  selectedGroup: { id: string, name: string },
  openGroupsModal: () => void,
};

const compactButtonStyle = css`
  cursor: pointer;
  padding: 3px;
  margin: 0px 5px;
  &:hover {
    color: ${presets.themePalette.primary.main};
  }
`;

class Tip extends Component<Props, State> {
  state: State;

  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      compact: true,
      text: '',
      visibility: props.selectedGroup ? 'group' : 'public',
      anonymous: false,
    };
  }

  // for TipContainer
  componentDidUpdate(nextProps: Props, nextState: State) {
    const { onUpdate } = this.props;

    if (onUpdate && this.state.compact !== nextState.compact) {
      onUpdate();
    }
  }

  onSubmit = event => {
    const { text, visibility, anonymous } = this.state;
    event.preventDefault();
    let requestVisibility = {};
    if (visibility === 'public' && anonymous) {
      requestVisibility = { type: 'anonymous' };
    } else if (visibility === 'group') {
      requestVisibility = { type: visibility, id: this.props.selectedGroup.id };
    } else {
      requestVisibility = { type: visibility };
    }
    this.props.onConfirm({ text }, requestVisibility);
  };

  handleVisibilityChange = event => {
    this.setState({ visibility: event.target.value });
  };

  handleAnonymousChange = event => {
    this.setState({ anonymous: event.target.checked });
  };

  render() {
    const { onOpen, selectedGroup, isLoggedIn, openGroupsModal } = this.props;
    const { compact, text, visibility } = this.state;
    return (
      <div className="Tip">
        {compact ? (
          <div
            css={css`
              ${presets.row};
              ${presets.centered};
              color: white;
              padding: 5px 7px;
              background-color: #bbb;
              border-radius: 10px;
            `}
          >
            <div
              css={compactButtonStyle}
              role="button"
              onClick={() => {
                onOpen();
                this.setState({ compact: false });
              }}
            >
              <i className="fas fa-comment-medical" />
            </div>
            <div css={compactButtonStyle} role="button" onClick={this.onSubmit}>
              <i className="fas fa-highlighter" />
            </div>
          </div>
        ) : (
          <form
            css={css`
              padding: 10px;
              background: #fff;
              background-clip: padding-box;
              border: 1px solid #e8e8e8;
              border-radius: 4px;
              box-shadow: 0 2px 4px rgba(37, 40, 43, 0.2);
              width: 290px;
              textarea {
                font-size: 16px;
                height: 70px;
              }
              input[type='submit'] {
                margin-top: 5px;
                font-size: large;
              }
            `}
            onSubmit={this.onSubmit}
          >
            <div>
              <TextField
                type="text"
                name="comment"
                label="Your Comment"
                placeholder="Add a comment (Optional)"
                multiline
                margin="normal"
                variant="outlined"
                value={text}
                fullWidth
                onChange={event => this.setState({ text: event.target.value })}
                inputRef={inp => {
                  if (inp) {
                    setTimeout(() => inp.focus(), 100);
                  }
                }}
              />
            </div>
            <div
              css={css`
                ${presets.row};
                font-size: 0.65rem;
                color: grey;
                margin-bottom: 8px;
              `}
            >
              * Type LaTeX formulas using $ signs, e.g. $(3\times 4)$
            </div>
            <div
              css={css`
                ${presets.row}
                margin-bottom: 10px;
                justify-content: space-between;
              `}
            >
              <FormControl>
                <Select value={visibility} onChange={this.handleVisibilityChange} input={<Input name="visiblity" />}>
                  {selectedGroup ? <MenuItem value="group">{selectedGroup.name}</MenuItem> : null}
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="private" disabled={!isLoggedIn}>
                    Private
                  </MenuItem>
                  {!selectedGroup && (
                    <div>
                      <MenuItem
                        value="newGroup"
                        disabled={!isLoggedIn}
                        onClick={e => {
                          e.stopPropagation();
                          e.preventDefault();
                          openGroupsModal();
                        }}
                      >
                        New Group
                      </MenuItem>
                    </div>
                  )}
                </Select>
              </FormControl>
              {this.props.isLoggedIn && visibility === 'public' ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.anonymous}
                      onChange={this.handleAnonymousChange}
                      color="primary"
                      value="anonymous"
                      css={css`
                        padding: 3px 5px 3px 12px !important;
                      `}
                    />
                  }
                  css={css`
                    margin: 0;
                    margin-right: 0 !important;
                  `}
                  label="Post anonymously"
                />
              ) : null}
            </div>
            <div
              css={css`
                ${presets.row}
                justify-content: flex-end;
              `}
            >
              <Button type="submit" variant="contained" color="primary" size="small">
                Submit
              </Button>
            </div>
            {!this.props.isLoggedIn ? (
              <div
                css={css`
                  margin-top: 12px;
                  font-size: 12px;
                  color: #9f9f9f;
                `}
              >
                Please log in to add private comments
              </div>
            ) : null}
          </form>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: !isEmpty(state.user.userData),
    selectedGroup: state.user.selectedGroup,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openGroupsModal: () => {
      dispatch(actions.toggleGroupsModal(true));
    },
  };
};
const withRedux = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withRedux(Tip);
