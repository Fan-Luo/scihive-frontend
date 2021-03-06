/** @jsx jsx */
import { jsx } from '@emotion/core';
import { SerializedStyles } from '@emotion/css';
import { ClickAwayListener, Paper, Popper } from '@material-ui/core';
import { PopperProps } from '@material-ui/core/Popper';
import React from 'react';

interface PopoverMenuProps {
  anchorEl: PopperProps['anchorEl'];
  open: boolean;
  placement: PopperProps['placement'];
  onClose: () => void;
  contentCss?: SerializedStyles;
  zIndex?: number;
}

export const PopoverMenu: React.FC<PopoverMenuProps> = ({
  anchorEl,
  children,
  open,
  placement,
  onClose,
  contentCss,
  zIndex = 1,
}) => {
  return (
    <Popper anchorEl={anchorEl} placement={placement} open={open} style={{ zIndex }}>
      <ClickAwayListener onClickAway={onClose}>
        <Paper css={contentCss}>{children}</Paper>
      </ClickAwayListener>
    </Popper>
  );
};
