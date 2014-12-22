var cpProjectAnimation = angular.module( "cpProjectAnimation", ['ngAnimate'] );

console.log("cpProjectAnimation", cpProjectAnimation );

cpProjectAnimation.animation( ".project-item", function(){

	function getElementTransformValue( el ){
	
		var transform = window.getComputedStyle(el, null).getPropertyValue('-webkit-transform');
		var results = transform.match(/matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))\))/);

		if(!results) return [0, 0, 0];
		if(results[1] == '3d') return results.slice(2,5);

		results.push(0);
		return results.slice(5, 8); // returns the [X,Y,Z,1] values
	
	}
	
	
	
	return {
	
		enter:function( element, done ){
			var values = getElementTransformValue( element[0] );
			angular.element( element ).scope().transform = 'translate3d(-400px,' + values[1] +'px, 0px)';
			//angular.element( element ).scope().$apply();
			console.log("enter");
			angular.element( element ).scope().transform = 'translate3d('+ values[0] + 'px,' + values[1] +'px, 0px)';
		},
		
		leave:function( element, done ){
			var values = getElementTransformValue( element[0] );
			angular.element( element ).scope().transform = 'translate3d('+ values[0] + 'px,' + values[1] +'px, 0px)';
			//angular.element( element ).scope().$apply();
			console.log("start");
		}
	
	}



});
/*
cpProjectAnimation.animation( "moveOut", function(){

	function getElementTransformValue( el ){
	
		var transform = window.getComputedStyle(el, null).getPropertyValue('-webkit-transform');
		var results = transform.match(/matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))\))/);

		if(!results) return [0, 0, 0];
		if(results[1] == '3d') return results.slice(2,5);

		results.push(0);
		return results.slice(5, 8); // returns the [X,Y,Z,1] values
	
	}
	
	
	
	return {

		start:function( element, done ){
			
			console.log("out-start");
		}
	
	}



});
*/