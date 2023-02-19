const { logger } = require('./logger.js');
const config = require('config');

class TeslaAPI {
    constructor() {
        this.siteId = config.get('tesla.siteId');
        this.pwId = config.get('tesla.pwId');
        this.refreshToken = config.get('tesla.refreshToken');
        this.accessToken = undefined;
    };

    async initialize() {
        logger.info("TeslaAPI initializing");
        logger.debug('using siteId %s', this.siteId);
        logger.debug('using pwId %s', this.pwId);
        logger.debug('using refreshToken %s', this.refreshToken);

        if (! await this.checkAndRefreshAccessToken()) {
            logger.error("Unable to fetch access token. See logs for details.");
            return false;
        };

        return true;
    }

    async checkAndRefreshAccessToken() {
        if (this.isAccessTokenValid()) {
            logger.debug("AccessToken is present and still valid.");
            return true;
        }

        let body = JSON.stringify({
            grant_type: 'refresh_token',
            client_id: 'ownerapi',
            refresh_token: this.refreshToken,
            scope: 'openid email offline_access'
        });

        logger.debug('Body for Tesla: %s', body)

        const url = "https://auth.tesla.com/oauth2/v3/token"

        const response = await fetch(url, {
            method: 'POST',
            body: body,
            headers: {
                'content-type': 'application/json; charset=utf-8',
            },
        });

        const json = await response.json();
        logger.debug('retrieved JSON from TeslaAPI: %s' , JSON.stringify(json));
        this.accessToken = json.access_token;
        logger.info("Fetched access token, validating");
        return this.isAccessTokenValid();
    }

    isAccessTokenValid() {
        if (this.accessToken === undefined) {
            logger.debug("accessToken is undefined");
            return false;
        }

        let atBufferString = Buffer.from(this.accessToken.split('.')[1], 'base64').toString();
        logger.debug("AccessToken payload: %s", atBufferString);
        
        let atJson = JSON.parse(atBufferString);
        const exp = atJson.exp;
        const now = new Date().getTime() / 1000;

        logger.debug('expiration of accessToken is %d, now is %d', exp, now);

        if (now > exp) {
            logger.info("Access Token has expired");
            return false;
        }

        logger.debug("Access Token is valid");
        return true;
    }
}

exports.TeslaAPI = TeslaAPI;