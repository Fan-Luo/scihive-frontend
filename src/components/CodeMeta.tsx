/** @jsx jsx */
import { css, jsx, SerializedStyles } from '@emotion/core';
import React from 'react';
import { withStyles, List, ListItem, ListItemIcon, Button, Popover, createStyles, WithStyles } from '@material-ui/core';
import { CodeMeta } from '../models';

const styles = () =>
  createStyles({
    link: {
      textTransform: 'inherit',
      textDecoration: 'inherit',
      color: 'inherit',
    },
    popover: {
      maxHeight: '150px',
      overflowY: 'auto',
    },
  });

interface Props extends WithStyles<typeof styles> {
  data: CodeMeta;
  iconCss: SerializedStyles;
}

const CodeMetaRender: React.FC<Props> = ({ data, classes, iconCss }) => {
  const [anchorEl, setAnchorEl] = React.useState<Element>();

  const handleClick = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(undefined);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Button
        aria-owns={open ? 'simple-popper' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
        css={css`
          padding: 0 4px;
        `}
      >
        <i className="fas fa-code" css={iconCss} /> {data.stars || 0}
      </Button>
      <Popover
        id="simple-popper"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{ paper: classes.popover }}
      >
        <List>
          <a
            className={classes.link}
            href={data.github}
            target="_blank"
            rel="noopener noreferrer"
            css={css`
              font-size: 13px;
            `}
          >
            <ListItem>
              <ListItemIcon
                css={css`
                  margin-right: 8px;
                  min-width: 0;
                `}
              >
                <i className="fab fa-github" />
              </ListItemIcon>
              Github
            </ListItem>
          </a>
          <a
            className={classes.link}
            href={data.paperswithcode}
            target="_blank"
            rel="noopener noreferrer"
            css={css`
              font-size: 13px;
            `}
          >
            <ListItem>
              <ListItemIcon
                css={css`
                  margin-right: 8px;
                  min-width: 0;
                `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  fill="#21cbce"
                  css={css`
                    height: 15px;
                    width: 15px;
                  `}
                >
                  <path d="M88 128h48v256H88zM232 128h48v256h-48zM160 144h48v224h-48zM304 144h48v224h-48zM376 128h48v256h-48z" />
                  <path d="M104 104V56H16v400h88v-48H64V104zM408 56v48h40v304h-40v48h88V56z" />
                </svg>
              </ListItemIcon>
              PapersWithCode
            </ListItem>
          </a>
        </List>
      </Popover>
    </div>
  );
};

export default withStyles(styles)(CodeMetaRender);
