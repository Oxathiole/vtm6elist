import React from 'react';
import { ClassicPage1 } from './ClassicPage1';
import { ClassicPage2 } from './ClassicPage2';
import './classic.css';

export const ClassicSheetPage = () => (
  <div className="cl-page-wrapper">
    <ClassicPage1 />
    <ClassicPage2 />
  </div>
);
