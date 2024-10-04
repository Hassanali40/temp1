import React from 'react';
import { SVG } from './svg';

interface IIcon {
  name: keyof typeof SVG;
}

export default function Icon({ name }: IIcon) {
  if (SVG[name]) {
    return SVG[name];
  }

  return <svg></svg>;
}
