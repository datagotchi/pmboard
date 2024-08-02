import * as oauth from "oauth4webapi";

const useOAuthAPI = () => {
  const service = {};

  const redirect_uri = "http://localhost:8000";
  const issuer = new URL("https://accounts.google.com");
  /**
   * @type oauth.AuthorizationServer
   */
  let authorizationServer;
  /**
   * @type string
   */
  let state;

  let client, code_challenge_method, code_verifier, code_challenge;

  const gotoAuthorizationUrl = (
    client,
    code_challenge,
    code_challenge_method
  ) => {
    // redirect user to as.authorization_endpoint
    const authorizationUrl = new URL(
      authorizationServer.authorization_endpoint
    );
    authorizationUrl.searchParams.set("client_id", client.client_id);
    authorizationUrl.searchParams.set("redirect_uri", redirect_uri);
    authorizationUrl.searchParams.set("response_type", "code");
    // authorizationUrl.searchParams.set("scope", "api:read");
    authorizationUrl.searchParams.set(
      "scope",
      "https://www.googleapis.com/auth/drive.readonly"
    );
    authorizationUrl.searchParams.set("code_challenge", code_challenge);
    authorizationUrl.searchParams.set(
      "code_challenge_method",
      code_challenge_method
    );

    /**
     * We cannot be sure the AS supports PKCE so we're going to use state too. Use of PKCE is
     * backwards compatible even if the AS doesn't support it which is why we're using it regardless.
     */
    if (
      authorizationServer.code_challenge_methods_supported.includes("S256") !==
      true
    ) {
      state = oauth.generateRandomState();
      authorizationUrl.searchParams.set("state", state);
    }

    // now redirect the user to authorizationUrl.href
    open(authorizationUrl, "_self");
  };

  /**
   *
   * @param {URL} url
   * @param {oauth.Client} client
   * @param {string} code_verifier
   */
  const getAccessToken = async (
    authorizationServer,
    client,
    code_verifier,
    state
  ) => {
    // one eternity later, the user lands back on the redirect_uri
    // Authorization Code Grant Request & Response
    /**
     * @type string
     */
    let access_token;

    // const currentUrl = getCurrentUrl();
    const currentUrl = new URL(window.location.href);
    const params = oauth.validateAuthResponse(
      authorizationServer,
      client,
      currentUrl,
      state
    );

    if (oauth.isOAuth2Error(params)) {
      console.error("Error Response", params);
      throw new Error(); // Handle OAuth 2.0 redirect error
    }

    const response = await oauth.authorizationCodeGrantRequest(
      authorizationServer,
      client,
      params,
      redirect_uri,
      code_verifier
    );

    /**
     * @type oauth.WWWAuthenticateChallenge[] | undefined
     */
    let challenges;
    if ((challenges = oauth.parseWwwAuthenticateChallenges(response))) {
      for (const challenge of challenges) {
        console.error("WWW-Authenticate Challenge", challenge);
      }
      throw new Error(); // Handle WWW-Authenticate Challenges as needed
    }

    const result = await oauth.processAuthorizationCodeOAuth2Response(
      as,
      client,
      response
    );
    if (oauth.isOAuth2Error(result)) {
      console.error("Error Response", result);
      throw new Error(); // Handle OAuth 2.0 response body error
    }

    console.log("Access Token Response", result);
    ({ access_token } = result);
    return access_token;
  };

  const getAuthorizationServer = async () =>
    await oauth
      .discoveryRequest(issuer, { algorithm: "oidc" })
      .then((response) => oauth.processDiscoveryResponse(issuer, response));

  // Protected Resource Request
  /**
   *
   * @param {string} access_token
   */
  const protectedResourceRequest = async (access_token) => {
    const response = await oauth.protectedResourceRequest(
      access_token,
      "GET",
      new URL("https://rs.example.com/api")
    );

    /**
     * @type oauth.WWWAuthenticateChallenge[] | undefined
     */
    let challenges;
    if ((challenges = oauth.parseWwwAuthenticateChallenges(response))) {
      for (const challenge of challenges) {
        console.error("WWW-Authenticate Challenge", challenge);
      }
      throw new Error(); // Handle WWW-Authenticate Challenges as needed
    }

    console.log("Protected Resource Response", await response.json());
  };

  const init = async () => {
    authorizationServer = await getAuthorizationServer();
    var config = require("../../../config");
    /**
     * @type oauth.Client
     */
    client = {
      client_id: config.key,
      client_secret: config.secret,
      token_endpoint_auth_method: "client_secret_basic",
    };
    code_challenge_method = "S256";
    /**
     * @type string
     */
    code_verifier = oauth.generateRandomCodeVerifier();
    code_challenge = await oauth.calculatePKCECodeChallenge(code_verifier);
    return {
      authorizationServer,
      client,
      code_verifier,
    };
  };

  service.doAuthentication = async () => {
    if (!window.location.search.includes("code=")) {
      await init();
      gotoAuthorizationUrl(client, code_challenge, code_challenge_method);
    } else {
      const { authorizationServer, client, code_verifier } = await init();
      console.log("hi");
      const access_token = await getAccessToken(
        authorizationServer,
        client,
        code_verifier,
        state
      );
      await protectedResourceRequest(access_token);
    }
  };

  return service;
};

export default useOAuthAPI;
