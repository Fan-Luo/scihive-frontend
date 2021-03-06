/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Paper } from '@material-ui/core';
import { pick } from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import shallow from 'zustand/shallow';
import { Reference } from '../models';
import { usePaperStore } from '../stores/paper';
import { presets } from '../utils';
import { popupCss } from '../utils/presets';
import { PopupManager } from './Popup';

const ReferencesPopupManager: React.FC<{
  referencePopoverAnchor?: HTMLElement;
  clearAnchor: () => void;
  reference: Reference;
}> = ({ referencePopoverAnchor, clearAnchor, reference }) => {
  const content = reference ? (
    <Paper css={popupCss}>
      {reference.arxivId && (
        <div
          css={css`
            ${presets.row};
            width: 100%;
            justify-content: flex-end;
          `}
        >
          <Link
            to={`/paper/${reference.arxivId}`}
            css={css`
              color: ${presets.themePalette.primary.main};
            `}
            target="_blank"
          >
            <i className="fas fa-external-link-alt" />
          </Link>
        </div>
      )}
      <div
        css={css`
          p {
            margin: 0.2rem;
          }
        `}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: reference.html }}
      />
    </Paper>
  ) : null;

  return <PopupManager anchorEl={referencePopoverAnchor} clearAnchor={clearAnchor} popupContent={content} />;
};

export interface ReferencesPopoverState {
  anchor?: HTMLElement;
  citeId: string;
}

const ReferencesProvider: React.FC = ({ children }) => {
  const { references } = usePaperStore(state => pick(state, ['references']), shallow);
  const [referencePopoverState, setReferencePopoverState] = React.useState<ReferencesPopoverState>({
    citeId: '',
  });

  return (
    <React.Fragment>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { setReferencePopoverState });
        }
        return child;
      })}
      {references && (
        <ReferencesPopupManager
          referencePopoverAnchor={referencePopoverState.anchor}
          clearAnchor={() => setReferencePopoverState({ citeId: '' })}
          reference={references[referencePopoverState.citeId]}
        />
      )}
    </React.Fragment>
  );
};

export default ReferencesProvider;
