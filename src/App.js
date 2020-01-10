'use strict';

import React, {Component} from 'react';
import {withAuthenticator} from 'aws-amplify-react';
import Amplify, {Auth, API} from 'aws-amplify';

Amplify.configure({
    Auth: {
        identityPoolId: 'us-west-2:597a5127-f9cd-41cd-9206-9127295329ef',
        region: 'us-west-2',
        userPoolId: 'us-west-2_TxWDShdi6',
        userPoolWebClientId: '19go2htj4c8lqlukvrdi1t6l1o'
    },
    API: {
        endpoints: [
            {
                name: 'generateEmbedUrl',
                endpoint: 'https://api.amplify-demo.impactsigma.xyz',
                region: 'us-west-2'
            }
        ]
    }
});

global.Amplify = Amplify;

class App extends Component {
    async componentDidMount() {
        try {
            const userData = await Auth.currentAuthenticatedUser({bypassCache: true});
            const credentials = await Auth.currentCredentials();

            const {embedUrl} = await API.post('generateEmbedUrl', '/generateEmbedUrl', {
                body: {userData}
            });

            await this.setState(prevState => {
                return {url};
            });
        } catch (error) {
            console.error(error);
        }
    }
    render() {
        const {state} = this;

        return (
            <iframe title="Looker - Look 4" width="1000" height="600" frameBorder="0" src={state && state.url}></iframe>
        );
    }
}

export default withAuthenticator(App, true);
