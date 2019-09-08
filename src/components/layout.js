import React from 'react';

import './layout.css';

const Layout = ({ children }) => (
  <>
    <header>
      <span>Video Chat App</span>
    </header>
    <main>{children}</main>
  </>
);

export default Layout;
