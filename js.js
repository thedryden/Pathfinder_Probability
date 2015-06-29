
var isOperator = {
	"(" : true,
	")" : true,
	"+" : true,
	"-" : true,
	"*" : true,
	"/" : true
}

var regMatch = /\d*d\d+|-?\d+|\*|\/|\+|\-|\(|\)/g;
var regSanitize = /[^\d*\/+-d]*/g
var regIterative = /[^\d,;]*/g
var regDelimitedNumeric = /[^\d,]*/g;
var regAction = /[[fsn]a,?]*/g;

var crac = {
    "1": 12,
    "2": 14,
    "3": 15,
    "4": 17,
    "5": 18,
    "6": 19,
    "7": 20,
    "8": 21,
    "9": 23,
    "10": 24,
    "11": 25,
    "12": 27,
    "13": 28,
    "14": 29,
    "15": 30,
    "16": 31,
    "17": 32,
    "18": 33,
    "19": 34,
    "20": 36
};

var actionLabel = {
	"fa" : "Full Attack",
	"sa" : "Standard Action",
	"na" : "Natural Attacks (Full)"
}

var validCR ={ 'cr': true, 'ac': true };

var attackI = 1;

var profile = {};
var charts = {};

function addAttack(){
	attackI++;
	
	var preAction = $('#txt_action_' + ( attackI - 1 ) ).val();
	
	var form = '<h4>Attack '+ attackI + '</h4>';
	form += '<span onclick="removeAttack( 0, ' + attackI + ' );setFormWithForms();createLink();calc();" class="button"><img src="delete.png" /> Remove Attack</span>'; 
	form += '<p><label for="txt_bab_mod_' + attackI + '">To Hit Modifiers:<br /><span class="details">(Str, Magic Weapons, etc.)</span></label>'
	form += '<input name="txt_bab_mod_' + attackI + '" id="txt_bab_mod_' + attackI + '" type="text" value="' + $('#txt_bab_mod_' + ( attackI - 1 ) ).val() + '" onblur="setNumeric( this );" onchange="processForm( createLink );" /></p>'
	form += '<p><label for="txt_iterative_' + attackI + '">Iterative Attacks:</label>'
	form += '<input name="txt_iterative_' + attackI + '" id="txt_iterative_' + attackI + '" class="wide" type="text" value="' + $('#txt_iterative_1').val() + '" onblur="sanitizeIterative( this );" onchange="processForm( createLink );" /></p>'
	form += '<p><label for="txt_action_' + attackI + '">Action:</label>';
	form += '<select name="txt_action_' + attackI + '" id="txt_action_' + attackI + '" onchange="setIterative();processForm( createLink );">';
	if( preAction === 'fa' ){
		form += '<option value="fa" selected="true">Full Attack</option>';	
	} else {
		form += '<option value="fa">Full Attack</option>';
	}
	if( preAction === 'sa' ){
		form += '<option value="sa" selected="true">Standard Action</option>';
	} else {
		form += '<option value="sa">Standard Action</option>';
	}
	if( preAction === 'na' ){
		form += '<option value="na" selected="true">Natural Attacks (Full)</option>';	
	} else {
		form += '<option value="na">Natural Attacks (Full)</option>';
	}
	form += '</select></p>'
	form += '<p><label class="wide" for="dmg_' + attackI + '">Damage <span class="details">(Multipled by Criticals)</span>:</label><br />'
	form += '<input name="dmg_' + attackI + '" id="dmg_' + attackI + '" type="text" class="dice" value="" onchange="processForm( createLink );" /></p>'
	form += '<p><label class="wide" for="extra_dmg_' + attackI + '">Extra Damage <span class="details">(Not Multipled by Criticals)</span>:</label><br />'
	form += '<input name="extra_dmg_' + attackI + '" id="extra_dmg_' + attackI + '" type="text" class="dice" value="" onchange="processForm( createLink );" /></p>'
	form += '<p><label for="txt_crit_' + attackI + '">Criticals:</label>'
	form += '<select name="txt_crit_' + attackI + '" id="txt_crit_' + attackI + '" onchange="processForm( createLink );"><option value="20">20</option><option value="19">19-20</option><option value="18">18-20</option><option value="17">17-20</option><option value="15">15-20</option></select>'
	form += '/ <select name="txt_multiplier_' + attackI + '" id="txt_multiplier_' + attackI + '" onchange="processForm( createLink );"><option value="2">x2</option><option value="3">x3</option><option value="4">x4</option><option value="5">x5</option></select></p>'
	form += '<p><label for="txt_bab_crit_' + attackI + '">To Crit Modifiers:<br /><span class="details">(To Confrim Crit Only)</span></label>';
	form += '<input name="txt_bab_crit_' + attackI + '" id="txt_bab_crit_' + attackI + '" type="text" onblur="setNumeric( this );" onchange="processForm( createLink );" /></p>';
	form += '<p><label class="wide" for="crit_dmg_' + attackI + '">On Crit Only Damage <span class="details">(i.e. <a href="http://paizo.com/pathfinderRPG/prd/magicItems/weapons.html#thundering">Thundering</a>)</span>:</label><br />';
	form += '<input name="crit_dmg_' + attackI + '" id="crit_dmg_' + attackI + '" type="text" class="dice" onblur="processForm( createLink );" onchange="processForm( createLink );" /></p>';
	
	$('#add_form').append( form );
	
	var chart = '<div name="ct_dmg_1_' + attackI + '" id="ct_dmg_1_' + attackI + '" style="display: inline-block;"></div>';
	chart += '<span name="tbl_dmg_1_' + attackI + '" id="tbl_dmg_1_' + attackI + '"></span><br />';
	
	$('#add_charts_1').append( chart );
	
	syncHeight();
}

