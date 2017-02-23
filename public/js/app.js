angular.module('pmboard', [
//   'ngResource',
  'xeditable',
  'ui.bootstrap',
  'ngTagsInput',
  'ngCookies'
]).run(function (editableOptions) {
   editableOptions.theme = 'bs3';
});
