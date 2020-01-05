import crypto from 'crypto';
import querystring from 'querystring';

function nonce(len) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function forceUnicodeEncoding(string) {
    return decodeURIComponent(encodeURIComponent(string));
}

function created_signed_embed_url(options) {
    // looker options
    const host = 'paradata.looker.com';

    // user options
    const json_external_user_id = JSON.stringify(options.external_user_id);
    const json_permissions = JSON.stringify(options.permissions);
    const json_models = JSON.stringify(options.models);
    const json_group_ids = JSON.stringify(options.group_ids || []);
    const json_external_group_id = JSON.stringify(options.external_group_id || '');
    const json_user_attributes = JSON.stringify(options.user_attributes || {});
    const json_access_filters = JSON.stringify(options.access_filters || {});

    // url/session specific options
    const embed_path = '/login/embed/' + encodeURIComponent(options.embed_url);
    const json_session_length = JSON.stringify(options.session_length);
    const json_force_logout_login = JSON.stringify(options.force_logout_login);

    // computed options
    const json_time = JSON.stringify(Math.floor((new Date()).getTime() / 1000));
    const json_nonce = JSON.stringify(nonce(24));

    // compute signature
    let string_to_sign = '';
    string_to_sign += host + '\n';
    string_to_sign += embed_path + '\n';
    string_to_sign += json_nonce + '\n';
    string_to_sign += json_time + '\n';
    string_to_sign += json_session_length + '\n';
    string_to_sign += json_external_user_id + '\n';
    string_to_sign += json_permissions + '\n';
    string_to_sign += json_models + '\n';
    string_to_sign += json_group_ids + '\n';
    string_to_sign += json_external_group_id + '\n';
    string_to_sign += json_user_attributes + '\n';
    string_to_sign += json_access_filters;

    const signature = crypto.createHmac('sha1', LOOKER_EMBED_SECRET).update(forceUnicodeEncoding(string_to_sign)).digest('base64').trim();

    // construct query string
    const query_params = {
        nonce: json_nonce,
        time: json_time,
        session_length: json_session_length,
        external_user_id: json_external_user_id,
        permissions: json_permissions,
        models: json_models,
        access_filters: json_access_filters,
        group_ids: json_group_ids,
        external_group_id: json_external_group_id,
        user_attributes: json_user_attributes,
        force_logout_login: json_force_logout_login,
        signature: signature
    };

    const query_string = querystring.stringify(query_params);

    return 'https://' + host + embed_path + '?' + query_string;
}

export default created_signed_embed_url;