function removeAttack( _profileIndex, _attackI ){
	var attackIndex = _attackI - 1;
	
	profile.forms[ _profileIndex ][ 'babMod' ].splice( attackIndex, 1 );
	profile.forms[ _profileIndex ][ 'iterative' ].splice( attackIndex, 1 );
	profile.forms[ _profileIndex ][ 'action' ].splice( attackIndex, 1 );
	profile.forms[ _profileIndex ][ 'damageRaw' ].splice( attackIndex, 1 );
	profile.forms[ _profileIndex ][ 'damage' ].splice( attackIndex, 1 );	
	profile.forms[ _profileIndex ][ 'damage' ].splice( attackIndex, 1 );
	profile.forms[ _profileIndex ][ 'extraDamageRaw' ].splice( attackIndex, 1 );
	profile.forms[ _profileIndex ][ 'extraDamage' ].splice( attackIndex, 1 );
	profile.forms[ _profileIndex ][ 'extraDamage' ].splice( attackIndex, 1 );
	profile.forms[ _profileIndex ][ 'critical' ].splice( attackIndex, 1 );
	profile.forms[ _profileIndex ][ 'multiplier' ].splice( attackIndex, 1 );
	profile.forms[ _profileIndex ][ 'babCrit' ].splice( attackIndex, 1 );
	profile.forms[ _profileIndex ][ 'critDamageRaw' ].splice( attackIndex, 1 );
	profile.forms[ _profileIndex ][ 'critDamage' ].splice( attackIndex, 1 );	
	profile.forms[ _profileIndex ][ 'critDamage' ].splice( attackIndex, 1 );
	
	var finalAttackI = attackI - 1;
	
	$('#add_form').html('');
	$('#add_charts_' +  ( _profileIndex + 1 ) ).html('');
	
	attackI = 0;
	for( var i = 0; i < finalAttackI; i++ ){
		if(  _profileIndex === 0 ){
			addAttack();	
		} else {
			var tempChart = '<div name="ct_dmg_' + ( _profileIndex + 1 ) + '_' + ( attackIndex + 1 ) + '" id="ct_dmg_' + ( _profileIndex + 1 ) + '_' + ( attackIndex + 1 ) + '" style="display: inline-block;"></div>';
			tempChart += '<span name="tbl_dmg_' + ( _profileIndex + 1 ) + '_' + ( attackIndex + 1 ) + '" id="tbl_dmg_' + ( _profileIndex + 1 ) + '_' + ( attackIndex + 1 ) + '"></span>';
			
			$('#add_charts' + _profileIndex ).append( tempChart );	
		}
	}
	
	setTimeout( syncHeight, 10 );
}

function toggleContent(){
	$('#hide_button').toggle();
	$('#show_button').toggle();
	$('#contents').toggle();
	$('#add_profile_p').toggle();
}

function addProfile(){
	profile.cloneToEnd( 0 );
	displayProfile( profile.forms.length - 1 );
	calc();
}

