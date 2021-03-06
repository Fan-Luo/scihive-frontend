/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { TextLinkifyLatex } from './TextLinkifyLatex';
import { Reply } from '../models';

const Replies: React.FC<{ replies: Reply[] }> = ({ replies }) => {
  return (
    <div
      css={css`
        border-top: 1px solid #cfcfcf;
        margin-bottom: 4px;
      `}
    >
      {replies.map((reply, index) => {
        return (
          <div
            key={index}
            css={css`
              padding-top: 5px;
              font-size: 0.8rem;
              .katex {
                font-size: 0.75rem;
              }
            `}
          >
            <b>{reply.user}</b> <TextLinkifyLatex text={reply.text} />
          </div>
        );
      })}
    </div>
  );
};

export default Replies;
