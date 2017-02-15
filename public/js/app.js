angular.module('pmboard', [
  'ngResource',
  'xeditable'
]).run(function (editableOptions) {
   editableOptions.theme = 'bs3';
});