function displayProfile( _profileID ){
	if( _profileID === 0 ){
		setFormWithForms();		
	} else {
		var newProfileIndex = _profileID;
		var newProfileID = newProfileIndex + 1;
		
		var profileForm = '<div name="profile_' + newProfileID + '" id="profile_' + newProfileID + '" class="profile">';
		profileForm += '<div name="profile_height_' + newProfileID + '" id="profile_height_' + newProfileID + '">';
		profileForm += '<span onclick="editProfile( ' + newProfileIndex + ' );" class="button"><img src="cog_edit.png" /> Edit Profile</span><span onclick="deleteProfile( ' + newProfileIndex + ' );" class="button"><img src="delete.png" /> Delete Profile</span><br /><br />' 
		profileForm += '<strong>Attacker Profile</strong><br />';
		profileForm += '<p><label>Name / Label:</label>' + htmlEncode( profile.forms[ newProfileIndex ]['name'] ) + '</p>';
		profileForm += '<p><label>BAB:</label>' + htmlEncode( profile.forms[ newProfileIndex ]['bab'] ) + '</p>';
		for(  var i = 0; i < profile.forms[ newProfileIndex ]['babMod'].length; i++ ){
			if( i > 0 )
				profileForm += '<h4>Attack ' + ( i + 1 ) + '</h4>';
			profileForm += '<p><label>To Hit Modifiers:<br /><span class="details">(Str, Magic Weapons, etc.)</span></label>' + htmlEncode( profile.forms[ newProfileIndex ]['babMod'][i] ) + '</p>';	
			profileForm += '<p><label >Iterative Attacks:</label>' + htmlEncode( profile.forms[ newProfileIndex ]['iterative'][i].toString() ) + '</p>';
			profileForm += '<p><label>Action:</label>' + actionLabel[ profile.forms[ newProfileIndex ]['action'][i] ] + '</p>';
			profileForm += '<p><label class="wide">Damage <span class="details">(Multipled by Criticals)</span>:</label><br />' + htmlEncode( profile.forms[ newProfileIndex ]['damageRaw'][i] ) + '</p>';
			profileForm += '<p><label class="wide">Extra Damage <span class="details">(Not Multipled by Criticals)</span>:</label><br />' + htmlEncode( profile.forms[ newProfileIndex ]['extraDamageRaw'][i] ) + '</p>';
			profileForm += '<p><label>Criticals:</label>' + htmlEncode( profile.forms[ newProfileIndex ]['critical'][i] );
			profileForm += '/ ' + htmlEncode( profile.forms[ newProfileIndex ]['multiplier'][i] ) + '</p>';
			profileForm += '<p><label>To Crit Modifiers:<br /><span class="details">(To Confrim Crit Only)</span></label>' + htmlEncode( profile.forms[ newProfileIndex ]['critDamageRaw'][i] ) + '</p>';
			profileForm += '<p><label class="wide">On Crit Only Damage <span class="details">(i.e. <a href="http://paizo.com/pathfinderRPG/prd/magicItems/weapons.html#thundering">Thundering</a>)</span>:</label><br />' + htmlEncode( profile.forms[ newProfileIndex ]['critDamageRaw'][i] ) + '</p>';
		}
		profileForm += '<strong>Enemy CR/AC</strong><br />';
		profileForm += '<p>' + htmlEncode( profile.forms[ newProfileIndex ]['cr'].toUpperCase() ) + ': ' + htmlEncode( profile.forms[ newProfileIndex ]['ac'] );
		if( profile.forms[ newProfileIndex ]['cr'] === 'cr' ){
			profileForm += ' ( AC: ' + crac[ profile.forms[ newProfileIndex ]['ac'] ] + ' )';
		}
		profileForm += '</p></div></div>';
		
		$('#contents').append( profileForm );
		
		var profileChart = '<div name="profile_chart_' + newProfileID + '" id="profile_chart_' + newProfileID + '" class="profile">'; 
		profileChart += '<div name="output_' + newProfileID + '" id="output_' + newProfileID + '"></div>';
		profileChart += '<div name="ct_dmg_' + newProfileID + '_1" id="ct_dmg_' + newProfileID + '_1" style="display: inline-block;"></div>';
		profileChart += '<span name="tbl_dmg_' + newProfileID + '_1" id="tbl_dmg_' + newProfileID + '_1"></span><br />';
		profileChart += '<span name="add_dmg" id="add_dmg">';
		for( var i = 1; i < profile.forms[ newProfileIndex ]['babMod'].length; i++ ){
			profileChart += '<div name="ct_dmg_' + newProfileID + '_' + ( i + 1 ) + '" id="ct_dmg_' + newProfileID + '_' + ( i + 1 ) + '" style="display: inline-block;"></div>'
			profileChart += '<span name="tbl_dmg_' + newProfileID + '_' + ( i + 1 ) + '" id="tbl_dmg_' + newProfileID + '_' + ( i + 1 ) + '"></span><br />';
		}
		profileChart += '</span>';
		profileChart += '<div name="ct_final_' + newProfileID + '" id="ct_final_' + newProfileID + '" style="display: inline-block;"></div>';
		profileChart += '<span name="tbl_final_' + newProfileID + '" id="tbl_final_' + newProfileID + '"></span>';
		profileChart += '</div>';
		
		$('#charts').append( profileChart );
		
		syncHeight();
	}
}

function deleteProfile( _profileIndex ){
	var profileID = _profileIndex + 1;
	profile.forms.splice( _profileIndex, 1 );
	
	$('#profile_' + profileID ).remove();
	$('#profile_chart_' + profileID ).remove();
	
	delete charts[ 'ct_dmg_' + profileID + '_1' ]
	delete charts[ 'ct_final_' + profileID ]
	for( var index in charts ){
		if( index.match( new RegExp( 'ct_dmg_' + profileID ) ) != null ){
			delete charts[ index ]
		}
	}
	
	for( var i = _profileIndex; i < profile.forms.length; i++ ){
		var i2 = i + 2;
		
		$('#profile_' + i2 ).remove();
		$('#profile_chart_' + i2 ).remove();
		
		delete charts[ 'ct_dmg_' + i2 + '_1' ]
		delete charts[ 'ct_final_' + i2 ]
		for( var index in charts ){
			if( index.match( new RegExp( 'ct_dmg_' + i2 ) ) != null ){
				delete charts[ index ]
			}
		}
		
		displayProfile( i );
	}
	
	if( profile.forms.length === 1 ){
		$('#div_compare_graph').hide();
	}
	
	createLink();
	window.setTimeout( calc, 1000 );
}

function editProfile( _profileIndex ){
	var message = 'In order to edit this profile you will need to overwrite the data in the active form. If you\'d like to save that data please press "Add Attacker Profile" first. Do you wish to continue?';
	
	var input = confirm( message );
	
	if( input === true ){
		profile.forms[0] = profile.forms[ _profileIndex ];
		setFormWithForms();
		
		deleteProfile( _profileIndex );
	}
}

