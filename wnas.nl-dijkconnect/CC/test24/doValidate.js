function toonKlaarknop() {
	// check boolean is Bel me niet register
	if (bIsBMNR==false)
		return false;

	document.getElementById('klaarknop').style.display = 'inline';
	document.getElementById('bmn_vrs_knop').style.display = 'none';
	document.getElementById('btekst').style.display = 'none';
	document.getElementById('btekst_vak').style.background='#ffffff';
}


function toonVRSKnop() {
        // check boolean is Bel me niet register
        if (bIsBMNR==false)
                return false;

	document.getElementById('klaarknop').style.display = 'none';
	document.getElementById('bmn_vrs_knop').style.display = 'inline';
	document.getElementById('btekst').style.display = 'inline';
        document.getElementById('btekst_vak').style.background='#ffffaa';
}

function stuurknop(functie,variable,agent) {

	// zorg dat de bel me niet VRS knop weg blijft
	document.getElementById('bmn_vrs_knop').title = 'hide';

	// voor ajaxy knoppen

	var sSOAPRequest = "";
	var sURL = "knopscript.php?agent="+agent+"&functie="+functie+"&var="+variable;
	var e;

	if (window.XMLHttpRequest) {
		var httpObj = new XMLHttpRequest();
	} else {
		if (window.ActiveXObject) {
			var httpObj = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}

	httpObj.open ("POST",sURL,true);
	httpObj.setRequestHeader("Content-Type","text/xml");
	httpObj.setRequestHeader("Cache-Control","no-cache");

	httpObj.onreadystatechange = function() {
		if (httpObj.readyState == 4) {
			if (httpObj.status == 200) {
				e = httpObj.responseText;
				//alert(e);
			} else {
				alert('er ging iets mis in stuurbutton()');
			}
		}
	};

	try {
		httpObj.send(sSOAPRequest);
	} catch(e) {
		alert(e);
		alert(e.description);
	}

}


function checkboxHandler(self) {
	// aanroepen met onchange("checkboxHandler(this)") niet checkboxHandler(self) omdat er geen validatie op checkboxen kunnen
	// KANKERDINGEN

        if (document.all['field[Informatie]'].checked){
                DisableValidate(self,'field[Rekeningnummer]');
                DisableValidate(self,'field[Bedrag]');
                DisableValidate(self,'field[Periode]');
        } else {
                EnableValidate(self,'field[Rekeningnummer]');
                EnableValidate(self,'field[Bedrag]');
                EnableValidate(self,'field[Periode]');
        }
}

function TrackCount(fieldObj,countFieldName,maxChars)
    {
      var countField=eval("fieldObj.form."+countFieldName);
      var diff=maxChars - fieldObj.value.length;
  
      if (diff < 0)
      {
        fieldObj.value=fieldObj.value.substring(0,maxChars);
        diff=maxChars - fieldObj.value.length;
      }
      countField.value=diff;
    }
  

function getCheckedValue(radioObj) {
	if(!radioObj)
		return "";
	var radioLength = radioObj.length;
	if(radioLength == undefined)
		if(radioObj.checked)
			return radioObj.value;
		else
			return "";
	for(var i = 0; i < radioLength; i++) {
		if(radioObj[i].checked) {
			return radioObj[i].value;
		}
	}
	return "";
}

function vulvoicelog(dat) {
	Aantal= getValue(dat.form['field[Aantal]']);	
	document.getElementById("vl_rekeningnummer").innerHTML="<b>" + document.getElementsByName("field[Rekeningnummer]")[0].value + "</b>";
	document.getElementById("vl_naam").innerHTML="<b>Dhr/Mevr. " + document.getElementsByName("field[Tussenvoegsels]")[0].value + " " + document.getElementsByName("field[Achternaam]")[0].value + "</b>";
	document.getElementById("vl_aantal").innerHTML="<b>" + Aantal + " lot(en)</b>";
	if (dat.form['field[Mobiel]']){
  	  var mobiel=document.getElementsByName("field[Mobiel]")[0].value;
  	  if (mobiel>0) {
		document.getElementById("vl_mobieltekst").innerHTML="<font color='red'><b>- U heeft telefoonnummer " + mobiel + " opgegeven als lotnummer, dit kunt u altijd wijzigen op uw persoonlijke pagina.</b></font>";
	    }else {
		document.getElementById("vl_mobieltekst").innerHTML="<font color='red'><b>- U heeft geen mobiel nummer opgegeven. Wij selecteren voor u een fictief nummer als lotnummer, dit kunt u altijd wijzigen op uw persoonlijke pagina.</b></font>";
	  }
	}
}


function LimitText(fieldObj,maxChars)
    {
      var result=true;
      var key = event.keyCode;

       // skip return & ;
      if (key==13 || key==59)
	  {
        event.returnValue = false;
        event.keyCode = 0;
		return false;
      }

      if (fieldObj.value.length >= maxChars)
        result=false;
    
      if (window.event)
        window.event.returnValue=result;
      return result;
    }

function calcTotal() {

 var totaal;
 var verzend;

 totaal = 0;
 verzend = 0;

 // dvds

 if (document.all['field[dvd_henny]'].value>0) {
	totaal += parseFloat(document.all['field[dvd_henny]'].value)*29.95;
	verzend += parseFloat(document.all['field[dvd_henny]'].value)*2.50;
 }
 if (document.all['field[dvd_cath]'].value>0) {
 	totaal += parseFloat(document.all['field[dvd_cath]'].value)*29.95;
	verzend += parseFloat(document.all['field[dvd_cath]'].value)*2.50;
 }

 // vhss

 if (document.all['field[vhs_henny]'].value>0) {
	totaal += parseFloat(document.all['field[vhs_henny]'].value)*22.50;
	verzend += parseFloat(document.all['field[vhs_henny]'].value)*4.95;
 }
 if (document.all['field[vhs_cath]'].value>0) {
	totaal += parseFloat(document.all['field[vhs_cath]'].value)*22.50;
	verzend += parseFloat(document.all['field[vhs_cath]'].value)*4.95;
 }

 // aanbiedingen

 if (document.all['field[dvd_aanbieding]'].value>0) {
	totaal += parseFloat(document.all['field[dvd_aanbieding]'].value)*57.40;
 }
 if (document.all['field[vhs_aanbieding]'].value>0) {
	totaal += parseFloat(document.all['field[vhs_aanbieding]'].value)*45.00;
 }

 totaalbedrag.innerHTML = Math.round(parseFloat(totaal)*100)/100;
 totaalverzend.innerHTML = Math.round(parseFloat(verzend)*100)/100;

}

function checkloten(self) {
  if (self.form['field[Bedrag]'].value>0){
    EnableValidate(self,'field[Rekeningnummer]');
    EnableValidate(self,'field[Periode]');
  }
  else {
    DisableValidate(self,'field[Periode]');
    DisableValidate(self,'field[Rekeningnummer]');
  }
}

function periodeHandler(self) {
	if (!(self.form['field[Periode]'].length)) return true;
	var count = self.form['field[Periode]'].length;
	var t;
	var u;
	for (t = 0; t < count; t++) {
		if (eval("self.form['field[Periode]'][t].checked")) {
			u = eval("self.form['field[Periode]'][t].value");
			break;
		}
	}
	switch (u) {
		case 'G' :
		case 'F' : {
			DisableValidate(self,'field[Rekeningnummer]');
			DisableValidate(self,'field[Bedrag]');
			break;
		}
		default : {
			EnableValidate(self,'field[Rekeningnummer]');
			EnableValidate(self,'field[Bedrag]');
			break;
		}
	}
}

var oude_resultaat = "";
function resultHandler(self) {
  var count = self.form['field[Resultaat]'].length;
  var t;
  var u;
  for (t = 0; t < count; t++) {
    if (eval("self.form['field[Resultaat]'][t].checked")) {
      u = eval("self.form['field[Resultaat]'][t].value");
      break;
    }
  }
	if (oude_resultaat == u) {
		return;
	} else {
		oude_resultaat = u;
	}
  switch (u) {
    case 'C' :
	EnableValidateAll(self);
       	DisableValidate(self,'field[Terugbeldatum]','field[Terugbeltijd]');
	if (self.form['field[Aantal]'] && self.form['field[Bedrag]']){
        	DisableValidate(self,'field[Bedrag]','field[Periode]');
	} 
	break;
    case 'H' :
	EnableValidateAll(self);
	DisableValidate(self,'field[Terugbeldatum]','field[Terugbeltijd]');
	break;
    case 'N' :
	EnableValidateAll(self);
	DisableValidate(self,'field[Terugbeldatum]','field[Terugbeltijd]','field[Aantal]');
	break;
    case 'M' :
    case 'B' : 
	DisableValidateAll(self);
	EnableValidate(self,'field[Terugbeldatum]','field[Terugbeltijd]','field[Telefoon]');
	if (self.form['achternaamdeel']) EnableValidate(self,'field[Achternaam]');
	break;
    default :  
   	DisableValidateAll(self);
	if (self.form['achternaamdeel']) EnableValidate(self,'field[Achternaam]');
	break;
  }
  // check boolean is Bel me niet register
  if (bIsBMNR==true) {
    	// Moet BMN-VRS uitgezet worden?
	if (niet_naar_bmn_vrs_bij_resultaten.indexOf(u) != -1) {
  	  toonKlaarknop();
	} else if (document.getElementById('bmn_vrs_knop').title != 'hide') {
			// na aanroep van stuurknop() komen we hier niet meer
			toonVRSKnop();
	}
  }
}



function elfproef(veld){
  var input=veld.value;
  var tot=0;
  var deel=0;
  var rest =0;
  if ((input.length == 0) || (input.length == 8) || (input.length > 10) || (input == 0)){
    return false;
  } 
  if (input.length<=7){
    return true;
  }  else{
    for (i=0;i<input.length;i++){
      getal=input.substr(i,1);
      tot +=getal * (9 - i);
    } 
    deel =tot/11;
    rest=tot%11;
    if (rest!=0){
      return false;
    }else {
      return true; 
    }
  } 
}

function firstFocus() {
    var TForm = document.forms[0]; /* We hebben maar 1 formulier */
    TForm.attachEvent('onsubmit',doValidate);
    for (var i=0;i<TForm.length;i++) {
        switch (TForm.elements[i].dbtype) {
           case 'DATUM' : { 
                      TForm.elements[i].validate = '/^([012][1-9]|3[01])-(0\\d|1[012])-(19|20)\\d\\d$/'; 
                      TForm.elements[i].picture = '99-99-9999';
                      TForm.elements[i].maxLength = '10';
                      break; 
                     }
           case 'POSTCODE' : {
               TForm.elements[i].validate = '/^[1-9]\\d{3}\\w\\w$/'; 
               TForm.elements[i].picture = '9999XX';
               TForm.elements[i].maxLength = '6';
               }
           }
        /* Niet alle events koppelen aan form elementen maar slechts die
         * die relevant zijn.
         */
        TForm.elements[i].lastPass = false;
         /* TForm.elements[i].attachEvent('onsubmit',doValidate); */
          
          TForm.elements[i].attachEvent('onchange',doValidate);
          TForm.elements[i].attachEvent('onclick',doValidate);
          
          if (TForm.elements[i].type == "text"){
              TForm.elements[i].attachEvent('onkeypress',KeyboardHandler);
              TForm.elements[i].attachEvent('onkeyup',doValidate);
              TForm.elements[i].attachEvent('onkeyup',ArrowHandler);
          }
    }
    
    document.body.style.visibility = "visible";
    for (var x=0;x<TForm.length;x++) {
         if ((TForm.elements[x].type=="text")||
           (TForm.elements[x].type=="textarea")||
           (TForm.elements[x].type.toString().charAt(0)=="s")) {
//             TForm.elements[x].focus();
             doValidate(TForm);
             break;
         }
    }
}



function setWindowFocus() {
    // Check to see if the windowFocus was already set 
    console.log('Call setWindowFocus');
    if ( typeof setWindowFocus.flag == 'undefined' ) {
        setWindowFocus.flag = 1;
        // It has not... perform the set focus
        window.focus();
        console.log('Set window focus');
    }
}



function doValidate(what) {
	var pass=true;
	var firstone = 0;
	var autoFocus = 0;
	var passval = true;
	var which;
    
        console.log('doValidate');
        // console.log('Set window focus');
        // window.focus();
	
	switch(event.type) {
		case 'load'   : { which = what; break; }
		case 'submit' : { which = event.srcElement; break; }
		case 'keyup'  : { which = event.srcElement.form; break; }
		case 'change'  : { which = event.srcElement.form; break; }
    case 'click'	: { which = event.srcElement.form; break; }	
		default       : { return; }
	}
	for (var i=which.length-1;i>=0;i--) {
		var self=which.elements[i];
		if ((self.validate || self.dbtype) && !self.readOnly) { // Has 'validate' field
			var mask = self.validate;
  		if ( (self.venabled == undefined) || (self.venabled == 1) ) { // Is enabled to validate
				if (mask.charAt(0) == "/") { // Validate is a regular expression
					if (self.type == "checkbox" || self.type == "radio") {
  					pass = String(self.checked).match(eval(mask));
					} else {
  					pass = self.value.match(eval(mask));
					}
				} else {
				 	pass = eval(mask); // Validate is a javascript function
				}
				if (pass) {
					self.pass = true;
					if ((self.pass != self.lastPass) || (event.type == 'click')) {
						try {
  			      eval (self.onvalid);
  			    } catch(r) {
  			    	alert(r.description + ' in veld ' + self.name)
  			    }
//					  firstone = updateForm(which);
  			  }
				} else {
					self.pass = false;
					if ((self.pass != self.lastPass) || (event.type == 'click')) {
						try {
  					  eval (self.oninvalid);
  			    } catch(r) {
  			    	alert(r.description + ' in veld ' + self.name)
  			    }
//					  firstone = updateForm(which);
					}
				}
			} else {
			}
		}
		self.lastPass = pass;
	}
  firstone = updateForm(which);
	if (event.type == 'submit') {
		if (firstone) {
			var msg = "Het veld '" + firstone.label + "' is onjuist ingevuld.";
			var blind = firstone.label + " is onjuist.";
/*      for (var foc = 1; foc <= self.document.getElementById('oMPC').children.length; foc++) {
			self.document.getElementById('oMPC').selectedIndex = foc;
        try {*/
				  firstone.focus();
/*				  break;
		    } catch(e) {
		    }
		  }*/
			event.returnValue = false;
			try {
      var Agent = new ActiveXObject("Agent.Control.1");
      Agent.Connected = true;
      Agent.Characters.Load("Genie","genie.acs");
      var Genie = Agent.Characters("genie");
      Genie.MoveTo(posLib.getScreenLeft(firstone),posLib.getScreenTop(firstone));
      Genie.Show();
      Genie.GestureAt(posLib.getScreenLeft(firstone),posLib.getScreenTop(firstone));
      Genie.Speak("\\Spd=120\\" + blind);
      Genie.Hide();
      } catch(e) { 
      	alert(msg);
			};
    
			return false;
		} else {
      var hunt = which.document.getElementsByTagName('input');
  		for (var hunter = 0; hunter < hunt.length; hunter++) {
  	    if (hunt.item(hunter).type == 'submit')  {
  		    hunt.item(hunter).style.visibility = "hidden";
  	    }
      }
			CallsheetServer.beforeSubmit();
			CallsheetServer.beforeSubmit();
			CallsheetServer.beforeSubmit();
			event.returnValue = true;
			return true;
		}
	}
}

function showInvalid(firstone) {
			var msg = "Het veld '" + firstone.label + "' is onjuist ingevuld.";
			var blind = firstone.label + " is onjuist.";
/*      for (var foc = 1; foc <= self.document.getElementById('oMPC').children.length; foc++) {
			self.document.getElementById('oMPC').selectedIndex = foc;
        try {*/
				  firstone.focus();
/*				  break;
		    } catch(e) {
		    }
		  }*/
			event.returnValue = false;
			try {
      var Agent = new ActiveXObject("Agent.Control.1");
      Agent.Connected = true;
      Agent.Characters.Load("Genie","genie.acs");
      var Genie = Agent.Characters("genie");
      Genie.MoveTo(posLib.getScreenLeft(firstone),posLib.getScreenTop(firstone));
      Genie.Show();
      Genie.GestureAt(posLib.getScreenLeft(firstone),posLib.getScreenTop(firstone));
      Genie.Speak("\\Spd=120\\" + blind);
      Genie.Hide();
      } catch(e) { 
      	alert(msg);
			};
    
			return false;
}


function updateForm(which) {
	var passval = true;
	var firstone;
	for (var i=which.length-1;i>=0;i--) {
		var self=which.elements[i];
		if ((self.validate || self.dbtype) && !self.readOnly) {
	    if ( (self.venabled == undefined) || (self.venabled == 1)) { // Is enabled to validate
    		if (self.pass) {
			    if (self.type == "radio") {
    				var count = self.form[self.name].length;
				    for (var j = 0; j < count; j++) {
    					self.form[self.name][j].className = "InputOK";
				    }
			    }
		      self.className = "InputOK";
        } else {
    			if (self.type == "radio") {
				    var count = self.form[self.name].length;
				    for (var j = 0; j < count; j++) {
    					self.form[self.name][j].className = "InputError";
				    }
			    }
			    passval = false;
			    firstone = self;
			    self.className = "InputError";
        }
      } else {
      	if (self.type != 'button') self.className = "InputNV";
      }	
		} else {
      	if (self.type != 'button') self.className = "InputNV";
		}
  }
  var FormStat = '';
	if (passval == false) 
	  FormStat = "FormError"
	else
	  FormStat = "FormOK";
  var hunt = self.document.getElementsByTagName('input');
  for (var hunter = 0; hunter < hunt.length; hunter++) {
  	if (hunt.item(hunter).type == 'submit')  {
  		hunt.item(hunter).className = FormStat;
  	}
  }
  return firstone;
}


//function isRequired(field) {
//	return (!isEmpty(field));
//}

function strUpperCase(field) {
	return field.toUpperCase();
}


function KeyboardHandler() {
	var elmnt = event.srcElement;
	var content = event.srcElement.value;
	var fields = event.srcElement.form.elements.length;
  var picFormatters = "09aAxX@_";
  var key = event.keyCode;
  var char = String.fromCharCode(key);
	var direction = 0;
	if (elmnt.allowed) {
		  alert(char + " match against " + elmnt.allowed + " = " + char.match(eval(elmnt.allowed)));
		  if ( char.match(eval(elmnt.allowed)) ) {
		  } else {
		  	event.returnValue = false;
		  	return false;
		  }
	}
	if (elmnt.denied) {
		  if ( char.match(eval(elmnt.denied)) ) {
		  	event.returnValue = false;
		  	return false;
		  }
	}
	if (content.length >= elmnt.maxLength) {
		return;
	}
	if (elmnt.picture) {
		var picOK = true;
		var picClass = elmnt.picture.charAt(elmnt.value.length);
		event.returnValue = false;
		switch (picClass) {
			case '9' : if (isKeyDigit() == -1) { picOK = false; return; }; break;
			case 'x' : if (isKeyUpperCase != -1) { keyLowercase(); } if (isKeyLowerCase() == -1) { picOK = false; return; }; break;
			case 'X' : if (isKeyLowerCase != -1) { keyUppercase(); } if (isKeyUpperCase() == -1) { picOK = false; return; }; break;
			case 'a' : if (isKeyUpperCase != -1) { keyLowercase(); } break;
			case 'A' : if (isKeyLowerCase != -1) { keyUppercase(); } break;
			
		}
	  if (picFormatters.indexOf(picClass) < 0) {
	  	picOK = false;
	  }
		if (picOK) {
			content = content + String.fromCharCode(event.keyCode); 
		} else {
			content = content + picClass;
		}
		
		if (content.length <= elmnt.maxLength) {
		  var picNext = elmnt.picture.charAt(content.length);
		  if (picFormatters.indexOf(picNext) < 0) {
		  	content = content + picNext;
		  }
		}
		event.srcElement.value = content;
	}
}

function ArrowHandler() {
	var elmnt = event.srcElement;
	var content = event.srcElement.value;
	var fields = event.srcElement.form.elements.length;
  var key = event.keyCode;
	var direction = 0;
	var i;
	if (elmnt.autonext == true) {
	  if (event.srcElement.value.length >= elmnt.maxLength) {
		  direction = 1;
	  }  
	}
	if (event.keyCode == 38) {
		direction = -1;
	}
	if (event.keyCode == 40) {
		direction = 1;
	}
	if (event.srcElement.type != 'text') {
		direction = 0;
	}
	if (direction == 0) {
		return;
	}
	for (i = 0; i < fields; i++) {
		if (elmnt == elmnt.form.elements[i]) {
			break;
		}
	}
  do {
  	i += direction;
	  if (i >= fields) { 
  		i = 0 
  	}
  	if (i < 0) {
		  i = fields-1;
	  }
  } while ((elmnt.form.elements[i].type == 'hidden') || (elmnt.form.elements[i].type == 'submit') || (elmnt.form.elements[i].readOnly == true));
	elmnt.form.elements[i].focus();
}

function isHidden(rbName) {
	return (getType(rbName) == 'hidden' ? true : false);
}

function getType(rbName) {
	var values = "";
	// Eerst kijken of het niet iets anders is dan een radio button
	try {
		if ( rbName.form[rbName.name].type != undefined ) {
			return rbName.form[rbName.name].type;
		}
	} catch(e) {
  }
  // Nu kijken of het aangeroepen is met een geldig object (meestal als "self")
  try {
	  var count = rbName.form[rbName.name].length;
 		return (rbName.form[rbName.name][0].type);
	} catch(e) {
  }
  // Misschien gerefereerd aan radio array naam, maar moet een item uit de array zijn om te werken
  try {
	  var count = rbName[0].form[rbName[0].name].length;
 		return (rbName[0].form[rbName[0].name][0].type);
	} catch(e) {
  }
}

function getValue(rbName) {
	var values = "";
	// Eerst kijken of het niet iets anders is dan een radio button
	try {
		if ( rbName.form[rbName.name].value != undefined ) {
			return rbName.form[rbName.name].value;
		}
	} catch(e) {
  }
  // Nu kijken of het aangeroepen is met een geldig object (meestal als "self")
  try {
	  var count = rbName.form[rbName.name].length;
	  for (var t = 0; t < count; t++) {
  		if (rbName.form[rbName.name][t].checked) {
			  values += rbName.form[rbName.name][t].value;
		  }
	  }
  	return values;
	} catch(e) {
  }
  // Misschien gerefereerd aan radio array naam, maar moet een item uit de array zijn om te werken
  try {
	  var count = rbName[0].form[rbName[0].name].length;
	  for (var t = 0; t < count; t++) {
  		if (rbName[0].form[rbName[0].name][t].checked) {
			  values += rbName[0].form[rbName[0].name][t].value;
		  }
	  }
  	return values;
	} catch(e) {
  }
}

function isRadioChecked(rbName) {
        if (rbName.form[rbName.name].checked) return true; //als het 1 radiobutton is is het geen array 
	var count = rbName.form[rbName.name].length;
	for (var t = 0; t < count; t++) {
		if (rbName.form[rbName.name][t].checked) {
			return true;
		}
	}
	return false;
}

function checkResult(rbName) {
        if (rbName.form[rbName.name].checked) return true; //als het 1 radiobutton is is het geen array 
	var count = rbName.form[rbName.name].length;
	for (var t = 0; t < count; t++) {
		if (rbName.form[rbName.name][t].checked) {
		  var u = eval("rbName.form['field[Resultaat]'][t].value");
		  if (rbName.form['field[Aantal]']){
    	         	  if (u =='C' && rbName.form['field[Aantal]'][0] && rbName.form['field[Aantal]'][0].checked) return false;
    	         	  if (u =='C' && rbName.form['field[Bedrag]'] && parseFloat(rbName.form['field[Bedrag]'].value)>0) return false;
    	         	  if (u =='H' && rbName.form['field[Aantal]'][0] && rbName.form['field[Aantal]'][0].checked) return false;
    	         	  if (u =='N' && rbName.form['field[Aantal]'][1] && rbName.form['field[Aantal]'][1].checked) return false;
    	         	  if (u =='N' && rbName.form['field[Aantal]'][2] && rbName.form['field[Aantal]'][2].checked) return false;
    	         	  if (u =='N' && rbName.form['field[Aantal]'][3] && rbName.form['field[Aantal]'][3].checked) return false;
    	         	  if ((u =='X' || u=='B') && rbName.form['field[Aantal]'][1] && rbName.form['field[Aantal]'][1].checked) return false;
    	         	  if ((u =='X' || u=='B') && rbName.form['field[Aantal]'][2] && rbName.form['field[Aantal]'][2].checked) return false;
    	         	  if ((u =='X' || u=='B') && rbName.form['field[Aantal]'][3] && rbName.form['field[Aantal]'][3].checked) return false;
    	         	  if ((u =='X' || u=='B') && rbName.form['field[Aantal]'][4] && rbName.form['field[Aantal]'][4].checked) return false;
    	         	  if ((u =='X' || u=='B') && rbName.form['field[Aantal]'][5] && rbName.form['field[Aantal]'][5].checked) return false;
		  }
		  return true;
		}
	}
	return false;
}


function iterate(obj, rbName, func) {
	if (!(obj.form[rbName].length)) {
	  eval("obj.form['" + rbName + "']." + func);
        } else {
	  var count = obj.form[rbName].length;
	  for (var t = 0; t < count; t++) {
	        eval("obj.form['" + rbName + "'][t]." + func);
	  }
	}
}

function DisableValidate(obj) {
	for (var v = 1; v < DisableValidate.arguments.length; v++) {
		if (obj.form[DisableValidate.arguments[v]].length && obj.form[DisableValidate.arguments[v]][0].type == 'radio') {
			iterate(obj,DisableValidate.arguments[v],"venabled = 0");
		} else {
		  eval("obj.form['" + DisableValidate.arguments[v] + "'].venabled = 0");
		}
	}
}

function EnableValidate(obj) {
	for (var v = 1; v < EnableValidate.arguments.length; v++) {
		if (obj.form[EnableValidate.arguments[v]].length && obj.form[EnableValidate.arguments[v]][0].type == 'radio') {
			iterate(obj,EnableValidate.arguments[v],"venabled = 1");
		} else {
		  eval("obj.form['" + EnableValidate.arguments[v] + "'].venabled = 1");
		}
	}
}


function DisableValidateAll(obj) {
	for (var v = 0; v < obj.form.length; v++) {
		if (obj.form.elements[v].type=='radio' && obj.form.elements[v].name!='field[Resultaat]'){
			iterate(obj,obj.form.elements[v].name,"venabled = 0");
		} else {
		  eval("obj.form['" + obj.form.elements[v].name + "'].venabled = 0");
		}
	}
}

function EnableValidateAll(obj) {
	for (var v = 0; v < obj.form.length; v++) {
		if (obj.form.elements[v].type=='radio' && obj.form.elements[v].name!='field[Resultaat]'){
			iterate(obj,obj.form.elements[v].name,"venabled = 1");
		} else {
		  eval("obj.form['" + obj.form.elements[v].name + "'].venabled = 1");
		}
	}
}


// Uppercase alpha keycodes
function keyUppercase() {
	if (event.keyCode >= 97 && event.keyCode <= 122) {
		event.keyCode = event.keyCode - 32;
	}
}

// Lowercase alpha keycodes
function keyLowercase() {
	if (event.keyCode >= 65 && event.keyCode <= 90) {
		event.keyCode = event.keyCode + 32;
	}
}


function isKeyDigit() {
	var digits = "0123456789";
  return digits.indexOf(String.fromCharCode(event.keyCode)); 
}

function isKeyLowerCase() {
  var lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
  return lowercaseLetters.indexOf(String.fromCharCode(event.keyCode)); 
}


function isKeyUpperCase() {
  var uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return uppercaseLetters.indexOf(String.fromCharCode(event.keyCode)); 
}

function NoRefresh() {
  var key = event.keyCode;
  if (key == 116) {
  	event.returnValue = false;
  	event.keyCode = 0;
  	alert("Het is niet toegestaan deze pagina te verversen!");
  }
}


function get_address(pc, st, wp) {  

  var sSOAPRequest = "";
  var sURL = "/postcode/get_address.php";
  var e;

  if (window.XMLHttpRequest){
   var httpObj = new XMLHttpRequest()
  }
  else 
  {
   if (window.ActiveXObject){
    var httpObj = new ActiveXObject("Microsoft.XMLHTTP");
   }
  }
  
  httpObj.open ("POST",sURL,true);
  httpObj.setRequestHeader("Content-Type","text/xml");
  httpObj.setRequestHeader("Cache-Control","no-cache");

  if (pc.length==6)
  sSOAPRequest='<request><postcode>'+pc.substring(0,4)+pc.substring(4,6)+'</postcode></request>';
  else
  sSOAPRequest='<request><postcode>'+pc.substring(0,4)+pc.substring(5,7)+'</postcode></request>';

  httpObj.onreadystatechange = function() 
  { 
	if (httpObj.readyState == 4) { 
		if (httpObj.status == 200) { 
			e = httpObj.responseText.split(';');

			if (e[0]=='') {
				alert('Postcode niet gevonden!'); 
			}
			else
			{ 
				st.value = e[0]; 
				wp.value = e[1]; 
			} 

		} 
		else 
		{ 
			alert('Probeer opnieuw'); 
		} 
	}
  };

  try {
    httpObj.send(sSOAPRequest);
  } catch(e) {
    alert(e);
    alert(e.description);
  }

}

function get_address_strict(pc, hsn, st, wp) {  

  var sSOAPRequest = "";
  var sURL = "/postcode/get_address_strict.php";
  var e;

  if (window.XMLHttpRequest){
   var httpObj = new XMLHttpRequest()
  }
  else 
  {
   if (window.ActiveXObject){
    var httpObj = new ActiveXObject("Microsoft.XMLHTTP");
   }
  }
  
  httpObj.open ("POST",sURL,true);
  httpObj.setRequestHeader("Content-Type","text/xml");
  httpObj.setRequestHeader("Cache-Control","no-cache");

  if (pc.length==6)
  sSOAPRequest='<request><postcode>'+pc.substring(0,4)+pc.substring(4,6)+'</postcode><hsn>'+hsn+'</hsn></request>';
  else
  sSOAPRequest='<request><postcode>'+pc.substring(0,4)+pc.substring(5,7)+'</postcode><hsn>'+hsn+'</hsn></request>';

  httpObj.onreadystatechange = function() 
  { 
	if (httpObj.readyState == 4) { 
		if (httpObj.status == 200) { 
			e = httpObj.responseText.split(';');

			if (e[0]=='') {
				alert('Postcode/huisnummer niet gevonden!'); 
			}
			else
			{ 
				st.value = e[0]; 
				wp.value = e[1]; 
			} 

		} 
		else 
		{ 
			alert('Probeer opnieuw'); 
		} 
	}
  };

  try {
    httpObj.send(sSOAPRequest);
  } catch(e) {
    alert(e);
    alert(e.description);
  }

}

function isValidDate(dateStr) {
  var datePat = /^(\d{1,2})(\/|-)(\d{1,2})\2(\d{4})$/; // requires 4 digit year
                                                                            
  var matchArray = dateStr.match(datePat); // is the format ok?
  if (matchArray == null) {
    return false;
  }
  month = matchArray[3]; // parse date into variables
  day = matchArray[1];
  year = matchArray[4];
  if (month < 1 || month > 12) { // check month range
    return false;
  }
  if (day < 1 || day > 31) {
    return false;
  }
  if ((month==4 || month==6 || month==9 || month==11) && day==31) {
    return false;
  }
  if (month == 2) { // check for february 29th
    var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
    if (day>29 || (day==29 && !isleap)) {
      return false;
    }
  }
  return true;
}

function dateDiff(dateStr) {
  date1 = new Date();
  date2 = new Date();
  diff  = new Date();
  if (isValidDate(dateStr.value) ) { // Validates second date 

    var datePat = /^(\d{1,2})(\/|-)(\d{1,2})\2(\d{4})$/; // requires 4 digit year

    var matchArray = dateStr.value.match(datePat); // is the format ok?
    if (matchArray == null) {
      return false;
    }
    month = matchArray[3]; // parse date into variables
    day = matchArray[1];
    year = matchArray[4];

    date2temp = new Date(month + '-' + day + '-' + year + " 00:00:00");
    date2.setTime(date2temp.getTime());
  }
  else return false; // otherwise exits

  diff.setTime(Math.abs(date1.getTime() - date2.getTime()));

  var years = date1.getFullYear()-date2.getFullYear();
  var months = date1.getMonth()-date2.getMonth();
  var days = date1.getDate()-date2.getDate();
  if (months < 0) {
    years--;
  }
  if (months == 0 && days < 0) {
    years--;
  }
  
  try {
  	var id = dateStr.document.getElementById('gebc');
        id.innerHTML = "leeftijd: "+years;
  } catch (E) {
  }

  if (years < 18) {
    return false;
  } else {
    return true;
  }
  return true;
}

function isAdult(self) {
  return dateDiff(self);
}

/*

  isVerkoop
  
  Ok, deze functie heeft wat uitleg nodig zodat je hem kan aanpassen naar eigen wens.
  De bedoeling van deze functie is om te verkomen dat:
  
  - iets weggezet kan worden als verkoop terwijl er geen verkoop is
  - iets weggezet kan worden als geen verkoop terwijl er wel een verkoop is
  
  In de template wordt de functie niet aangeroepen omdat het niet een generiek iets is maar
  aan een project gerelateerd iets. Om deze check te activeren moet bij een (1!) van de 
  radiobuttons "Resultaat" in de validate functie het volgende worden gezet:
  
    validate="isRadioChecked(self) && isVerkoop(self)"

*/
function isVerkoop(self) {
	var resultaat = getValue(self);

	var npl =   getValue(self.form['field[Verkoop_npl]']);	
	var jpv =   getValue(self.form['field[Verkoop_jpv]']);
	var sbl =   getValue(self.form['field[Verkoop_sbl]']);
	var et =    getValue(self.form['field[Verkoop_et]']);

	var h_npl =   isHidden(self.form['field[Verkoop_npl]']);	
	var h_jpv =   isHidden(self.form['field[Verkoop_jpv]']);
	var h_sbl =   isHidden(self.form['field[Verkoop_sbl]']);
	var h_et =    isHidden(self.form['field[Verkoop_et]']);
	
	if (resultaat != 'C') {
    if (
	      (!h_npl && npl > 0) || 
	      (!h_jpv && jpv > 0) || 
	      (!h_sbl && sbl > 0) || 
	      (!h_et && et > 0) 
	     ) {
	     	   return false;
	       } else {
	         return true;
	       }
	}

	
	if (resultaat == 'C') {
		if ( 
	      (!h_npl && npl > 0) || 
	      (!h_jpv && jpv > 0) ||
	      (!h_sbl && sbl > 0) ||
	      (!h_et && et > 0)
	     ) { 
	     	   return true;
		     } else {
			     return false;
	       }
	}
	  
}

function checkMailAddress(elem) {
	var re = /^(([0-9a-zA-Z_.-]+\@[0-9a-zA-Z_.-]+\.[a-zA-Z]{2,3})|)$/ ;
	var str = elem.value;
    if (!str.match(re) || str == '') {  
    		return false;
    } else {
    		DisableValidate(elem, 'field[emailreden]') ;
    		return true ;
    		
    }
}

function isRadioCheckedMail(rbName) {
	var count = rbName.form[rbName.name].length;
	for (var t = 0; t < count; t++) {
		if (rbName.form[rbName.name][t].checked) {
					var waarde = document.getElementsByName('field[emailreden]')[t].value ;
					if ( waarde == "geenemail" || waarde == "wilnietgeven" ) {
							document.getElementsByName('field[Email]').value = "" ;
							DisableValidate(rbName, 'field[Email]') ;
					}
					if ( waarde == "opgegeven" ) {
							EnableValidate(rbName, 'field[Email]') ;
					}
			return true;
		}
	}
	return false;
}

//=== MAIN ===
// Fire up form handler
window.attachEvent('onload',firstFocus);




//////////////////////////////////////////////////////////////////////////////
// jQuery start

$(document).ready(function() {

    // Knop klant weigert gesprek
    // Resultaat X
    // Opmerkingen Klant weigert gesprek
    $("#knop_kwg").click(function(event) {
        $("input[name=field[Resultaat]][value=X]").attr('checked', true);
        $("textarea[name=field[Opmerkingen]]").val("Klant weigert gesprek");
	location.href += "#bottom";
    //    $("#jadus").focus();
    });

});

// jQuery end
//////////////////////////////////////////////////////////////////////////////
