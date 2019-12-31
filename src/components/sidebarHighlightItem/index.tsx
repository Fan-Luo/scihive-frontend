/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Card, CardContent, CardMedia, Grid, IconButton, Tooltip, Typography } from '@material-ui/core';
import axios from 'axios';
import React from 'react';
import useReactRouter from 'use-react-router';
import { T_Highlight, VisibilityType } from '../../models';
import NewReply from '../NewReply';
import Replies from '../Replies';
import { TextLinkifyLatex } from '../TextLinkifyLatex';
import get_age from '../timeUtils';
import { EditComment } from './editComment';
import { COLORS } from '../../utils/presets';

const visibiltyToIcon: { [key in VisibilityType]: string } = {
  private: 'fas fa-user-shield',
  public: 'fas fa-globe',
  anonymous: 'fas fa-globe',
  group: 'fas fa-users',
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

interface CommentProps {
  isFocused: boolean;
  highlight: T_Highlight;
  removeHighlight: (id: string) => void;
  updateHighlight: (highlight: T_Highlight) => void;
  jumpToHighlight: () => void;
}

const actionIconCss = css({ fontSize: 12, color: COLORS.grey });

const ActionIconButton: React.FC<{ onClick: (e: React.MouseEvent) => void; name: string }> = ({ onClick, name }) => (
  <IconButton onClick={onClick}>
    <i className={name} css={actionIconCss} />
  </IconButton>
);

export const SidebarHighlightItem = React.forwardRef<HTMLDivElement, CommentProps>(
  ({ isFocused, highlight, removeHighlight, updateHighlight, jumpToHighlight }, ref) => {
    const { image, text } = highlight.content;
    const [isHover, setIsHover] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const [showReply, setShowReply] = React.useState(false);
    const {
      history,
      match: { params },
    } = useReactRouter();

    const updateJumpTo = () => {
      jumpToHighlight();
      history.push({ hash: `highlight-${highlight.id}` });
    };

    const updateComment = (e: React.FormEvent, newText: string) => {
      console.log(e);
      e.preventDefault();
      axios
        .patch(`/paper/${params.PaperId}/comment/${highlight.id}`, {
          comment: newText,
        })
        .then(res => {
          updateHighlight(res.data.comment);
          setEditMode(false);
        })
        .catch(err => console.log(err.response));
    };

    const submitReply = (replyText: string) => {
      axios
        .post(`/paper/${params.PaperId}/comment/${highlight.id}/reply`, {
          text: replyText,
        })
        .then(res => {
          setShowReply(false);
          updateHighlight(res.data.comment);
        })
        .catch(err => console.log(err.response));
    };

    const textMaxLen = 50;
    const hasCommentText = Boolean(highlight.comment.text);

    return (
      <div
        css={css`
          width: 100%;
          .katex {
            font-size: 0.85rem;
          }
        `}
        ref={ref}
      >
        <Card
          style={{ backgroundColor: isFocused ? '#e0e9ff' : '#f9f9f9' }}
          css={{
            transition: '0.8s background-color',
            margin: '5px 8px',
            boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.12)',
          }}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <CardContent
            css={css`
              padding: 10px 10px 3px !important;
            `}
          >
            <div
              onClick={updateJumpTo}
              css={css`
                cursor: pointer;
              `}
            >
              {image && (
                <CardMedia
                  css={css`
                    height: 0;
                    padding-top: 56.25%;
                    border-bottom: solid 1px #bdbdbd;
                  `}
                  image={image}
                  title="screenshot"
                />
              )}
              {text && !hasCommentText && (
                <blockquote
                  css={css`
                    font-size: 0.7rem;
                    margin: 0;
                    margin-bottom: 6px;
                    font-style: italic;
                    quotes: '\\201C''\\201D';
                    &:before {
                      content: open-quote;
                      margin-right: -2px;
                    }
                    &:after {
                      content: close-quote;
                      margin-left: -2px;
                    }
                  `}
                >
                  {' '}
                  {text.slice(0, textMaxLen)}
                  {text.length > textMaxLen ? '...' : ''}{' '}
                </blockquote>
              )}
            </div>
            {editMode ? (
              <EditComment onCancel={() => setEditMode(false)} highlight={highlight} onUpdate={updateComment} />
            ) : (
              <Typography
                component="div"
                onClick={updateJumpTo}
                css={css`
                  cursor: pointer;
                  font-size: 0.8rem;
                `}
              >
                <TextLinkifyLatex text={highlight.comment.text} />
              </Typography>
            )}
            {hasCommentText && (
              <React.Fragment>
                <div
                  css={css`
                    margin-top: 5px;
                    font-size: 0.75rem;
                  `}
                >
                  <div>
                    <b>{highlight.user || 'Anonymous'}</b>, <small>{get_age(highlight.createdAt)}</small>
                  </div>
                </div>
                <Grid
                  container
                  alignItems="center"
                  css={css`
                    margin-top: 2px;
                    text-align: center;
                    display: flex;
                    button {
                      font-size: 14px;
                    }
                    margin-left: -5px;
                  `}
                >
                  <div>
                    <ActionIconButton onClick={() => setShowReply(!showReply)} name="fas fa-reply" />
                  </div>
                  {highlight.canEdit && isHover ? (
                    <div>
                      <ActionIconButton onClick={() => setEditMode(!editMode)} name="fas fa-pencil-alt" />
                      <ActionIconButton onClick={() => removeHighlight(highlight.id)} name="far fa-trash-alt" />
                    </div>
                  ) : (
                    ''
                  )}
                  {highlight.canEdit && (
                    <div
                      css={css`
                        margin-left: auto;
                        font-size: 13px;
                      `}
                    >
                      <Tooltip title={capitalize(highlight.visibility.type)} placement="top">
                        <i className={visibiltyToIcon[highlight.visibility.type]} css={actionIconCss} />
                      </Tooltip>
                    </div>
                  )}
                </Grid>
              </React.Fragment>
            )}
            {highlight.replies && <Replies replies={highlight.replies} />}
            {showReply && <NewReply onSubmit={submitReply} />}
          </CardContent>
        </Card>
      </div>
    );
  },
);