function syncHeight(){
	if( profile.forms.length === 1 )
		return;
	
	var maxHeight = $('#profile_height').height();
	
	for( var i = 1; i < profile.forms.length; i++ ){
		var tempHeight = $('#profile_height_' + ( i + 1 ) ).height(); 
		maxHeight = Math.max( maxHeight, tempHeight );
	}
	
	$('#profile').height( maxHeight );
	for( var i = 1; i < profile.forms.length; i++ ){
		$('#profile_' + ( i + 1 ) ).height( maxHeight );
	}
}

function calc(){
	var finals = [];
	
	for( var ipi = 0; ipi < profile.forms.length; ipi++ ){
		var ac = profile.forms[ipi][ 'ac' ];
		if ( profile.forms[ipi][ 'cr' ] === 'cr' ){
			ac = crac[ ac ];
		}
		var ac = parseInt( ac );
		
		var final = null;
		
		for( var ai = 0; ai < profile.forms[ipi][ 'babMod' ].length; ai++ ){
			var babMod = parseInt( profile.forms[ipi][ 'babMod' ][ai] );
			var babCrit = parseInt( profile.forms[ipi][ 'babCrit' ][ai] );
			var toCrit = parseInt( profile.forms[ipi][ 'critical' ][ai] );
			var multiplier = parseInt( profile.forms[ipi][ 'multiplier' ][ai] );
			multiplier--;
			
			var iterative = profile.forms[ipi][ 'iterative' ][ai].slice(0);
			
			if( profile.forms[ipi][ 'damage' ][ai] == undefined ){
				alert('The main damage section of at least one attack was not populated or impropertly formated.');
				return false;
			}
			var diceTerms = profile.forms[ipi][ 'damage' ][ai].clone();
			
			var extraDiceTerms = ( profile.forms[ipi][ 'extraDamage' ][ai] == undefined ) ? undefined : profile.forms[ipi][ 'extraDamage' ][ai].clone();
			
			var critDiceTerms = ( profile.forms[ipi][ 'critDamage' ][ai] == undefined ) ? undefined : profile.forms[ipi][ 'critDamage' ][ai].clone();
			
			var totalDiceTerms = diceTerms.clone();
			if( extraDiceTerms.values.length > 0 )
				totalDiceTerms.concat( extraDiceTerms );
				
			var totalCritDiceTerms = diceTerms.clone();
			if( critDiceTerms.values.length > 0 )
				totalCritDiceTerms.concat( critDiceTerms );
			
			var histo = parse( totalDiceTerms );
			var crit = parse( totalCritDiceTerms );
			crit.multiply( multiplier );
			
			graphDice( histo, 'ct_dmg_' + ( ipi + 1 ) + '_' + ( ai + 1 ) );
			tableDice( histo, '#tbl_dmg_' + ( ipi + 1 ) + '_' + ( ai + 1 ) );		
			
			for( var ii = 0; ii < iterative.length; ii++ ){
				var toHit = parseInt( iterative[ii] ) + babMod;
				var toHitCrit = parseInt( iterative[ii] ) + babMod + babCrit;
				
				var d20Crit = [];
				
				//If babCrit = 101 then crits auto confrim
				if( babCrit === 101 ){
					var critHisto = crit.clone();
				} else {
					d20Crit.push( new Dice().init( 1, 0 ) );//1 always miss
					d20Crit.push( crit.clone() );//20 always hit and crit
					//1 is always a miss and 20 alwasy a hit so they are not included
					for ( var i = 2; i < 20; i++ ){
						if( toHitCrit + i >= ac ){
							d20Crit.push( crit.clone() );
						} else {
							d20Crit.push( new Dice().init( 1, 0 ) );
						}
					}
					var critHisto = new Dice().merge( d20Crit ).add( histo );	
				}
				
				var d20 = [];
				var threaten = [];
				
				d20.push( new Dice().init( 1, 0 ) ); //1 always miss
				d20.push( critHisto.clone() );	//20 always hit and crit
				//1 is always a miss and 20 alwasy a hit so they are not included
				for ( var i = 2; i < 20; i++ ){
					if( toHit + i >= ac ){
						if( i >= toCrit ){
							d20.push( critHisto.clone() );
						} else {
							d20.push( histo.clone() );
						}
					} else {
						d20.push( new Dice().init( 1, 0 ) );
					}
				}
				
				if( final === null ){
					final = new Dice().merge( d20 );	
				} else {
					final = new Dice().merge( d20 ).add( final );
				}
				
			}
		}
		
		graphDice( final, 'ct_final_' + ( ipi + 1 ), true );
		tableDice( final, '#tbl_final_' + ( ipi + 1 ) );
		
		finals.push( final );
		
		var avg = 0;
		var totalPercent = 0;
		var median = 0;
		for( var index in final.values ){
			var percent = final.values[ index ];
			totalPercent += percent;
			if( totalPercent > .5 ){
				median = index;
				totalPercent = -100;	
			}
			
			avg += index * percent;
		}
		
		var output = '<strong>' + profile.forms[ipi].name + '</strong><br /><br />';
		output += '<strong>Average Damage: ' + ( Math.round( avg * 100 ) / 100 ).toString();
		output += '<br />Median Damage: ' + median + '</strong><br /><br />';
		
		$('#output_' + ( ipi + 1 ) ).html( output );
	}
	
	if( profile.forms.length > 1 ){
		graphManyDice( finals, 'ct_compare_graph' );
	}
	
	return true;
}

