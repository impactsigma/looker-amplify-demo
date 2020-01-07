import React, {Component} from 'react';
import {withAuthenticator} from 'aws-amplify-react';
import Amplify, {Auth, API} from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

class App extends Component {
    async componentDidMount() {
        try {
            const userData = await Auth.currentAuthenticatedUser({bypassCache: true});
            const credentials = await Auth.currentCredentials();
            const {embedUrl} = await API.post('apie5bd5a2a', '/generateEmbedUrl', {
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
