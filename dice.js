function Dice(){ return this; }

Dice.prototype = {
	isDice : true,
	values : {},//index is value, value is probability
	init : function( count, die ){
		this.values = {};
		var vMatrix = [];
		
		if( die === 0 ){
			this.values[ 0 ] = 1;
		} else if( count > 1 ){
			var finalDie = new Dice().init( 1, die );
			for( var i = 1; i < count; i++ ){
				var tempDie = new Dice().init( 1, die );
				finalDie.add( tempDie );
			}
			this.values = finalDie.values;
		} else {
			for( var di = 1; di <= die; di++ ){
				this.values[ di ] = 1 / die;
			}
		}
		
		return this;
	},
	math : function( _operation, _value, _reverse ){
		if( _reverse === true )
			_reverse = false;
			
		var newValue = {};
		
		if( _value.isDice === true ){
			inValue = _value.values;
			
			for( var valueV in this.values ){
				for( var inValueV in inValue ){
					switch( _operation ){
						case '*':
							var num = parseIn( valueV ) * parseInt( inValueV );
						break;
						case '/':
							if( _reverse ){
								var num = parseInt( inValueV ) / parseInt( valueV );
							} else {
								var num = parseInt( valueV ) / parseInt( inValueV );	
							}
						break;
						case '+':
							var num = parseInt( valueV ) + parseInt( inValueV );
						break;
						case '-':
							if( _reverse ){
								var num = parseInt( inValueV ) - parseInt( valueV );
							} else {
								var num = parseInt( valueV ) - parseInt( inValueV );	
							}
						break;
					}
					
					if( newValue[ num ] !== undefined ){
						newValue[ num ] += this.values[ valueV ] * inValue[ inValueV ];
					} else {
						newValue[ num ] = this.values[ valueV ] * inValue[ inValueV ];
					}
				}
			}
		} else {
			var newValue = {};
			
			for( var valueV in this.values ){
				switch( _operation ){
					case '*':
						var num = parseInt( valueV ) * parseInt( _value );
					break;
					case '/':
						if( _reverse ){
							var num = parseInt( valueV ) / parseInt( _value );
						} else {
							var num = parseInt( _value ) / parseInt( valueV );
						}
					break;
					case '+':
						var num = parseInt( valueV ) + parseInt( _value );
					break;
					case '-':
						if( _reverse ){
							var num = parseInt( valueV ) - parseInt( _value );
						} else {
							var num = parseInt( _value ) - parseInt( valueV );
						}
					break;
				}
				
				newValue[ num ] = this.values[ valueV ];
			}
		}
			
		this.values = newValue;
		
		return this;
	},
	add : function( _value ){
		return this.math( '+', _value );	
	},
	subtract : function( _value, _reverse ){
		return this.math( '-', _value, _reverse );	
	},
	multiply : function( _value ){
		return this.math( '*', _value );	
	},
	divide : function( _value, _reverse ){
		return this.math( '/', _value, _reverse );	
	},
	//takes an array of dice and merges the array into a single dice value, replacing this value. Consider this a replacement for init
	merge : function( _toMerge ){
		var multiplier = 1 / _toMerge.length;
		
		var newValues = [];
		
		if( _toMerge[0].isDice !== true )
			return this;
				
		for( var index in _toMerge[0].values ){
			newValues[ index ] = _toMerge[0].values[ index ] * multiplier;
		}
		
		for( var i = 1; i < _toMerge.length; i++ ){
			if( _toMerge[0].isDice !== true )
				return null;
			
			for( var index in _toMerge[i].values ){
				if( newValues[ index ] !== undefined ){
					newValues[ index ] += _toMerge[i].values[ index ] * multiplier;
				} else {
					newValues[ index ]  = _toMerge[i].values[ index ] * multiplier;
				}
			}
		}
		
		this.values = newValues;
		
		return this;
	},
	clone : function(){
		var out = new Dice().init( '1d0' );
		
		for( var index in this.values ){
			out.values[ index ] = this.values[ index ];
		}
		
		return out;
	}
}