function graphDice( _dice, _target, _zeroStart ){
	var data = [];
	var ticks = [];
	
	var i = 0;
	var minY = -1, maxY = 0;
	for( dataI in _dice.values ){
		if( minY === -1 ){
			minY = dataI;
		} else {
			minY = Math.min( minY, dataI );
		}
		maxY = Math.max( maxY, dataI );
		
		data[i] = [ Math.round( _dice.values[ dataI ] * 10000 ) / 100, dataI ];
		i++
	}
	
	if( _zeroStart === true ){
		var dataPoints = parseInt( data[ data.length - 1 ][1] ) + 1;
	} else {
		var dataPoints = data.length;
	}
	var heightPX = dataPoints * 22 + 50;
	
	if( charts[ _target ] != undefined ){
		$('#' + _target ).height( heightPX );
		
		charts[ _target ].replot( { data: [ data ], axes: { 
			yaxis:{
				label: "Damage per Round",
				labelOptions: {
					fontFamily: 'Georgia, Serif',
					fontSize: '12pt'
				},
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				numberTicks: dataPoints + 2,
				min: parseInt( maxY + 1 ),
				max: parseInt( minY - 1 ),
				tickOptions:{ formatString:'%i'}
			} }, resetAxes: true } 
		);
	} else {
		charts[ _target ] = $.jqplot( _target, [data], {
			width: 300,
			height: heightPX,
			seriesDefaults: {
				renderer:$.jqplot.BarRenderer,
				rendererOptions: {
					barDirection: 'horizontal',
					barWidth: 10
				},
				shadow: false,
				color: '#D70206'
			},
			axes: {
				yaxis: {
					label: "Damage per Round",
					labelOptions: {
						fontFamily: 'Georgia, Serif',
						fontSize: '12pt'
					},
					labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
					numberTicks: dataPoints + 2,
					min: parseInt( maxY + 1 ),
					max: parseInt( minY - 1 ),
					tickOptions:{ formatString:'%i'}
				},
				xaxis: {
					label: "Probaility (%)",
					labelOptions: {
						fontFamily: 'Georgia, Serif',
						fontSize: '12pt'
					},
					tickOptions:{
						formatString:'%.2f\%'
					}
				}
			},
			highlighter: {
				show: true,
				sizeAdjust: 7.5,
				tooltipLocation: 'e',
				tooltipAxes: 'x'
			}
		});	
	}
}

function graphManyDice( _dice, _target ){
	if( !_dice[0] && !_dice[0].isDice !== true )
		return;
	
	var data = [];
	var max = 0;
	var seriesStyle = [];
	for( var di = 0; di < _dice.length; di++ ){
		var i = 0;
		data.push( [] );
		for( dataI in _dice[di].values ){
			data[di][i] = [ dataI, _dice[di].values[ dataI ] * 100 ];
			max = Math.max( max, dataI );
				
			i++
		}
		seriesStyle[di] = {
			label: profile.forms[di].name,
			lineWidth: 3,
			markerOptions: { size: 0 }
		}
	}
	
	var finalData = [ data[0] ];
	var finalSeries = [ seriesStyle[0] ]
	
	for( var i = 1; i < data.length; i++ ){
		var inserted = false;
		for( var j = 0; j < finalData.length; j++ ){
			if( finalData[j].length < data[i].length ){
				finalData.splice( j, 0, data[i] );
				finalSeries.splice( j, 0, seriesStyle[i] );
				inserted = true;
				break;
			}
		}
		if( inserted === false ){
			finalData.push( data[i] );
			finalSeries.push( seriesStyle[i] );
		}
	}
	
	$('#div_compare_graph').show();
	
	if( charts[ _target ] ){
		charts[ _target ].replot({ data: finalData
				, resetAxes: true
				, axes: {
					xaxis: {
						label: "Damage per Round",
						labelOptions: {
							fontFamily: 'Georgia, Serif',
							fontSize: '12pt'
						},
						tickOptions:{
		            		formatString:'%.0f'
		            	},
						min: 0,
						max: max + 1 
					} 
				},
				series: finalSeries,
				highlighter: {
					show: true,
					sizeAdjust: 7.5
				} 
			});
	} else {
		charts[ _target ] = $.jqplot( _target, finalData, {
			title: "Proability of Damage per Round",
			axesDefaults: {
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer
			},
			axes: {
				xaxis: {
					label: "Damage per Round",
					labelOptions: {
						fontFamily: 'Georgia, Serif',
						fontSize: '12pt'
					},
					tickOptions:{
	            		formatString:'%.0f'
	            	},
					min: 0,
					max: max + 1 
				},
				yaxis: {
					label: "Probaility (%)",
					labelOptions: {
						fontFamily: 'Georgia, Serif',
						fontSize: '12pt'
					},
					tickOptions:{
	            		formatString:'%.2f\%'
	            	}
				}
			},
			series: finalSeries,
			highlighter: {
				show: true,
				sizeAdjust: 7.5
			},
	      	legend: { show:true, location: 'ne' }
	});	
	}
}

