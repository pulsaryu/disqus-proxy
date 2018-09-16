import React, { Component } from 'react';
import DisqusProxy from './DisqusProxy';

class App extends Component {

  constructor(){
    super()
    this.state = {
      disqusLoaded: null,
    }
  }

  componentDidMount(){
    const s = document.createElement('script')
    const username = window.disqusProxy.username;
    s.src = `https://${username}.disqus.com/embed.js`
    s.async = true
    s.setAttribute('data-timestamp', String(+new Date()))
    s.onload = () => {
      this.setState({disqusLoaded: true})
      console.log('Native Disqus.')
    }
    s.onerror = () => {
      this.setState({disqusLoaded: false})
      console.log('Proxy Disqus')
    }
    document.body.appendChild(s);
  }
  
  render() {
    return (
      <div className="App">
        {
          (this.state.disqusLoaded == null) &&
          <div>
            <i className="fa fa-circle-o-notch fa-spin"></i>
            Loading Disqus...
          </div>  
        }
        {
          (this.state.disqusLoaded == false) &&
          <DisqusProxy/>
        }
      </div>
    );
  }
}

export default App;
