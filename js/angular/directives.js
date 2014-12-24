var cpProjectDirectives = angular.module('cpProjectDirectives', [ 'cpProjectServices']);

cpProjectDirectives.directive( "imageloaded", function(){
    return {
        restrict:"A",
        link: function( scope, iElement, iAttrs ){
            iElement.bind('load', function(){
                scope.$apply( iAttrs.imageloaded );
            });
        }
    }
});



cpProjectDirectives.directive( "projectList", function(){

    return{
        replace:true,
        restrict:'EA',
        template:'<div id="project-container"></div>',
        transclude:true,
        
        controller:function( $element, $scope, $q, $timeout, appModel, Project  ){

            $scope.projects =[];
		   $scope.category ="";
            $scope.updateDisplay =function(){
			$timeout( function(){
				updateRendererLayout();
			});
            };

            $scope.getPosition =function( index ){
                console.log("내 위치는", index );
            };

            $scope.popItem = function(){
                $scope.projects.pop();
                console.log("remove" , $scope.projects.length );
            };


            /**
             ▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨
             promise init
             ▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨
             */
            var DELAY_TIME	=0;
            function getDeffered(){
                return $q.defer();
            }

            function promiseSuccess( deferred, results ){
                console.log("promiseSuccess", results );
                deferred.resolve( results );
            }

            function promiseReject( deferred, results ){
                deferred.reject( results );
            }

            function updatePromiseDelayTime( appendValue ){
                DELAY_TIME+=isNaN(appendValue) ? 0 : appendValue;
            }
            function initializeDeferred(){
                DELAY_TIME	=0;
            }


            function appendPromise( message, delay ){
                setTimeout( function(){
                    promiseSuccess(message);
                }, delay );
                return deferred.promise;
            }


            function updateRendererLayout(){

                //promise를 위한 deffer참조
                var defaultX =(CONTAINER_W == MOBILE_W) ? 30 : 0;
                var px       =defaultX;
                var py       =0;
                var info;
                var delays = getDelays();

                angular.forEach( _childCtrl, function( ctrl , index ){

                    info = ctrl.getRendererSize( CONTAINER_W );
                    ctrl.updatePosition( px, py );
                    px+=(info.w+RENDERER_GAP);

                    if( px >= CONTAINER_W ) {
                        px = defaultX;
                        py += (info.h+RENDERER_GAP);
                    }

                });

			if( px != defaultX ) {
				py+=(info.h+RENDERER_GAP);
			}
			$element.css("height", py+"px");
            }

            function getDelays(){
                var delays=[];
                var delay = 100;
                for( var i=0; i<_childCtrl.length; i++ ){
                    delays.push( delay+(i*delay) );
                }
                delays = delays.reverse();
                return delays;
            }

            // 리스트 사라지게 하기
            function clearProjectRenderer(){
                var deferred	=getDeffered();
                var delays = getDelays();
                updatePromiseDelayTime( delays[0]+(60*delays.length) );
                //$scope.projects= [];
			  removeProejctItem();
                setTimeout(function(){
                    promiseSuccess( deferred, "clearProjectRenderer-complete");
                },  DELAY_TIME );

                return deferred.promise;


            }

            function initializeProjectList(){

                var deferred	=getDeffered();
                updatePromiseDelayTime( 10 );
                console.log("initializeProjectList-DELAY_TIME", DELAY_TIME );
                setTimeout( function(){
                    _childCtrl      =[];
                    promiseSuccess( deferred, "initializeProjectList-complete");
                }, DELAY_TIME );

                return deferred.promise;
            }


            var ctrl = this;
            var _childCtrl  =[];
            ctrl.registerChildController = function( childCtrl ){
                _childCtrl.push(childCtrl);
            }

            /**
                렌더러 생성완료 휴 초기 레이아웃 요청 처리
             */
            $scope.$on( REQUEST_PROJECT_LIST_INITIALIZE, function(){

                console.log("REQUEST_PROJECT_LIST_INITIALIZE");
                $scope.initializeWindowSize();
                updateRendererLayout();
                setStateNormal();

            });

     

            // projectState상태 변경 감시
            appModel.onUpdateProjectState( $scope, function( newState ){
				
                switch( newState ){
                    case PROJECT_STATE.CHANGE:
					 
					  appModel.updateLoadState( true );	
                        initializeDeferred();
                        clearProjectRenderer()
                            .then( initializeProjectList() )
                            .then( loadProjectList() );
						
                        break;

                    case PROJECT_STATE.NORMAL:
                        console.log("노멀상태", appModel.projectPath);
					 appModel.updateLoadState( false );
					 
                        break;

                    case PROJECT_STATE.DETAIL:
                        console.log("DETAIL-상태");
                        break;

                    case PROJECT_STATE.NONE:
                        console.log("NONE");
                        break;
                }

            });

			
			function setStateNormal(){
				appModel.updateProjectState(PROJECT_STATE.NORMAL);
			}
			
			function appendProejctItem( projects ){
				for( var i=0; i<projects.length; i++ ){
					$timeout( function(){
						$scope.projects.push( projects.shift() );
					}, 100 * i );
				}
			}
			
			function removeProejctItem(){
				
				for( var i=0; i<$scope.projects.length; i++ ){
					$timeout( function(){
						$scope.projects.pop();
					}, 100 * i );
				}
			}
			

			function loadProjectList(){
				//$scope.category = appModel.projectPath;
				var deferred = getDeffered();
				updatePromiseDelayTime(10);
				setTimeout( function(){
						
					Project.query().$promise.then( function( data ){
						console.log("data", data );
						appendProejctItem( data );	
						promiseSuccess( deferred, "loadProjectList-complete");
					});
					
				}, DELAY_TIME );
				
				return deferred.promise;
			};


         }
    }


});

