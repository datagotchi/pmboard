angular.module('pmboard', [
  'ngResource',
  'xeditable',
  'ui.bootstrap',
  'ngTagsInput'
]).run(function (editableOptions) {
   editableOptions.theme = 'bs3';
});
