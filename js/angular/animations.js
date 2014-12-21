var cpProjectAnimations = angular.module( 'cpProjectAnimations', ['ngAnimate'] );

cpProjectAnimations.animation( '.project-repeat', function(){

    function getElementCurrentTransform(el) {
        var results = $(el).css('-webkit-transform').match(/matrix(?:(3d)\(\d+(?:, \d+)*(?:, (\d+))(?:, (\d+))(?:, (\d+)), \d+\)|\(\d+(?:, \d+)*(?:, (\d+))(?:, (\d+))\))/)
        if(!results) return [0, 0, 0];
        if(results[1] == '3d') return results.slice(2,5);
        results.push(0);
        return results.slice(5, 8);
    }


    return{
        enter:function( element, done ){

            var originTransform = getElementCurrentTransform( element[0]);
            element.scope().updateTransform( -500, originTransform[1] );
            setTimeout( function(){
                element.scope().updateTransform( originTransform[0], originTransform[1] );
            }, 100 );

        },

        leave:function( element, done){
             console.log("leave");
            var originTransform = getElementCurrentTransform( element[0]);
            setTimeout( function(){
                element.scope().updateTransform( 1500, originTransform[1] );
            }, 100 );
        }

    }

});
