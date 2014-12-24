var REQUEST_PROJECT_LIST_INITIALIZE ="REQUEST_PROJECT_LIST_INITIALIZE";
var PROJECT_PATH_CHANGE             ="PROJECT_PATH_CHANGE";
var PROJECT_STATE_CHANGE            ="PROJECT_STATE_CHANGE";
var APP_LOADING_CHANGE              ="APP_LOADING_CHANGE";

var PROJECT_PATH    ="/project_chaospace_angularjs/";
var ASSET_PATH      =PROJECT_PATH+"assets/data/";
var PARTISAL_PATH   =PROJECT_PATH+"partisal/";
var DETAIL_PATH	  =PROJECT_PATH+"projects/";

var WIDE_W      = 1130;
var DESKTOP_W   = 840;
var TABLET_W    = 550;
var MOBILE_W    = 320;


var CONTAINER_W;
var LIST_UNIT;

var RENDERER_H  = 340;
var RENDERER_W  = 260;
var RENDERER_GAP = 30;

var PROJECT_STATE = {
    INIT:"INIT",
    CHANGE:"CHANGE",
    DETAIL:"DETAIL",
    NORMAL:"NORMAL"
};

/**
    홈페이지 angularjs적용 하기
*/
var cpApp = angular.module('cpProjectApp',[
    'ngRoute',
    'cpProjectServices',
    'cpProjectDirectives',
    'cpProjectControllers'
    ,'cpProjectAnimations'
]);

cpApp.config(['$routeProvider', function( $routeProvider ){
	
	$routeProvider
	.when('/projects', {
		templateUrl:'projects/blank.html',
		controller:'ProjectDetailController'
	}).
	when('/projects/:projectId',{
		templateUrl:'projects/project.html',
		controller:'ProjectDetailController'
	}).
	otherwise({
		redirectTo:'/projects'
	});

}]);
