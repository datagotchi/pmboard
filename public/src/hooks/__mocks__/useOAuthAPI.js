const getAccessToken = jest.fn();

const getGoogleDriveFiles = jest.fn();

export default () => ({
  getAccessToken,
  getGoogleDriveFiles,
});
