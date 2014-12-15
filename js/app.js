
/**
    홈페이지 angularjs적용 하기
*/
var app = angular.module('cpProjectApp', []);

var REQUEST_PROEJCT_LIST_INITIALIZE ="REQUEST_PROEJCT_LIST_INITIALIZE";
var PROJECT_PATH_CHANGE             ="PROJECT_PATH_CHANGE";
var PROJECT_STATE_CHANGE            ="PROJECT_STATE_CHANGE";
var APP_LOADING_CHANGE              ="APP_LOADING_CHANGE";

var PROJECT_STATE = {
    NONE:"NONE",
    UPDATE:"UPDATE",
    HIDE:"HIDE",
    SHOW:"SHOW",
    CHANGE:"CHANGE"
};

app.constant( "config", {
    prefix:"."
});

/**
    네비게이션 정보 프로바이더
 */
app.factory("appModel",function ( config, $http, $rootScope ){



    var AppModel = function(){

        this.projectPath    = "";
        this.naviDataPath   = "/assets/data/navi_category.json";
        this.isLoading      = false;
        this.projectState   = PROJECT_STATE.NONE;


        /* path값에 따른 데이터 로드 처리 */
        this.loadData = function( path ){
            return $http.get( config.prefix +path );
        };


        /* isLoading속성 업데이트 처리 */
        this.updateLoadState = function( newState ){
            if(this.isLoading != newState ){
                this.isLoading = newState;
                this.broadcastLoadState( newState );
            }
        };

        this.onUpdateLoadState = function( $scope, callback ){
            $scope.$on( APP_LOADING_CHANGE , function(event, data ){
               callback( data );
            });
        };

        this.broadcastLoadState =function( newState ){
            $rootScope.$broadcast( APP_LOADING_CHANGE, newState );
        };


        /* projectPath속성 업데이트 처리 */
        this.updateProjectPathState = function( newState ) {
            if(this.projectPath != newState ){
                this.projectPath = newState;
                this.broadcasProjectPathState( newState );
            }
        };

        this.onUpdateProjectPathState = function( $scope, callback ){
            $scope.$on( PROJECT_PATH_CHANGE, function(event, data ){
                callback( data );
            });
        };

        this.broadcasProjectPathState =function( newState ){
            $rootScope.$broadcast( PROJECT_PATH_CHANGE, newState );
        };


        /* projectState 속성 업데이트 처리 */
        this.updateProjectState = function( newState ) {
            if(this.projectState != newState ){
                this.projectState = newState;
                this.broadcasProjectState( newState );
            }
        };

        this.onUpdateProjectState = function( $scope, callback ){
            $scope.$on( PROJECT_STATE_CHANGE, function(event, data ){
                callback( data );
            });
        };

        this.broadcasProjectState =function( newState ){
            $rootScope.$broadcast( PROJECT_STATE_CHANGE, newState );
        };

    };

    return new AppModel();

 });


app.controller( "NavigationController",function( $scope, appModel  ){


    $scope.onClick_MenuItem =function( $event, data ){
        $event.preventDefault();
        appModel.updateProjectPathState( data );
    };

    appModel.updateLoadState( true );
    function initControl(){
        appModel.loadData(appModel.naviDataPath).success( function(data){
            $scope.naviList = data.navigation;
            appModel.updateLoadState( false );
        }).error(function( error, code ){
            alert( error );
        });
    };

    setTimeout( initControl,500 );

});


// proejct-list-controller;
app.controller( "ProjectListController",function( $element, $scope, appModel  ){

    $scope.initialize =false;
    function updateRendererLayout(){
        angular.forEach( $element.children(), function( renderer ){
            console.log(jQuery(renderer).width());
        });
    };

    $scope.$on( REQUEST_PROEJCT_LIST_INITIALIZE, function(){
        console.log( "list", $element.children() );
        updateRendererLayout();
    });

    // projectPath상태 변경 감시
    appModel.onUpdateProjectPathState( $scope, function( newState ){
        loadProjectList();
    });

    // projectState상태 변경 감시
    appModel.onUpdateProjectState( $scope, function( newState ){
        switch( newState ){

            case PROJECT_STATE.SHOW:
                console.log("등장");
                $scope.initialize = true;
                break;

            case PROJECT_STATE.HIDE:
                console.log("퇴장");
                break;

            case PROJECT_STATE.UPDATE:
                console.log("resize-update");
                break;

        }

    });

    function loadProjectList(){
        appModel.updateLoadState( true );
        appModel.loadData( appModel.projectPath)
            .success( function(data ){
                console.log("Data", data );
                appModel.updateLoadState( false );
                $scope.projects = data.project;
            })
            .error( function( error, code ){
                appModel.updateLoadState( false );
            });
    };




});

app.directive( 'projectRenderer', function( $http, $templateCache, $compile , $timeout ){
    return {
        restrict: "E",
        scope:true,
        replace:true,
        link:function( scope, iElement, iAttrs ){

            iAttrs.$observe( "value", function(newVal){
               console.log( "observe", newVal );
            });

            $http.get( "./assets/data/partisal/"+ scope.project.template , {cache: $templateCache})
                .success(
                    function(tplContent){
                        iElement.replaceWith( $compile(tplContent)( scope ) );
                        if( scope.$last ) {
                            // 컨트롤러 함수 요청
                            $timeout( function(){
                                scope.$emit(REQUEST_PROEJCT_LIST_INITIALIZE);
                            });
                        }
                });

        },
        controller: function( $scope, $element ){
            $scope.project.transform = {x:0, y:0, z:0};
        }

     }
});

app.directive( 'slideAnimation', function(){
    return({
        link: function( scope, iElement, iAttrs ){
            // I am the TRUTHY expression to watch.
            var expression = iAttrs.slideAnimation;
            // I am the optional slide duration.
            var duration = ( iAttrs.duration || "fast" );

        },
        restrict: "A"
    });
});


// loading-progress-controller
app.controller( "ProgressViewController", function( $scope, appModel ){
    $scope.loading = appModel.isLoading;
    appModel.onUpdateLoadState( $scope, function( newState ){
        $scope.loading = newState;
    });
});

