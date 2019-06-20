import React from 'react';
import { Router, Route } from 'react-router-dom';
import history from './components/router/history';

import Routes from './Routes';

function App() {
  return (
    <Router history={history}>
      <Route component={Routes} />
    </Router>
  );
}

export default App;