function tableDice( _dice, _target ){
	var rows = "";
	
	for( dataI in _dice.values ){
		var percent = ( Math.round( _dice.values[ dataI ] * 10000 ) / 100 ).toString();
		if( countDecimals( percent ) == 0 ){
			percent += '.00';
		} else if ( countDecimals( percent ) == 1 ){
			percent += '0';
		}
		rows += '<tr><td align="center">' + dataI + '</td><td align="right">' + percent + ' %</td></tr>';
	}
	
	$( _target ).html( '<table style="margin-left: 20px;"><tr><th>Dmg</th><th>Prob</th>' + rows + '</table>' )
}

function parse( _terms ){
	for( var i = 0; i < _terms.values.length; i++ ){
		if( _terms.values[ i ] === '(' )
			parentheses( _terms, i );
	}
	
	dmgCalc( _terms );
	
	if( typeof _terms.values[0] !== 'undefined' && typeof _terms.values[0].isDice === 'boolean' && _terms.values[0].isDice === true ){
		return _terms.values[0];	
	} else {
		var out = new Dice().init( 1, 0 );
		var newValues = {};
		newValues[  _terms.values[0] ] = 1
		out.values = newValues;
		return out;
	}
}

function parentheses( _terms, _start ){
	for( var i = _start + 1; i < _terms.values.length; i++ ){
		if( _terms.values[ i ] === '(' )
			parentheses( _terms, i );
			
		if( _terms.values[ i ] === ')' ){
			_terms.values.splice( _start,1 );
			i--;
			_terms.values.splice( i,1 );
			dmgCalc( _terms, _start, i - 1 );
		}
	}
}

function dmgCalc( _terms, _start, _end ){
	if( !_start || _start < 0 || _start > _terms.values.length - 1 )
		_start = 0;
		
	if( !_end || _end < 0 || _end > _terms.values.length - 1 )
		_end = _terms.values.length - 1;
	
	for( var i = _start; i < _end; i++ ){
		if( isOperator[ _terms.values[i] ] === true ){
			if( i - 1 < _start 
				|| i + 1 > _end 
				|| ( !$.isNumeric( _terms.values[ i - 1 ] ) && _terms.values[ i - 1 ].isDice !== true )
				|| ( !$.isNumeric( _terms.values[ i + 1 ] ) && _terms.values[ i + 1 ].isDice !== true ) ){
				_terms.values.splice( i,1 )
			}
		}
	}
				
	for( var i = _start; i <= _end; i++ ){
		if( _terms.values[i] === '*' ){
			if( _terms.values[ i - 1 ].isDice === true ){
				num = _terms.values[ i - 1 ].multiply( _terms.values[ i + 1 ] );
			} else if ( _terms.values[ i + 1 ].isDice === true ){
				num = _terms.values[ i + 1 ].multiply( _terms.values[ i - 1 ] );
			} else {
				var num = parseFloat( _terms.values[ i - 1 ] )  * parseFloat( _terms.values[ i + 1 ] );
			}
			_terms.values.splice( i - 1, 3, num );
			i--;
		}
		
		if( _terms.values[i] === '/' ){
			if( _terms.values[ i - 1 ].isDice === true ){
				num = _terms.values[ i - 1 ].divide( _terms.values[ i + 1 ] );
			} else if ( _terms.values[ i + 1 ].isDice === true ){
				num = _terms.values[ i + 1 ].divide( _terms.values[ i - 1 ], true );
			} else {
				var num = parseFloat( _terms.values[ i - 1 ] )  / parseFloat( _terms.values[ i + 1 ] );
			}
			_terms.values.splice( i - 1, 3, num );
			i--;
		}
	}
	
	for( var i = _start; i < _end; i++ ){
		if( _terms.values[i] === '+' ){
			if( _terms.values[ i - 1 ].isDice === true ){
				num = _terms.values[ i - 1 ].add( _terms.values[ i + 1 ] );
			} else if ( _terms.values[ i + 1 ].isDice === true ){
				num = _terms.values[ i + 1 ].add( _terms.values[ i - 1 ] );
			} else {
				var num = parseFloat( _terms.values[ i - 1 ] )  + parseFloat( _terms.values[ i + 1 ] );
			}
			_terms.values.splice( i - 1, 3, num );
			i--;
		}
		
		if( _terms.values[i] === '-' ){
			if( _terms.values[ i - 1 ].isDice === true ){
				num = _terms.values[ i - 1 ].subtract( _terms.values[ i + 1 ] );
			} else if ( _terms.values[ i + 1 ].isDice === true ){
				num = _terms.values[ i + 1 ].subtract( _terms.values[ i - 1 ], true );
			} else {
				var num = parseFloat( _terms.values[ i - 1 ] )  - parseFloat( _terms.values[ i + 1 ] );
			}
			_terms.values.splice( i - 1, 3, num );
			i--;
		}
	}
}

function setNumeric( _name ){
	var value = $('#' + _name.name).val();
	
	if( $.isNumeric( value ) ){
		$('#' + _name.name).val( parseInt( value ) );
	} else {
		$('#' + _name.name).val(0);
	}
}

function setValueNumeric( _value ){
	if( $.isNumeric( _value ) ){
		return _value;
	} else {
		return 0;
	}
}

function setDelimitedNumeric( _value ){
	return _value.replace( regDelimitedNumeric, '' );
}

