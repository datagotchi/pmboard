/**
 * @jest-environment jsdom
 */

import { renderHook, act, waitFor } from "@testing-library/react";

import useOAuthAPI from "../useOAuthAPI";

jest.mock("oauth4webapi", () => ({
  validateAuthResponse: jest.fn(),
  authorizationCodeGrantRequest: jest.fn(),
  parseWwwAuthenticateChallenges: jest.fn(),
  processAuthorizationCodeOAuth2Response: jest.fn(),
  isOAuth2Error: jest.fn(),
  processDiscoveryResponse: jest.fn(),
  generateRandomCodeVerifier: jest.fn(),
  calculatePKCECodeChallenge: jest.fn(),
  discoveryRequest: jest.fn().mockResolvedValue({}),
}));
jest.mock("../../../../config", () => ({
  key: "mockKey",
  secret: "mockSecret",
}));
beforeAll(() => {
  Object.defineProperty(global, "sessionStorage", {
    value: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });
});

describe("useOAuthAPI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it("should initialize and return the API functions", () => {
    const { result } = renderHook(() => useOAuthAPI());
    expect(result.current).toHaveProperty("getAccessToken");
    expect(result.current).toHaveProperty("getGoogleDriveFiles");
  });

  it("should call getAccessToken and return a token from sessionStorage", async () => {
    sessionStorage.setItem("access_token", "mockAccessToken");

    const { result } = renderHook(() => useOAuthAPI());

    const token = await result.current.getAccessToken();
    expect(token).toBe("mockAccessToken");
  });

  it("should call getAccessToken and redirect to authorization URL if no token exists", async () => {
    const mockGotoAuthorizationUrl = jest.fn();
    global.open = mockGotoAuthorizationUrl;

    oauth.generateRandomCodeVerifier.mockReturnValue("mockCodeVerifier");
    oauth.calculatePKCECodeChallenge.mockResolvedValue("mockCodeChallenge");
    oauth.processDiscoveryResponse.mockResolvedValue({
      authorization_endpoint: "https://mockAuthEndpoint",
    });

    const { result } = renderHook(() => useOAuthAPI());
    await act(async () => {
      await result.current.getAccessToken();
    });

    expect(mockGotoAuthorizationUrl).toHaveBeenCalled();
  });

  it("should call getGoogleDriveFiles and return files", async () => {
    const mockAccessToken = "mockAccessToken";
    const mockFiles = [
      { id: "1", name: "file1" },
      { id: "2", name: "file2" },
    ];

    oauth.protectedResourceRequest.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ items: mockFiles }),
    });

    const { result } = renderHook(() => useOAuthAPI());
    const files = await result.current.getGoogleDriveFiles(mockAccessToken);

    expect(files).toEqual(mockFiles);
  });

  it("should handle paginated responses in getGoogleDriveFiles", async () => {
    const mockAccessToken = "mockAccessToken";
    const mockFilesPage1 = [{ id: "1", name: "file1" }];
    const mockFilesPage2 = [{ id: "2", name: "file2" }];

    oauth.protectedResourceRequest
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({
          items: mockFilesPage1,
          nextPageToken: "mockNextPageToken",
        }),
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ items: mockFilesPage2 }),
      });

    const { result } = renderHook(() => useOAuthAPI());
    const files = await result.current.getGoogleDriveFiles(mockAccessToken);

    expect(files).toEqual([...mockFilesPage1, ...mockFilesPage2]);
  });

  it("should handle errors in getAccessTokenFromGoogle", async () => {
    oauth.validateAuthResponse.mockReturnValue({ error: "mockError" });

    const { result } = renderHook(() => useOAuthAPI());

    await expect(result.current.getAccessToken()).rejects.toThrowError();
  });
});
