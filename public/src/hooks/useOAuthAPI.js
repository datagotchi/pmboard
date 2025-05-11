import * as oauth from "oauth4webapi";

import { EvidenceFile, GoogleFile, OAuthAPIFunctions } from "../types";

/**
 * A React hook to expose the API from oauth4webapi.
 * @type {OAuthAPIFunctions}
 * @example const {a, b, c} = useOAuthAPI();
 */
const useOAuthAPI = () => {
  const redirect_uri = "http://localhost:8000";
  const issuer = new URL("https://accounts.google.com");
  /**
   * @type {oauth.AuthorizationServer}
   */
  let authorizationServer;
  /**
   * @type {string}
   */
  let state;

  let client, code_challenge_method, code_verifier, code_challenge;

  /**
   * Redirect the current page to the Google OAuth authorization page.
   * @param {oauth.Client} client The client containing the secret/key information.
   * @param {string} code_challenge The code challenge to send to authorization, and then reuse once you get an access token.
   * @param {string} code_challenge_method The method to use for to verify the code challenge.
   * @example gotoAuthorizationUrl(client, code_challenge, code_challenge_method)
   */
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
    authorizationUrl.searchParams.set("access_type", "offline");
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

    open(authorizationUrl, "_self");
  };

  /**
   * Parse the data in the URL query parameters from the Google authorization server.
   * @param {oauth.AuthorizationServer} authorizationServer The server to intract with for OAuth.
   * @param {oauth.Client} client The oauth client with key/secret details.
   * @param {string} code_verifier The "password" for the next oauth server communication.
   * @param {string} state A state token for auth backup.
   * @returns {string} The access token parsed from the return-URL query parameters.
   * @example const access_token = await getAccessTokenFromGoogle(
          authorizationServer,
          client,
          code_verifier,
          state
        );
   */
  const getAccessTokenFromGoogle = async (
    authorizationServer,
    client,
    code_verifier,
    state
  ) => {
    // one eternity later, the user lands back on the redirect_uri
    // Authorization Code Grant Request & Response
    /**
     * @type {string}
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
     * @type {oauth.WWWAuthenticateChallenge[] | undefined}
     */
    let challenges;
    if ((challenges = oauth.parseWwwAuthenticateChallenges(response))) {
      for (const challenge of challenges) {
        console.error("WWW-Authenticate Challenge", challenge);
      }
      throw new Error(); // Handle WWW-Authenticate Challenges as needed
    }

    const result = await oauth.processAuthorizationCodeOAuth2Response(
      authorizationServer,
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

  /**
   * Get an oauth authorization server.
   * @returns {Promise<oauth.AuthorizationServer>} The promise from the API call
   * @example authorizationServer = await getAuthorizationServer()
   */
  const getAuthorizationServer = async () =>
    await oauth
      .discoveryRequest(issuer, { algorithm: "oidc" })
      .then((response) => oauth.processDiscoveryResponse(issuer, response));

  /**
   * A recursive function to visit all pages of a files response from the Goolge server.
   * @param {EvidenceFile[]} filesArray The recursive return array of all files.
   * @param {string} access_token The access token from the oauth server.
   * @param {string} nextPageToken The token to get the next page of files.
   * @returns {EvidenceFile[]} The final version of the filesArray after visiting all pages.
   * @example if (data.nextPageToken) {
          return getNextPage(filesArray, access_token, data.nextPageToken);
        }
   */
  const getNextPage = (filesArray, access_token, nextPageToken = null) =>
    oauth
      .protectedResourceRequest(
        access_token,
        "GET",
        new URL(
          `https://www.googleapis.com/drive/v2/files${
            nextPageToken ? `?pageToken=${nextPageToken}` : ""
          }`
        )
      )
      .then(async (response) => {
        if (response.status === 401) {
          sessionStorage.removeItem("access_token");
          window.location.reload();
        }
        /**
         * @type {oauth.WWWAuthenticateChallenge[] | undefined}
         */
        let challenges;
        if ((challenges = oauth.parseWwwAuthenticateChallenges(response))) {
          for (const challenge of challenges) {
            console.error("WWW-Authenticate Challenge", challenge);
          }
          throw new Error(); // Handle WWW-Authenticate Challenges as needed
        }
        return response.json();
      })
      .then((data) => {
        filesArray.push(...data.items);
        if (data.nextPageToken) {
          return getNextPage(filesArray, access_token, data.nextPageToken);
        } else {
          return filesArray;
        }
      });

  /**
   * The exposed function to get all files from Google Drive.
   * @param {string} access_token The recently-provided access token to make an API request.
   * @returns {Promise<GoogleFile[]>} The entire list of files from gdrive.
   * @example const {getGoogleDriveFiles} = useOAuthAPI();
   */
  const getGoogleDriveFiles = async (access_token) => {
    const files = await getNextPage([], access_token);
    return files;
  };

  /**
   * A convenience function to initialize things before requesting an oauth access token & downloading files.
   * @returns {object} The {oauth.AuthorizationServer, oauth.Client, code_verifier} needed for function calls.
   */
  const init = async () => {
    authorizationServer = await getAuthorizationServer();
    const { key, secret } = await import("../../../config");
    /**
     * @type {oauth.Client}
     */
    client = {
      client_id: key,
      client_secret: secret,
      token_endpoint_auth_method: "client_secret_basic",
    };
    code_challenge_method = "S256";
    if (sessionStorage.getItem("code_verifier")) {
      code_verifier = sessionStorage.getItem("code_verifier");
    } else {
      code_verifier = oauth.generateRandomCodeVerifier();
      sessionStorage.setItem("code_verifier", code_verifier);
    }
    code_challenge = await oauth.calculatePKCECodeChallenge(code_verifier);
    return {
      authorizationServer,
      client,
      code_verifier,
    };
  };

  /**
   * Request an access token from the Google OAuth server.
   * @returns {Promise<string | null | undefined>} The API call promise.
   * @example const {getAccessToken} = useOAuthAPI();
   */
  const getAccessToken = async () => {
    if (
      sessionStorage.getItem("access_token") &&
      sessionStorage.getItem("access_token") !== "undefined"
    ) {
      return sessionStorage.getItem("access_token");
    } else {
      if (!window.location.search.includes("code=")) {
        await init();
        gotoAuthorizationUrl(client, code_challenge, code_challenge_method);
      } else {
        const { authorizationServer, client, code_verifier } = await init();
        const access_token = await getAccessTokenFromGoogle(
          authorizationServer,
          client,
          code_verifier,
          state
        );
        sessionStorage.setItem("access_token", access_token);
        sessionStorage.removeItem("code_verifier");
        open(window.location.origin, "_self");
      }
    }
  };

  return {
    getAccessToken,
    getGoogleDriveFiles,
  };
};

export default useOAuthAPI;
