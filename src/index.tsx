import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './style/css/index.css'
import './style/css/components.css'

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

serviceWorker.unregister();
