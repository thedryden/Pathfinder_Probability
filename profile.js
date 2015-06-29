/*
	An array where each data point represents all the data needed to fill out the form. index 0 is always the values on the form
	"forms" : {
		"type" : "array",
		"items" : {
			"name" : { "type" : "string" },
			"bab" : { "type" : "integer" },
			"babMod" : {
				"type" : "array",
				"items" : { "type" : "integer" }
			},
			"iterative" : {
				"type" : "array",
				"items" : {
					"type" : "array",
					"items" : { "type" : "integer" }
				}
			},
			"action" : {
				"type" : "array",
				"items" : { "type" : "string", "enum" : [ "fa","sa","na" ] }
			},
			"damage" : {
				"type" : "array",
				"items" : { "type" : "array", "items" : { "type" : "string" } }
			},
			"damageRaw" : { "type" : "string" },
			"extraDamage" : {
				"type" : "array",
				"items" : { "type" : "array", "items" : { "type" : "string" } }
			},
			"extraDamageRaw" : { "type" : "string" },
			"critical" : {
				"type" : "array",
				"items" : { "type" : "integer", "enum" : [ "20","19","17","15" ] }
			},
			"multiplier" : {
				"type" : "array",
				"items" : { "type" : "integer", "enum" : [ "4","3","2" ] }
			},
			"babCrit" : {
				"type" : "array",
				"items" : { "type" : "integer" }
			},
			"critDamage" : {
				"type" : "array",
				"items" : { "type" : "array", "items" : { "type" : "string" } }
			}
			"critDamageRaw" : { "type" : "string" },
		}
	}
*/
function Profile(){ return this }