cpProjectDirectives.directive( "resizeable", function($window){
		
	return {
		
		
		link:function( scope, iElement, iAttrs ){
			
			function checkUpdateDisplayMode(){
			
				var w = scope.windowWidth;
				
				var listArea	=-1;
				if( w > WIDE_W ){
					listArea= WIDE_W;
				} else if( w > DESKTOP_W && w < WIDE_W ){
					listArea= DESKTOP_W;
				} else if( w > TABLET_W && w < DESKTOP_W ) {
					listArea= TABLET_W;
				} else {
					listArea= MOBILE_W;
				}
				if( listArea != CONTAINER_W ){
					CONTAINER_W =listArea;
					LIST_UNIT=parseInt(CONTAINER_W/RENDERER_W);
					return true;
				}
				return false;
			}
			
			
			scope.initializeWindowSize = function(){
				scope.windowWidth = $window.innerWidth;
				scope.windowHeight = $window.innerHeight;
				if( checkUpdateDisplayMode()){
					scope.updateDisplay();
				}
			}

			scope.initializeWindowSize();
		   
			var t;
			angular.element($window).bind( "resize", function(){			 
				clearTimeout(t);
				t = setTimeout(function(){
					scope.initializeWindowSize();
				}, 200);
			});
		
			
		}
	
	}

});


cpProjectDirectives.directive( "projectRenderer", function( $compile, $http, $templateCache, $timeout ){

    return {
        restrict:"E",
        replace:true,
        require:['^projectList', 'projectRenderer'],

        template:'<div ng-include="getTemplateUrl()"></div>',

        link:function( scope, iElement, iAttr, controllers ){

            var projectListCtrl = controllers[0];
            var rendererCtrl    = controllers[1];
            projectListCtrl.registerChildController( rendererCtrl );
            /**
             ▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨
             마지막 리스트 일 경우 부모에 레이아웃 요청
             ▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨
             */
            if(scope.$last){
				scope.$emit(REQUEST_PROJECT_LIST_INITIALIZE);
            }

            
        },

        controller:function( $scope, $sce, appModel , $timeout ){

			var _rendererCtrl = this;
			$scope.transform	= {x:0,y:0, z:0};
            
			$scope.trustDangerousSnippet = function( info ){
				return $sce.trustAsHtml(info);
			};

			$scope.getResponseImageSrc = function(){
				var path = "";
				if( window.innerWidth > WIDE_W ){
					path = $scope.project.image.bigsrc;
				} else {
					path = $scope.project.image.src;
				}
				return path;
			};

			$scope.getTemplateUrl	=function(){
				return PARTISAL_PATH + $scope.project.template;
			};
			
			$scope.setTransitionTarget =function( element ){
				if(target != element){
					target = element;
				}
			};
/**
             ▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨
             destory
             ▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨
			*/
			$scope.$on('$destroy', function(){
				_rendererCtrl = null;
				target = null;
			}); 
            /**
             ▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨
             현재 window영역에 따른 renderersize 반환 메서드
             ▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨
             */
            _rendererCtrl.getRendererSize = function( screenWidth ){
                var info = {w:RENDERER_W, h:RENDERER_H};
                if($scope.project.type == "main" ){
					if( $scope.$last ){
						info	= ( screenWidth == WIDE_W ) ? {w:(RENDERER_W*2)+RENDERER_GAP, h:(RENDERER_H*2)+RENDERER_GAP} : info;
					} else {
						info	= ( screenWidth == WIDE_W ) ? {w:(RENDERER_W*2)+RENDERER_GAP, h:RENDERER_H} : info;
					}
                }
                return info;
            }

            /**
             ▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨
				리사이즈 처리 및 등장/퇴장 트렌지션 처리
				모바일 환경에서 orientation-change시 
				transition을 사용하면 
				화면 사이즈 갱신에 문제가 있어 set으로 설정
             ▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨▨
             */
			var target	=null;
            _rendererCtrl.updatePosition =function( px, py ) {
				$scope.transform.x = px;
				$scope.transform.y = py;
				
				if(target){
				
					if(appModel.mobilecheck()){
						TweenMax.set(target, {x:px, y:py, z:0});
					} else {
						TweenMax.to(target, .3, {x:px, y:py, z:0});
					}
				}
				
            };

        }

    }

});