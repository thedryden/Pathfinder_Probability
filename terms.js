function Terms(){ return this; }

Terms.prototype = {
	isTerms : true,
	values : [],
	init : function( _string ){
		if( _string.isTerms === true ){
			var temp = _string.clone();
			this.values = temp.values;
			return this;
		}
		
		if( typeof _string !== 'string' || _string === '' ){
			values = [];
			return this;
		}
		
		var matched = _string.toLowerCase().match( regMatch );
		if( matched == null ){
			values = [];
			return this;
		}
		
		var parenthesesOpen = 0;
		var parenthesesClose = 0;
		var num = true;
		for( var i = 0; i < matched.length; i++ ){
			var aDie = matched[i].split( 'd' );
			if( aDie[0] !== matched[i] ){
				if( aDie[0] === '' )
					aDie[0] = 1;
					
				matched[i] = new Dice().init( aDie[0], aDie[1] );
			}
			
			if( matched[i] === '(' ){
				parenthesesOpen++;
			} else if( matched[i] === ')' ){
				parenthesesClose++;
			} else {
				if( ( num && matched[i].isDice !== true && !$.isNumeric( matched[i] ) )
				|| ( !num && isOperator[ matched[i] ] !== true ) ){
					return undefined
				}
				num = !num;
			}
		}
		
		if( parenthesesOpen !== parenthesesClose ){
			alert( 'The number of open parentheses does not match the number of close parentheses.' );
		}
		
		this.values = matched;
		return this;
	},
	clone : function(){
		var outTerms = new Terms();
		var out = [];
		
		for( var i = 0; i < this.values.length; i++ ){
			if( this.values[i].isDice === true ){
				out[i] = this.values[i].clone();
			} else {
				out[i] = this.values[i];
			}
		}
		outTerms.values = out;
		
		return outTerms;
	},
	concat : function( _termsIn ){
		this.values.push( '+' )	

		for( var i = 0; i < _termsIn.values.length; i++ ){
			this.values.push( _termsIn.values[i] )
		}
		
		return this;
	}
}
