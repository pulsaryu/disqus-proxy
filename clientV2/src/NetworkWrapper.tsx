import React from 'react';
import DisqusProxy from './DisqusProxy';

const { username, debug } = window.disqusProxy;

declare global {
  interface Window {
    disqusProxy: {
      username: string,
      server: string,
      port: number,
      protocol: string,
      defaultAvatar: string,
      adminAvatar: string,
      identifier: string,
      debug: boolean,
    }
  }
}

interface NetworkWrapperStates {
  disqusLoaded: boolean;
  disqusType: string;
}


export class NetworkWrapper extends React.Component<{}, NetworkWrapperStates> {
  constructor(props: any, context?: any) {
    super(props, context);
    this.state = {
      disqusLoaded: false,
      disqusType: 'native',
    }
  }

  componentDidMount() {
    let s = document.createElement('script')
    if (debug) {
      this.setState({
        disqusLoaded: true,
        disqusType: 'proxy'
      });
      return;
    }
    s = {
      ...s,
      src: `https://${username}.disqus.com/embed.js`,
      async: true,
      /* request for official disqus, if succeed then load native, otherwise load proxy version  */
      onload: () => {
        this.setState({ disqusType: 'native' })
        console.log('Native Disqus.')
      },
      onerror: () => {
        this.setState({ disqusType: 'proxy' })
        console.log('Proxy Disqus')
      },
    }
    s.setAttribute('data-timestamp', String(+new Date()))
    document.body.appendChild(s);
  }


  render() {
    const { disqusLoaded, disqusType } = this.state;
    if (debug) {
      console.log(this.state);
    }

    return (
      <div className="App">
        {
          (disqusLoaded === false) &&
          <div>
            <i className="fa fa-circle-o-notch fa-spin"></i>
            Loading Disqus...
          </div>
        }
        {
          (disqusLoaded === true && disqusType === 'proxy') &&
          <DisqusProxy />
        }
      </div>
    )
  };
}

export default NetworkWrapper;
