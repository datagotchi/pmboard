const getAccessToken = jest.fn(() => {
  console.log("*** in MOCK getAccessToken");
});

const getGoogleDriveFiles = jest.fn(() => {
  console.log("*** in MOCK getGoogleDriveFiles");
});

export default () => ({
  getAccessToken,
  getGoogleDriveFiles,
});
