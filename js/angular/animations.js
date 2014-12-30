var cpProjectAnimations = angular.module( 'cpProjectAnimations', ['ngAnimate', 'cpProjectServices'] );

cpProjectAnimations.animation( '.renderer-transition', function( appModel ){

	function animationStart( element, done ){
		var originTransform	=element.scope().transform;
		element.scope().setTransitionTarget(element);
		var index 			=element.scope().$parent.$index;
		if( appModel.support3d ){
			TweenMax.set(element, {x:-CONTAINER_W/1.2, y:originTransform.y, z:0});
			TweenMax.to(element, 0.5, { x:originTransform.x, y:originTransform.y, z:0, onComplete:done, ease:Expo.easeOut});
			
		} else {
			TweenMax.set(element, {x:-CONTAINER_W/1.2, y:originTransform.y});
			TweenMax.to(element, 0.5, { x:originTransform.x, y:originTransform.y, onComplete:done, ease:Expo.easeOut});
		}
		
	}

    function animationHide( element, done ){
         var originTransform	=element.scope().transform;
		if( appModel.support3d ){
			TweenMax.to(element, 0.5, {x:CONTAINER_W*1.5, y:originTransform.y, z:0, onComplete:done, ease:Expo.easeOut});
		} else {
			TweenMax.to(element, 0.5, { x:CONTAINER_W*1.2, y:originTransform.y, onComplete:done, ease:Expo.easeOut});
		}
    };

    return{
		enter:animationStart
        ,leave:animationHide
    }

});


cpProjectAnimations.animation( '.ng-view-transition', function( appModel ){
		
	function animationStart( element, done ){
		
		if( appModel.support3d ){
			TweenMax.set(element, {x:-CONTAINER_W/1.5, y:0, z:0});
			TweenMax.to(element, 0.5, {delay:.1, x:0, y:0, z:0, onComplete:done, ease:Expo.easeOut});
		} else {
			TweenMax.set(element, {x:-CONTAINER_W/1.5, y:0});
			TweenMax.to(element, 0.5, {delay:.1, x:0, y:0, onComplete:done, ease:Expo.easeOut});
		}
	}

    function animationHide( element, done ){
		if( appModel.support3d ){
			TweenMax.to(element, 0.5, {x:CONTAINER_W*1.5, y:0, z:0, onComplete:done});
		} else {
			TweenMax.to(element, 0.5, { x:CONTAINER_W*1.5, y:0, onComplete:done, ease:Expo.easeOut});
		}
    };
	return{
		enter:animationStart
        ,leave:animationHide
	}
	
});