function setArrayNumeric( _value ){
	if( $.isNumeric( _value ) ){
		return _value;
	} else {
		return 0;
	}
}

function setIterative(){
	var bab = $('#txt_bab').val();
	
	var iterative = bab;
	bab = parseInt( bab );
	while( bab > 5 ){
		bab -= 5;
		iterative += ', ' + bab;
	}
	
	for( var i = 1; i <= attackI; i++ ){
		if( $('#txt_action_' + i).val() == 'fa' ){
			$('#txt_iterative_' + i).val( iterative );
		} else {
			$('#txt_iterative_' + i).val( $('#txt_bab').val() );
		}	
	}
}

function sanitizeIterative( _name ){
	var value = $('#' + _name.name).val();
	
	value = value.replace( regIterative, '' );
	
	$('#' + _name.name).val( value );
}

function setCR(){
	var bab = $('#txt_bab').val();
	
	if( $.isNumeric( bab ) ){
		$('#ac').val( bab );
		
		cracChange();
	}
}

var countDecimals = function (value) { 
    if ((value % 1) != 0) 
        return value.toString().split(".")[1].length;  
    return 0;
}

function cracChange(){
	var ac = $('#ac').val();
	
	if( ac.length > 0 && $('#txt_crac').val() === 'cr' ){
		if( crac[ ac ] == undefined ){
			var min = -1;
			var max = 0;
			for( var index in crac ){
				index = parseInt( index );
				if( index > max ){
					max = index;
				}
				if( min === -1 || index < min ){
					min = index;
				}
			}
			
			if( ac > max ){
				ac = max;
			} else {
				ac = min;
			}
		}
		
		$('#ac').val( ac );
		
		$('#ac_out').html( "AC: " + crac[ ac ] )
			.show();
	} else {
		$('#ac_out').hide();
	}
}

function setFormWithForms(){
	if( profile.forms.length === 0 )
		return;
		
	var maxAttacks = profile.forms[0][ 'babMod' ].length;
	
	attackI = 1;

	$('#add_form').html('');
	$('#add_dmg').html('');
	
	for( var i = 1; i < maxAttacks; i++ ){
		addAttack()	
	}
	
	$('#txt_name').val( profile.forms[0][ 'name' ] );
	$('#txt_bab').val( profile.forms[0][ 'bab' ] );
    
    for( var i = 0; i < attackI; i++ ){
    	var pi = i + 1;
    	
	    $('#txt_bab_mod_' + pi).val( profile.forms[0][ 'babMod' ][i] );
	    $('#txt_iterative_' + pi).val( profile.forms[0][ 'iterative' ][i] );
	    $('#txt_action_' + pi).val( profile.forms[0][ 'action' ][i] );
	    $('#dmg_' + pi).val( profile.forms[0][ 'damageRaw' ][i] );
	    $('#extra_dmg_' + pi).val( profile.forms[0][ 'extraDamageRaw' ][i] );
	    $('#txt_crit_' + pi).val( profile.forms[0][ 'critical' ][i] );
	    $('#txt_multiplier_' + pi).val( profile.forms[0][ 'multiplier' ][i] );
	    $('#txt_bab_crit_' + pi).val( profile.forms[0][ 'babCrit' ][i] );
	    $('#crit_dmg_' + pi).val( profile.forms[0][ 'critDamageRaw' ][i] );	
    }
    
    
    $('#txt_crac').val( profile.forms[0][ 'cr' ] );
    $('#ac').val( profile.forms[0][ 'ac' ] );
    
    cracChange();
}

function processForm( _next ){
	var ipi = 0;
	
	profile.forms[ ipi ] = {
		"name" : "",
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
		"critDamageRaw" : []
	};
	
	profile.forms[ ipi ][ 'name' ] = $('#txt_name').val();
	
	profile.forms[ ipi ][ 'bab' ] = setValueNumeric( $('#txt_bab').val() );
	if( profile.forms[ ipi ][ 'bab' ] == undefined )
		profile.forms[ ipi ][ 'bab' ] = 0;
	
	for( var ai = 1; ai <= attackI; ai++ ){
		var aii = ai - 1;
		profile.forms[ ipi ][ 'babMod' ][aii] = setValueNumeric( $('#txt_bab_mod_' + ai).val() );
		profile.forms[ ipi ][ 'iterative' ][aii] = $('#txt_iterative_' + ai).val().replace( regIterative, '' ).split(',');
		profile.forms[ ipi ][ 'action' ][aii] = $('#txt_action_' + ai).val();
		profile.forms[ ipi ][ 'damageRaw' ][aii] = $('#dmg_' + ai).val();
		profile.forms[ ipi ][ 'damage' ][aii] = profile.forms[ ipi ][ 'damageRaw' ][aii];	
		profile.forms[ ipi ][ 'damage' ][aii] = new Terms().init( profile.forms[ ipi ][ 'damage' ][aii] );
		profile.forms[ ipi ][ 'extraDamageRaw' ][aii] = $('#extra_dmg_' + ai).val();
		profile.forms[ ipi ][ 'extraDamage' ][aii] = profile.forms[ ipi ][ 'extraDamageRaw' ][aii];
		profile.forms[ ipi ][ 'extraDamage' ][aii] = new Terms().init( profile.forms[ ipi ][ 'extraDamage' ][aii] );
		profile.forms[ ipi ][ 'critical' ][aii] = setValueNumeric( $('#txt_crit_' + ai).val() );
		profile.forms[ ipi ][ 'multiplier' ][aii] = $('#txt_multiplier_' + ai).val();
		profile.forms[ ipi ][ 'babCrit' ][aii] = setValueNumeric( $('#txt_bab_crit_' + ai).val() );
		profile.forms[ ipi ][ 'critDamageRaw' ][aii] = $('#crit_dmg_' + ai).val();
		profile.forms[ ipi ][ 'critDamage' ][aii] = profile.forms[ ipi ][ 'critDamageRaw' ][aii];	
		profile.forms[ ipi ][ 'critDamage' ][aii] = new Terms().init( profile.forms[ ipi ][ 'critDamage' ][aii] );
	}
	   
	profile.forms[ ipi ][ 'cr' ] = $('#txt_crac').val();
	profile.forms[ ipi ][ 'ac' ] = $('#ac').val();
 
 	profile.fixForms( ipi, attackI );
 	
 	if( typeof _next === 'function' ){
 		_next();
 	}
}

