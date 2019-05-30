/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import ReactDom from 'react-dom';
import React from 'react';
import { Popper, Paper } from '@material-ui/core';
import { popupCss } from '../../../utils/presets';

const MyPopup = ({ elem, popupContent }) => {
  const contentRef = React.useRef(null);
  const timeoutRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const hidePopup = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 300);
  };

  React.useEffect(() => {
    // Clear timeout on unmount
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  return (
    <React.Fragment>
      <span ref={contentRef} onMouseEnter={() => setIsOpen(true)} onMouseLeave={hidePopup}>
        {elem}
      </span>
      <Popper open={isOpen} anchorEl={contentRef.current} placement="top" style={{ zIndex: 10 }}>
        <Paper css={popupCss}>
          <div
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
            onMouseLeave={hidePopup}
          >
            {popupContent}
          </div>
        </Paper>
      </Popper>
    </React.Fragment>
  );
};

export const convertMatches = (queryLen, matches, textLayer) => {
  // Early exit if there is nothing to convert.
  const { textContentItemsStr } = textLayer;
  if (!matches) {
    return [];
  }

  let i = 0;
  let iIndex = 0;
  const end = textContentItemsStr.length - 1;
  const result = [];

  for (let m = 0, mm = matches.length; m < mm; m++) {
    // Calculate the start position.
    let matchIdx = matches[m];

    // Loop over the divIdxs.
    while (i !== end && matchIdx >= iIndex + textContentItemsStr[i].length) {
      iIndex += textContentItemsStr[i].length;
      i++;
    }

    if (i === textContentItemsStr.length) {
      console.error('Could not find a matching mapping');
    }

    const match = {
      begin: {
        divIdx: i,
        offset: matchIdx - iIndex,
      },
    };

    matchIdx += queryLen;

    // Somewhat the same array as above, but use > instead of >= to get
    // the end position right.
    while (i !== end && matchIdx > iIndex + textContentItemsStr[i].length) {
      iIndex += textContentItemsStr[i].length;
      i++;
    }

    match.end = {
      divIdx: i,
      offset: matchIdx - iIndex,
    };
    result.push(match);
  }
  return result;
};

export const renderMatches = (matches, pageIdx, textLayer, tooltipText) => {
  const { textContentItemsStr, textDivs } = textLayer;

  if (matches.length === 0) {
    return;
  }

  let prevEnd = null;
  const infinity = {
    divIdx: -1,
    offset: undefined,
  };

  const appendTextToDiv = (divIdx, fromOffset, toOffset, addTooltip = false) => {
    const div = textDivs[divIdx];
    const content = textContentItemsStr[divIdx].substring(fromOffset, toOffset);
    const node = document.createTextNode(content);
    if (addTooltip) {
      const span = document.createElement('span');
      div.appendChild(span);
      ReactDom.render(
        <MyPopup
          popupContent={
            <span
              css={css`
                text-transform: capitalize;
              `}
            >
              {tooltipText}
            </span>
          }
          elem={content}
        />,
        span,
      );
      return;
    }
    div.appendChild(node);
  };

  const beginText = begin => {
    const { divIdx } = begin;
    textDivs[divIdx].textContent = '';
    appendTextToDiv(divIdx, 0, begin.offset);
  };

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const { begin, end } = match;

    // Match inside new div.
    if (!prevEnd || begin.divIdx !== prevEnd.divIdx) {
      // If there was a previous div, then add the text at the end.
      if (prevEnd !== null) {
        appendTextToDiv(prevEnd.divIdx, prevEnd.offset, infinity.offset);
      }
      // Clear the divs and set the content until the starting point.
      beginText(begin);
    } else {
      appendTextToDiv(prevEnd.divIdx, prevEnd.offset, begin.offset);
    }
    appendTextToDiv(begin.divIdx, begin.offset, end.offset, true);
    prevEnd = end;
  }

  if (prevEnd) {
    appendTextToDiv(prevEnd.divIdx, prevEnd.offset, infinity.offset);
  }
};