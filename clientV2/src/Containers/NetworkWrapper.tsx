import React from 'react';
import DisqusProxy from './DisqusProxy';
import { iNetworkWrapperStates } from '../Interfaces/Interfaces';
import { config } from '../Interfaces/Config';

const { username, debug } = config.disqusProxy;

export class NetworkWrapper extends React.Component<{}, iNetworkWrapperStates> {
  constructor(props: any, context?: any) {
    super(props, context);
    this.state = {
      disqusLoaded: false,
      disqusType: 'native',
    };
  }

  componentDidMount = (): void => {
    if (debug) {
      this.setState({
        disqusLoaded: true,
        disqusType: 'proxy',
      });
      return;
    }
    let s = document.createElement('script');
    s.src = `https://${username}.disqus.com/embed.js`
    s.async = true
    s.setAttribute('data-timestamp', String(+new Date()))
    s.onload = () => {
      this.setState({
        disqusLoaded: true,
        disqusType: 'native',
      })
      console.log('Native Disqus.')
    }
    s.onerror = () => {
      this.setState({
        disqusLoaded: true,
        disqusType: 'proxy',
      })
      console.log('Proxy Disqus')
    }

    document.body.appendChild(s);
  }


  render = (): JSX.Element => {
    const { disqusLoaded, disqusType } = this.state;
    
    return (
      <div className="App">
        {
          (disqusLoaded === false)
          && (
            <div className="m-3">
              <i className="mr-2 fa fa-circle-o-notch fa-spin" />
              Loading Disqus...
            </div>
          )
        }
        {
          (disqusLoaded === true && disqusType === 'proxy')
          && <DisqusProxy />
        }
      </div>
    );
  }
}

export default NetworkWrapper;