function createLink(){
	var link = '';
	var first = true;
	
	for( var ipi = 0; ipi < profile.forms.length; ipi++ ){
		var suffix = '';
		if( ipi > 0 )
			suffix = '' + ipi;
		
		if( first ){
			link += '?n' + suffix + '=' + encodeURIComponent( profile.forms[ipi][ 'name' ] );
			first = false;
		} else {
			link += '&n' + suffix + '=' + encodeURIComponent( profile.forms[ipi][ 'name' ] );	
		}
		
		link += '&b' + suffix + '=' + encodeURI( profile.forms[ipi][ 'bab' ] );
		link += '&h' + suffix + '=';
		for( var i = 0; i < profile.forms[ipi][ 'babMod' ].length; i++ ){
			if( i > 0 ) link += ',';
			link += encodeURI( profile.forms[ipi][ 'babMod' ][i] );
		}
		link += '&ia' + suffix + '=';
		for( var i = 0; i < profile.forms[ipi][ 'iterative' ].length; i++ ){
			if( i > 0 ) link += ';';
			for( var j = 0; j < profile.forms[ipi][ 'iterative' ][i].length; j++ ){
				if( j > 0 ) link += ',';
				link += encodeURI( profile.forms[ipi][ 'iterative' ][i][j] ) ;
			}
		}
		link += '&a' + suffix + '=';
		for( var i = 0; i < profile.forms[ipi][ 'action' ].length; i++ ){
			if( i > 0 ) link += ',';
			link += encodeURI( profile.forms[ipi][ 'action' ][i] ) ;
		}
		link += '&d' + suffix + '=';
		for( var i = 0; i < profile.forms[ipi][ 'damageRaw' ].length; i++ ){
			if( i > 0 ) link += ',';
			link += encodeURI( profile.forms[ipi][ 'damageRaw' ][i].replace( regSanitize, '' ) ) ;
		}
		link += '&ed' + suffix + '=';
		for( var i = 0; i < profile.forms[ipi][ 'extraDamageRaw' ].length; i++ ){
			if( i > 0 ) link += ',';
			link += encodeURI( profile.forms[ipi][ 'extraDamageRaw' ][i].replace( regSanitize, '' ) ) ;
		}
		link += '&c' + suffix + '=';
		for( var i = 0; i < profile.forms[ipi][ 'critical' ].length; i++ ){
			if( i > 0 ) link += ',';
			link += encodeURI( profile.forms[ipi][ 'critical' ][i] ) ;
		}
		link += '&m' + suffix + '=';
		for( var i = 0; i < profile.forms[ipi][ 'multiplier' ].length; i++ ){
			if( i > 0 ) link += ',';
			link += encodeURI( profile.forms[ipi][ 'multiplier' ][i] ) ;
		}
		link += '&ch' + suffix + '=';
		for( var i = 0; i < profile.forms[ipi][ 'babCrit' ].length; i++ ){
			if( i > 0 ) link += ',';
			link += encodeURI( profile.forms[ipi][ 'babCrit' ][i] );
		}
		link += '&cd' + suffix + '=';
		for( var i = 0; i < profile.forms[ipi][ 'critDamageRaw' ].length; i++ ){
			if( i > 0 ) link += ',';
			link += encodeURI( profile.forms[ipi][ 'critDamageRaw' ][i].replace( regSanitize, '' ) ) ;
		}
		link += '&cr' + suffix + '=' + encodeURI( profile.forms[ipi][ 'cr' ] );
		link += '&ac' + suffix + '=' + encodeURI( profile.forms[ipi][ 'ac' ] );
	}
	
	$('#link').html( linkPath + link );
	$('#a_link').attr( 'href', link );
}

function htmlEncode(value){
  //create a in-memory div, set it's inner text(which jQuery automatically encodes)
  //then grab the encoded contents back out.  The div never exists on the page.
  return $('<div/>').text(value).html();
}

function arrayToString( _array ){
	if( !Array.isArray( _array ) )
		return _array;
	
	var out = '';
		
	for( var i = 0; i < _array.length; i++ ){
		out += _array[i];
	}
	
	return out;
}
