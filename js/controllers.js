var cpProjectAppControllers	= angular.module("cpProjectAppControllers", ['cpProjectAppServices'] );



cpProjectAppControllers.controller( "NavigationController",function( $scope, appModel  ){

    $scope.onClick_MenuItem =function( $event, data ){
        $event.preventDefault();
        appModel.updateProjectPathState( data );
    };
	
	appModel.updateLoadState( true );	
	appModel.loadData(appModel.naviDataPath).success( function(data){
		$scope.naviList = data.navigation;
		appModel.updateLoadState( false );
		appModel.updateProjectPathState( $scope.naviList[0].data );
	}).error(function( error, code ){
		alert( error );
	});
	

});



cpProjectAppControllers.controller( "ProjectDetailController", function( $scope, $routeParams ){
	//$scope.closeDetail
	$scope.renderComplete = false;
	console.log("$routeParams", $routeParams);
	$scope.$on("$routeChangeSuccess", function (scope, next, current) {
        console.log("succeess-chnage");
		//$scope.renderComplete = true;
    });
});



// loading-progress-controller
cpProjectAppControllers.controller( "ProgressViewController", function( $scope, appModel ){
    
	console.log("progress", appModel );
    $scope.loading = appModel.isLoading;
    appModel.onUpdateLoadState( $scope, function( newState ){
        $scope.loading = newState;
    });
	
});