Profile.prototype = {
	forms : [],
	init : function( _params ){
		if( _params === "" )
			return this;
		
		var paramS1 = _params.split('&');
		var paramPairs = {};
	    for (var i = 0; i < paramS1.length; i++) 
	    {
	        var sParameterName = paramS1[i].split('=');
	        paramPairs[ sParameterName[0] ] = sParameterName[1]; 
	    }
	    
	    var ai = 1;
	    var ipi = 0;
	    var ips = ''
	    
	    this.forms = [];
	    
	    attackI = 1;
	    
	    profileCount = 1;
	    
		if( paramPairs[ 'b'] ) paramPairs[ 'b'] = setDelimitedNumeric( paramPairs[ 'b'] );
	    if( paramPairs[ 'h'] ) paramPairs[ 'h'] = setDelimitedNumeric( paramPairs[ 'h'] );
	    if( paramPairs[ 'ia'] ) paramPairs[ 'ia'] = paramPairs[ 'ia'].replace( regIterative, '' );
	    if( paramPairs['a'] ){
	    	var temp = paramPairs['a'].match( regAction );
	    	if( temp != null ){
	    		paramPairs['a'] = arrayToString( temp );	
	    	} else {
	    		paramPairs['a'] = 'fa';
	    	}
	    }
	    if( paramPairs[ 'd'] ) paramPairs['d'] = paramPairs[ 'd'].replace( regSanitize, '' );
	    if( paramPairs[ 'ed'] ) paramPairs['ed'] = paramPairs[ 'ed'].replace( regSanitize, '' );
	    if( paramPairs[ 'c'] ) paramPairs['c'] = setDelimitedNumeric( paramPairs[ 'c'] );
	    if( paramPairs[ 'm'] ) paramPairs['m'] = setDelimitedNumeric( paramPairs[ 'm'] );
	    if( paramPairs[ 'ch'] ) paramPairs['ch'] = setDelimitedNumeric( paramPairs[ 'ch'] );
	    if( paramPairs[ 'cd'] ) paramPairs['cd'] = paramPairs[ 'cd'].replace( regSanitize, '' );
	    if( paramPairs[ 'cr'] ){
	    	if( validCR[ paramPairs[ 'cr'] ] == undefined ){
	    		for( var index in validCR ){
	    			paramPairs[ 'cr'] = index;
	    			break;	
	    		}
	    	}
	    }
	    if( paramPairs[ 'ac'] ) paramPairs[ 'ac'] = setDelimitedNumeric( paramPairs[ 'ac'] );
	    
	    while( paramPairs[ 'n' + profileCount ] != undefined ){
	    	if( paramPairs[ 'b' + profileCount ] ) paramPairs[ 'b' + profileCount ] = setDelimitedNumeric( paramPairs[ 'b' + profileCount ] );
		    if( paramPairs[ 'h' + profileCount ] ) paramPairs[ 'h' + profileCount ] = setDelimitedNumeric( paramPairs[ 'h' + profileCount ] );
		    if( paramPairs[ 'ia' + profileCount ] ) paramPairs[ 'ia' + profileCount ] = paramPairs[ 'ia' + profileCount ].replace( regIterative, '' );
		    if( paramPairs[ 'a' + profileCount ] ){
		    	if( actionLabel[ paramPairs[ 'a' + profileCount ] ] == undefined ){
				    if( paramPairs['a'] ){
				    	var temp = paramPairs['a' + profileCount].match( regAction );
				    	if( temp != null ){
				    		paramPairs['a' + profileCount] = arrayToString( temp );	
				    	} else {
				    		paramPairs['a' + profileCount] = 'fa';
				    	}
				    }
		    	}
		    }
		    if( paramPairs[ 'd' + profileCount ] ) paramPairs[ 'd' + profileCount ] = paramPairs[ 'd' + profileCount ].replace( regSanitize, '' );
		    if( paramPairs[ 'ed' + profileCount ] ) paramPairs[ 'ed' + profileCount ] = paramPairs[ 'ed' + profileCount ].replace( regSanitize, '' );
		    if( paramPairs[ 'c' + profileCount ] ) paramPairs[ 'c' + profileCount ] = setDelimitedNumeric( paramPairs[ 'c' + profileCount ] );
		    if( paramPairs[ 'm' + profileCount ] ) paramPairs[ 'm' + profileCount ] = setDelimitedNumeric( paramPairs[ 'm' + profileCount ] );
		    if( paramPairs[ 'ch' + profileCount ] ) paramPairs[ 'ch' + profileCount ] = setDelimitedNumeric( paramPairs[ 'ch' + profileCount ] );
		    if( paramPairs[ 'cd' + profileCount ] ) paramPairs[ 'cd' + profileCount ] = paramPairs[ 'cd' + profileCount ].replace( regSanitize, '' );
		    if( paramPairs[ 'cr' + profileCount ] ){
		    	if( validCR[ paramPairs[ 'cr' + profileCount ] ] == undefined ) paramPairs[ 'cr' + profileCount ] = validCR[0];
		    }
		    if( paramPairs[ 'ac' + profileCount ] ) paramPairs[ 'ac' + profileCount ] = setDelimitedNumeric( paramPairs[ 'ac' + profileCount ] );
	    	
	    	profileCount++;
	    }
	    	
	    for( var ipi = 0; ipi < profileCount; ipi++ ){
	    	var ips = ipi;
	    	if( ipi === 0 )
	    		ips = '';
	    	
	    	var maxAttacks = 0;
	    	
	    	this.forms[ ipi ] = {};
	    	
	    	this.forms[ ipi ][ 'name' ] = decodeURIComponent( paramPairs[ 'n' + ips ] );
	    	if( this.forms[ ipi ][ 'name' ] == undefined )
	    		this.forms[ ipi ][ 'name' ] = 0;
	    	
	    	this.forms[ ipi ][ 'bab' ] = paramPairs[ 'b' + ips ];
	    	if( this.forms[ ipi ][ 'bab' ] == undefined )
	    		this.forms[ ipi ][ 'bab' ] = 0;
	    		
	    	if( typeof paramPairs[ 'h' + ips ] === 'string' ){
	    		this.forms[ ipi ][ 'babMod' ] = paramPairs[ 'h' + ips ].split(',');
	    		var maxAttacks = Math.max( maxAttacks, this.forms[ ipi ][ 'babMod' ].length );
	    	}
	    	
	    	if( typeof paramPairs[ 'ia' + ips ] === 'string' ){
	    		this.forms[ ipi ][ 'iterative' ] = paramPairs[ 'ia' + ips ].split(';');
	
	
	    		for( var i = 0; i < this.forms[ ipi ][ 'iterative' ].length; i++ ){
	    			this.forms[ ipi ][ 'iterative' ][i] = this.forms[ ipi ][ 'iterative' ][i].split(',');
	    		}
	    		var maxAttacks = Math.max( maxAttacks, this.forms[ ipi ][ 'iterative' ].length );
	    	}
	    	
	    	if( typeof paramPairs[ 'a' + ips ] === 'string' ){
	    		this.forms[ ipi ][ 'action' ] = paramPairs[ 'a' + ips ].split(',');
	    		var maxAttacks = Math.max( maxAttacks, this.forms[ ipi ][ 'action' ].length );
	    	}
	    	
	    	if( typeof paramPairs[ 'd' + ips ] === 'string' ){
	    		this.forms[ ipi ][ 'damage' ] = paramPairs[ 'd' + ips ].split(',');
	    		this.forms[ ipi ][ 'damageRaw' ] = paramPairs[ 'd' + ips ].split(',');
	    		for( var i = 0; i < this.forms[ ipi ][ 'damage' ].length; i++ ){
	    			this.forms[ ipi ][ 'damage' ][i] = new Terms().init( this.forms[ ipi ][ 'damage' ][i] );
	    			if( this.forms[ ipi ][ 'damage' ][i] == undefined ){
	    				alert('Damage value could not be parsed');
	    			}
	    		}
	    		var maxAttacks = Math.max( maxAttacks, this.forms[ ipi ][ 'damage' ].length );
	    	}
	    	
	    	if( typeof paramPairs[ 'ed' + ips ] === 'string' ){
	    		this.forms[ ipi ][ 'extraDamage' ] = paramPairs[ 'ed' + ips ].split(',');
	    		this.forms[ ipi ][ 'extraDamageRaw' ] = paramPairs[ 'ed' + ips ].split(',');
	    		for( var i = 0; i < this.forms[ ipi ][ 'extraDamage' ].length; i++ ){
	    			this.forms[ ipi ][ 'extraDamage' ][i] = new Terms().init( this.forms[ ipi ][ 'extraDamage' ][i] );
	    		}
	    		var maxAttacks = Math.max( maxAttacks, this.forms[ ipi ][ 'extraDamage' ].length );
	    	}
	    	
	    	if( typeof paramPairs[ 'c' + ips ] === 'string' ){
	    		this.forms[ ipi ][ 'critical' ] = paramPairs[ 'c' + ips ].split(',');
	    		var maxAttacks = Math.max( maxAttacks, this.forms[ ipi ][ 'critical' ].length );
	    	}
	    	
	    	if( typeof paramPairs[ 'm' + ips ] === 'string' ){
	    		this.forms[ ipi ][ 'multiplier' ] = paramPairs[ 'm' + ips ].split(',');
	    		var maxAttacks = Math.max( maxAttacks, this.forms[ ipi ][ 'multiplier' ].length );
	    	}
	    	
	    	if( typeof paramPairs[ 'ch' + ips ] === 'string' ){
	    		this.forms[ ipi ][ 'babCrit' ] = paramPairs[ 'ch' + ips ].split(',');
	    		var maxAttacks = Math.max( maxAttacks, this.forms[ ipi ][ 'babCrit' ].length );
	    	}
	    	
	    	if( typeof paramPairs[ 'cd' + ips ] === 'string' ){
	    		this.forms[ ipi ][ 'critDamage' ] = paramPairs[ 'cd' + ips ].split(',');
	    		this.forms[ ipi ][ 'critDamageRaw' ] = paramPairs[ 'cd' + ips ].split(',');
	    		for( var i = 0; i < this.forms[ ipi ][ 'critDamage' ].length; i++ ){
	    			this.forms[ ipi ][ 'critDamage' ][i] = new Terms().init( this.forms[ ipi ][ 'critDamage' ][i] );
	    		}
	    		var maxAttacks = Math.max( maxAttacks, this.forms[ ipi ][ 'critDamage' ].length );
	    	}
	    	
	    	this.forms[ ipi ][ 'cr' ] = paramPairs[ 'cr' + ips ];
	    	if( this.forms[ ipi ][ 'cr' ] == undefined )
	    		this.forms[ ipi ][ 'cr' ] = 'cr';
	    		
	    	this.forms[ ipi ][ 'ac' ] = paramPairs[ 'ac' + ips ];
	    	if( this.forms[ ipi ][ 'ac' ] == undefined )
	    		this.forms[ ipi ][ 'ac' ] = this.forms[ ipi ][ 'bab' ];
	 
	 		this.fixForms( ipi, maxAttacks );
	    }
	    
	    return this;
	},
	removeAttack : function( _profileIndex, _attack ){
		if( _attack <= 1 || _attack > forms[_profileIndex][ 'babMod' ].length )
			return;
		
		if( _profileIndex === 0 )
			_attack--;
		
		this.forms[ _profileIndex ][ 'babMod' ].splice( _attack, 1 );
		this.forms[ _profileIndex ][ 'iterative' ].splice( _attack, 1 );
		this.forms[ _profileIndex ][ 'action' ].splice( _attack, 1 );
		this.forms[ _profileIndex ][ 'damageRaw' ].splice( _attack, 1 );
		this.forms[ _profileIndex ][ 'damage' ].splice( _attack, 1 );	
		this.forms[ _profileIndex ][ 'damage' ].splice( _attack, 1 );
		this.forms[ _profileIndex ][ 'extraDamageRaw' ].splice( _attack, 1 );
		this.forms[ _profileIndex ][ 'extraDamage' ].splice( _attack, 1 );
		this.forms[ _profileIndex ][ 'extraDamage' ].splice( _attack, 1 );
		this.forms[ _profileIndex ][ 'critical' ].splice( _attack, 1 );
		this.forms[ _profileIndex ][ 'multiplier' ].splice( _attack, 1 );
		this.forms[ _profileIndex ][ 'babCrit' ].splice( _attack, 1 );
		this.forms[ _profileIndex ][ 'critDamage' ].splice( _attack, 1 );
		
		var tempAttackI = attackI - 1;
		
		attackI = 1;
		
		$('#add_form').html('');
		$('#add_dmg').html('');
		
		for( var i = 1; i < tempAttackI; i++ ){
			addAttack();
		}
		
		return this;
	},
	fixForms : function( _ipi, _maxAttacks ){
		//Fill in missing
		if( !this.forms[ _ipi ][ 'babMod' ] )
			this.forms[ _ipi ][ 'babMod' ] = [ 0 ];   	
		for( var i = this.forms[ _ipi ][ 'babMod' ].length; i < _maxAttacks; i++ ){
			this.forms[ _ipi ][ 'babMod' ][i] = 0;	
		}
		
		if( !this.forms[ _ipi ][ 'iterative' ] )
			this.forms[ _ipi ][ 'iterative' ] = [ [ this.forms[ _ipi ][ 'bab' ] ] ];
		for( var i = this.forms[ _ipi ][ 'iterative' ].length; i < _maxAttacks; i++ ){
			this.forms[ _ipi ][ 'iterative' ][i] = [ [ this.forms[ _ipi ][ 'bab' ] ] ];	
		}
		
		if( !this.forms[ _ipi ][ 'action' ] )
			this.forms[ _ipi ][ 'action' ] = [ 'fa' ];
		for( var i = this.forms[ _ipi ][ 'action' ].length; i < _maxAttacks; i++ ){
			this.forms[ _ipi ][ 'action' ][i] = 'fa';	
		}
		
		if( !this.forms[ _ipi ][ 'damage' ] )
			this.forms[ _ipi ][ 'damage' ] = [ '0' ];
		for( var i = this.forms[ _ipi ][ 'damage' ].length; i < _maxAttacks; i++ ){
			this.forms[ _ipi ][ 'damage' ][i] = '0';	
		}
		
		if( !this.forms[ _ipi ][ 'extraDamage' ] )
			this.forms[ _ipi ][ 'extraDamage' ] = [ '' ];
		for( var i = this.forms[ _ipi ][ 'extraDamage' ].length; i < _maxAttacks; i++ ){
			this.forms[ _ipi ][ 'extraDamage' ][i] = '';	
		}
		
		if( !this.forms[ _ipi ][ 'critical' ] )
			this.forms[ _ipi ][ 'critical' ] = [ 20 ];   	
		for( var i = this.forms[ _ipi ][ 'critical' ].length; i < _maxAttacks; i++ ){
			this.forms[ _ipi ][ 'critical' ][i] = 20;	
		}
		
		if( !this.forms[ _ipi ][ 'multiplier' ] )
			this.forms[ _ipi ][ 'multiplier' ] = [ 2 ];   	
		for( var i = this.forms[ _ipi ][ 'multiplier' ].length; i < _maxAttacks; i++ ){
			this.forms[ _ipi ][ 'multiplier' ][i] = 2;	
		}
		
		if( !this.forms[ _ipi ][ 'babCrit' ] )
			this.forms[ _ipi ][ 'babCrit' ] = [ 0 ];   	
		for( var i = this.forms[ _ipi ][ 'babCrit' ].length; i < _maxAttacks; i++ ){
			this.forms[ _ipi ][ 'babCrit' ][i] = 0;	
		}
		
		if( !this.forms[ _ipi ][ 'critDamage' ] )
			this.forms[ _ipi ][ 'critDamage' ] = [ '' ];
		for( var i = this.forms[ _ipi ][ 'critDamage' ].length; i < _maxAttacks; i++ ){
			this.forms[ _ipi ][ 'critDamage' ][i] = '';	
		}
		
		return this;
	},
	cloneAProfile : function( _profileIndex ){
		var output = {
			"name" : this.forms[ _profileIndex ][ 'name' ].toString(),
			"bab" : parseInt( this.forms[ _profileIndex ][ 'bab' ] ),
			"babMod" : [],
			"iterative" : [],
			"action" : [],
			"damage" : [],
			"damageRaw" : [],
			"extraDamage" : [],
			"extraDamageRaw" : [],
			"critical" : [],
			"multiplier" : [],
			"babCrit" : [],
			"critDamage" : [],
			"critDamageRaw" : [],
			"cr" : this.forms[ _profileIndex ][ 'cr' ],
			"ac" : this.forms[ _profileIndex ][ 'ac' ]
		}; 
			
			
		for( var i = 0; i < this.forms[ _profileIndex ][ 'babMod' ].length; i++ ){
			output[ "babMod" ][i] = parseInt( this.forms[ _profileIndex ][ 'babMod' ][i] );
			output[ "iterative" ][i] = this.forms[ _profileIndex ][ 'iterative' ][i].slice(0);
			output[ "action" ][i] = this.forms[ _profileIndex ][ 'action' ][i].toString();
			if( this.forms[ _profileIndex ][ 'damage' ][i].isTerms === true ){
				output[ "damage" ][i] = this.forms[ _profileIndex ][ 'damage' ][i].clone();
			} else {
				output[ "damage" ][i] = this.forms[ _profileIndex ][ 'damage' ][i];
			}
			output[ "damageRaw" ][i] = this.forms[ _profileIndex ][ 'damageRaw' ][i].toString();
			if( this.forms[ _profileIndex ][ 'extraDamage' ][i].isTerms === true ){
				output[ "extraDamage" ][i] = this.forms[ _profileIndex ][ 'extraDamage' ][i].clone();
			} else {
				output[ "extraDamage" ][i] = this.forms[ _profileIndex ][ 'extraDamage' ][i];
			}
			output[ "extraDamageRaw" ][i] = this.forms[ _profileIndex ][ 'extraDamageRaw' ][i].toString();
			output[ "critical" ][i] = parseInt( this.forms[ _profileIndex ][ 'critical' ][i] );
			output[ "multiplier" ][i] = parseInt( this.forms[ _profileIndex ][ 'multiplier' ][i] );
			output[ "babCrit" ][i] = parseInt( this.forms[ _profileIndex ][ 'babCrit' ][i] );
			if( this.forms[ _profileIndex ][ 'critDamage' ][i].isTerms === true ){
				output[ "critDamage" ][i] = this.forms[ _profileIndex ][ 'critDamage' ][i].clone();
			} else {
				output[ "critDamage" ][i] = this.forms[ _profileIndex ][ 'critDamage' ][i];
			}
			output[ "critDamageRaw" ][i] = this.forms[ _profileIndex ][ 'critDamageRaw' ][i].toString();
		}
		
		return output;
	},
	cloneToEnd : function( _profileIndex ){
		this.forms.push( this.cloneAProfile( _profileIndex ) );
	}
}