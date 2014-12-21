var cpProjectAnimations = angular.module( 'cpProjectAnimations', ['ngAnimate'] );

cpProjectAnimations.animation( '.renderer-transition', function(){

    function getElementCurrentTransform(el) {
        var results = $(el).css('-webkit-transform').match(/matrix(?:(3d)\(\d+(?:, \d+)*(?:, (\d+))(?:, (\d+))(?:, (\d+)), \d+\)|\(\d+(?:, \d+)*(?:, (\d+))(?:, (\d+))\))/)
        if(!results) return [0, 0, 0];
        if(results[1] == '3d') return results.slice(2,5);
        results.push(0);
        return results.slice(5, 8);
    }

    function moveIn( element, done ){
        var originTransform = getElementCurrentTransform( element[0]);
        element.scope().updateTransform(-CONTAINER_W/1.2, originTransform[1] );
        console.log("moveIn");
        setTimeout( function(){
            element.scope().updateTransform( parseInt(originTransform[0]), parseInt(originTransform[1]) );
        }, 500 );
        return function(cancelled){
            if( cancelled ){
                console.log("moveIn-cancelled");
            } else {
                console.log("moveIn-done");
                done();
            }

        }

    };

    function moveOut( element, done ){
        console.log("moveOut");
        var originTransform = getElementCurrentTransform( element[0] );
        element.scope().updateTransform( 1000, parseInt(originTransform[1]) );
        return function(cancelled){
            if( cancelled ){
                console.log("moveOut-cancelled");
            } else {
                console.log("moveOut-done");
                done();
            }

        }
    };

    return{
        enter: moveIn,
        leave:moveOut
    }

});
