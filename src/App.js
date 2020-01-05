import React, {Component} from 'react';
import {withAuthenticator} from 'aws-amplify-react';
import Amplify, {Auth} from 'aws-amplify';
import awsconfig from './aws-exports';
import lookerSSOHelper from './looker-sso-helper';

Amplify.configure(awsconfig);

let userData = {};

function generate(ud) {
    const hour = 60 * 60;
    const urlData = {
        embed_url: '/embed/looks/4',
        session_length: hour,
        external_user_id: ud.username,
        permissions: ['access_data', 'see_looks'],
        models: ['pd_platform'],
        force_logout_login: true
    };

    return lookerSSOHelper(urlData);
}

class App extends Component {
    async componentDidMount() {
        try {
            const user = await Auth.currentAuthenticatedUser({bypassCache: true});
            await this.setState(prevState => {
                return {user};
            });
        } catch (error) {
            console.error(error);
        }
    }
    render() {
        const {state} = this;
        let url = '';
        if (state && Object.keys(state).length > 0) {
            url = generate(state.user);
        }

        return (
            <iframe title="Looker - Look 4" width="1000" height="600" frameBorder="0" src={url}></iframe>
        );
    }
}

export default withAuthenticator(App, true);
