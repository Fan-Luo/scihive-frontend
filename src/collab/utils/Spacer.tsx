/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';

export const Spacer: React.FC<{ size: number }> = ({ size }) => (
  <div className="spacer" css={{ width: size, height: size }} />
);
