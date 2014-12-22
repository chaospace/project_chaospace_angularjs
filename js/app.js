var REQUEST_PROJECT_LIST_INITIALIZE ="REQUEST_PROJECT_LIST_INITIALIZE";
var PROJECT_PATH_CHANGE             ="PROJECT_PATH_CHANGE";
var PROJECT_STATE_CHANGE            ="PROJECT_STATE_CHANGE";
var APP_LOADING_CHANGE              ="APP_LOADING_CHANGE";

var PROJECT_PATH    ="/project_chaospace_angularjs/";
var ASSET_PATH      =PROJECT_PATH+"assets/data/";
var PARTISAL_PATH   =ASSET_PATH+"partisal/";
var DETAIL_PATH	  =ASSET_PATH+"project/";

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
    NONE:"NONE",
    UPDATE:"UPDATE",
    HIDE:"HIDE",
    SHOW:"SHOW",
    CHANGE:"CHANGE",
    DETAIL:"DETAIL",
    NORMAL:"NORMAL"
};

/**
    홈페이지 angularjs적용 하기
*/
var cpProjectApp = angular.module('cpProjectApp',[
    'ngRoute',
    'cpProjectServices',
    'cpProjectDirectives',
    'cpProjectControllers'
    ,'cpProjectAnimations'
]);



cpProjectApp.config(['$routeProvider', function( $routeProvider ){
	
	console.log("route");

	$routeProvider
	.when('/index', {
		templateUrl:'assets/data/project/blank.html',
		controller:'ProjectDetailController'
	}).
	when('/detail/:project',{
		templateUrl:'assets/data/project/project.html',
		controller:'ProjectDetailController'
	}).
	otherwise({
		redirectTo:'/index'
	});

}]);

