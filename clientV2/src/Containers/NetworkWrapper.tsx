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
    let s = document.createElement('script');
    if (debug) {
      this.setState({
        disqusLoaded: true,
        disqusType: 'proxy',
      });
      return;
    }
    s = {
      ...s,
      src: `https://${username}.disqus.com/embed.js`,
      async: true,
      /* request for official disqus, if succeed then load native, otherwise load proxy version  */
      onload: (): void => {
        this.setState({ disqusType: 'native' });
        console.log('Native Disqus.');
      },
      onerror: (): void => {
        this.setState({ disqusType: 'proxy' });
        console.log('Proxy Disqus');
      },
    };
    s.setAttribute('data-timestamp', String(+new Date()));
    document.body.appendChild(s);
  }


  render = (): JSX.Element => {
    const { disqusLoaded, disqusType } = this.state;

    return (
      <div className="App">
        {
          (disqusLoaded === false)
          && (
            <div>
              <i className="fa fa-circle-o-notch fa-spin" />
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
