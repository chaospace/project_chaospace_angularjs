var cpProjectControllers =angular.module('cpProjectControllers', ['cpProjectServices']);

cpProjectControllers.controller( "NavigationController",function( $scope, appModel  ){

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


cpProjectControllers.controller( "ProjectDetailController", function( $scope, $routeParams ){
    console.log("$routeParams", $routeParams);
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