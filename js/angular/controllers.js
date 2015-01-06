var cpProjectControllers =angular.module('cpProjectControllers', ['cpProjectServices']);

cpProjectControllers.controller( "NavigationController",function( $scope, appModel  ){

    $scope.onClick_MenuItem =function( $event, data ){
		//console.log("data", data );
	    appModel.updateProjectCategoryState( data );
    };
	
	$scope.goHome	=function(){
		location.href = "#main";
	}

    appModel.updateLoadState( true );
    appModel.loadData(appModel.naviDataPath).success( function(data){
        $scope.naviList = data.navigation;
        appModel.updateLoadState( false );
        //appModel.updateProjectCategoryState( $scope.naviList[0].data );
    }).error(function( error, code ){
        alert( error );
    });

});

cpProjectControllers.controller( "ProjectDetailController", function( $scope, $sce, $routeParams, Project ){
    
	if( $routeParams.projectId != null ){
		Project.get({projectId:$routeParams.projectId}, function( project ){
			//console.log("detail", project );
			$scope.project = project;
		});
	}
	
	$scope.trustDangerousSnippet = function( info ){
		//console.log("info", info );
		return $sce.trustAsHtml(info);
	};	
    
	$scope.$on("$routeChangeSuccess", function (scope, next, current) {
        console.log("succeess-chnage");
    });
	
});

// loading-progress-controller
cpProjectControllers.controller( "ProgressViewController", function( $scope, appModel ){
    $scope.loading = appModel.isLoading;
    appModel.onUpdateLoadState( $scope, function( newState ){
        $scope.loading = newState;
    });
});