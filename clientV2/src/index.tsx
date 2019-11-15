import React from 'react';
import ReactDOM from 'react-dom';
import NetworkWrapper from './NetworkWrapper';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(<NetworkWrapper />, document.getElementById('disqus_thread'));

serviceWorker.unregister();
