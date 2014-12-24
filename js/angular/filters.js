var cpProjectFilters= angular.module('cpProjectFilters', []);

cpProjectFilters.filter( 'categoryFilter', function(){
	
	return function( source, searchCate ){
		
		var results =[];
		var vo;
		for( var i=0; i<source.length; i++ ){
			vo = source[i];
			if( vo.category == searchCate ) {
				results.push(vo);
			}
		}
		return results;
	}
	
});