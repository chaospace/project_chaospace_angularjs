var cpProjectServices = angular.module("cpProjectServices", [] );
/**
 네비게이션 정보 프로바이더
 */
cpProjectServices.factory("appModel",function (  $http, $rootScope ){


    function checkSupport3d() {
        if (!window.getComputedStyle) {
            return false;
        }

        var el = document.createElement('p'),
            has3d,
            transforms = {
                'webkitTransform':'-webkit-transform',
                'OTransform':'-o-transform',
                'msTransform':'-ms-transform',
                'MozTransform':'-moz-transform',
                'transform':'transform'
            };

        // Add it to the body to get the computed style.
        document.body.insertBefore(el, null);

        for (var t in transforms) {
            if (el.style[t] !== undefined) {
                el.style[t] = "translate3d(1px,1px,1px)";
                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }

        document.body.removeChild(el);
        return (has3d !== undefined && has3d.length > 0 && has3d !== "none");

    };


    var AppModel = function(){

        this.support3d      = checkSupport3d();
        this.projectPath    = "";
        this.naviDataPath   = "navi_category.json";
        this.isLoading      = false;
        this.projectState   = PROJECT_STATE.NONE;


        this.getTransform = function( tx, ty ){
            var transform ="";
            if(this.support3d){
                transform = "translate3d(" + tx + "px,"+ ty +"px, 0px)";
            } else {
                transform ="translate("+ tx + "px, "+ ty + "px)";
            }
            return transform;
        }


        /* path값에 따른 데이터 로드 처리 */
        this.loadData = function( path ){
            return $http.get( ASSET_PATH +path );
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
                //this.broadcasProjectPathState( newState );
                this.broadcasProjectState( PROJECT_STATE.CHANGE );
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

    var model = new AppModel();
    return model;

});

