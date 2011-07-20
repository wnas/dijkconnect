/***************************
*    Raamwerk validatie    *
***************************/

var MINIMUM_JAARBEDRAG      = 15;
var MINIMUM_EENMALIG_BEDRAG = 5;

$(document).ready(function(){
	// de functie doValidate verbinden aan het submit-event van alle forms
	$('form').submit(doValidate);

	// de functie initInputElement uitvoeren op elk input-element
	$(':input').each(initInputElement);

	// het submitten van forms bij klikken op buttons tegenhouden
	$('button').click(function (event) { event.preventDefault(); });

	// de border van een aantal elementen gelijkmaken
	$('.mii,.miir,.InputError,.InputOK,.FormError,.FormOK,.inputNV,.fakebutton').css('border', '2px groove #fff');
	
	// het formulier valideren (initiele validatie)
	doValidate();
});

var PIC_FORMATTERS = '09aAxX@_';

var naarBmnrGestuurd = false;

function initInputElement(i, element)
{
	$element = $(element);

	// een aantal helper-variabelen initialiseren
	$element.data('previous_validity', false);
	$element.data('previous_value',    false);
	$element.data('always_valid',      false);

	// de type van het inputveld bepalen
	var inputtype = getInputType($element);
	
	switch (inputtype)
	{
		case 'text':
		case 'password':
		case 'textarea':
		{
			$element.keypress(keyboardHandler);
			$element.keyup(doValidate);
		} break;

		case 'radio':
		case 'checkbox':
		{
			$element.removeAttr('onclick').removeAttr('onchange').click(doValidate);
			if (!$.browser.msie)
			{
				putInStylableBox($element);
			}
			var validation = $element.attr('validate');
			/*
			if (validation)
			{
				var $elements = $('[name="' + $element.attr('name') + '"]');
				$elements.attr('validate', validation);
			}
			*/
		} break;

		case 'button':
		case 'submit':
		case 'reset':
		{
			$element.click(doValidate);
		} break;
	}
}

function doValidate(event)
{
	resultHandler();
	var form_is_valid         = true;
	var first_invalid_element = null;

	$(':input').each(function (i, element)
	{
		$element = $(element);

		if ($element.attr('readonly') || $element.attr('disabled')) return true;
		if (!$element.attr('validate')) return true;

		var validation = $element.attr('validate');

		// de variabele self definieren en gelijktrekken, omdat deze in oude functieaanroepen voor kan komen
		var self = $element;

		var is_valid = false;

		// als we gemarkeerd hebben dat dit veld altijd goed ingevuld is:
		if ($element.data('always_valid') == true)
		{
			is_valid = true;
		}
		else
		{
			// als het eerste teken van het validate-attribuut een "/" is, dan is het een regex-uitdrukking
			if (validation.charAt(0) == '/')
			{
				// regex-validatie
				is_valid = getVal($element).match(eval(validation)) !== null;
			}
			else
			{
				is_valid = eval(validation);
			}
			
			if (is_valid != $element.data('previous_validity') || getVal($element) !== $element.data('previous_value'))
			{
				$element.data('previous_validity', is_valid);
				$element.data('previous_value',    getVal($element));
				if      (is_valid  && $element.attr('onvalid'))   eval($element.attr('onvalid'));
				else if (!is_valid && $element.attr('oninvalid')) eval($element.attr('oninvalid'));
			}
		}

		if (is_valid == true)
		{
			getStylableElements($element).removeClass('InputError').addClass('InputOK');
		}
		else
		{
			// als dit $element niet goed is ingevuld, dan is het hele formulier niet goed ingevuld
			//   als het het eerste niet goed ingevulde $element is, de naam onthouden voor later
			if (form_is_valid)
			{
				first_invalid_element = $element.attr('name');
			}
			form_is_valid = false;
			getStylableElements($element).removeClass('InputOK').addClass('InputError');
		}
	});

	if (form_is_valid)
	{
		$('input[type=submit]').removeClass('FormError').addClass('FormOK');
	}
	else
	{
		$('input[type=submit]').removeClass('FormOK').addClass('FormError');
	}

	if (event && event.type == 'submit')
	{
		if (!form_is_valid)
		{
			alert('Het veld ' + first_invalid_element + ' is nog niet goed ingevuld');
			event.preventDefault();
		}
		else
		{
			CallsheetServer.beforeSubmit();
		}
	}
}

function keyboardHandler(event)
{
	var element = event.target;
	var content = element.value;
	var key = event.which;

	if (key <= 31) return;

	if (content.length >= element.maxLength)
	{
		return;
	}
	var picture = $(element).attr('picture');
	if (!picture) return;

	var picture_is_okay = true;
	var picture_class = picture.charAt(element.value.length);
	event.preventDefault();
	switch (picture_class)
	{
		case '9' : if (isDigit(key) == -1) { picture_is_okay = false; return; }; break;
		case 'x' : if (isUpperCase(key) != -1) { key = keyLowerCase(key); } if (isLowerCase(key) == -1) { picture_is_okay = false; return; }; break;
		case 'X' : if (isLowerCase(key) != -1) { key = keyUpperCase(key); } if (isUpperCase(key) == -1) { picture_is_okay = false; return; }; break;
		case 'a' : if (isUpperCase(key) != -1) { key = keyLowerCase(key); } break;
		case 'A' : if (isLowerCase(key) != -1) { key = keyUpperCase(key); } break;
	}
	if (PIC_FORMATTERS.indexOf(picture_class) < 0)
	{
		picture_is_okay = false;
	}
	if (picture_is_okay)
	{
		content = content + String.fromCharCode(key);
	} else {
		content = content + picture_class;
	}

	if (content.length <= element.maxLength)
	{
		var picNext = picture.charAt(content.length);
		if (PIC_FORMATTERS.indexOf(picNext) < 0)
		{
			content = content + picNext;
		}
	}
	element.value = content;
}

function getInputType($element)
{
	if ($element.length == 0) return false;
	return $element.get(0).tagName.toLowerCase() == 'input' ? $element.attr('type').toLowerCase() : $element.get(0).tagName.toLowerCase();
}

function putInStylableBox($element)
{
	$element.removeClass('mii');
	$element.css('line-height', '100%');
	$element.wrap('<span class="mii" style="padding: 0 1px 0 1px;"></span>');
	$element.parent().parent().css('padding', '0');
	$element.css('margin', '0');
}

function getStylableElements($element)
{
	var $elements = $('[name="' + $element.attr('name') + '"]');

	if (!$.browser.msie && ($element.attr('type') == 'radio' || $element.attr('type') == 'checkbox'))
	{
		$elements = $elements.parent();
	}
	return $elements;
}

function isDigit(key)
{
	var digits = '0123456789';
	return digits.indexOf(String.fromCharCode(key));
}

function isLowerCase(key)
{
	var lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
	return lowercaseLetters.indexOf(String.fromCharCode(key));
}


function isUpperCase(key)
{
	var uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	return uppercaseLetters.indexOf(String.fromCharCode(key));
}

function keyUpperCase(key)
{
	if (key >= 97 && key <= 122)
	{
		key = key - 32;
	}
	return key;
}

function keyLowerCase(key)
{
	if (key >= 65 && key <= 90)
	{
		key = key + 32;
	}
	return key;
}


/********************************
*    Implementatie validatie    *
********************************/

function getFieldVal(name)
{
	var $elements = $('[name="field[' + name + ']"]');
	var inputtype = getInputType($elements);
	
	var waarde = (inputtype == 'checkbox' || inputtype == 'radio') ? $elements.filter(':checked').val() : $elements.val();
	return waarde == undefined ? false : waarde;
}

function getVal($element)
{
	var $elements = $('[name="' + $element.attr('name') + '"]');
	var inputtype = getInputType($elements);
	
	var waarde = (inputtype == 'checkbox' || inputtype == 'radio') ? $elements.filter(':checked').val() : $elements.val();
	return waarde == undefined ? false : waarde;
}

var previous_result;

function resultHandler()
{
	var result = getFieldVal('Resultaat');

	if (result == previous_result) {
		return;
	} else {
		previous_result = result;
	}
	
	if (!result) return;

	switch (result)
	{
		case 'C':
		case 'H':
		{
			EnableValidateAll();
			DisableValidate('Terugbeldatum', 'Terugbeltijd');
		} break;

		case 'N':
		{
			EnableValidateAll();
			DisableValidate('Terugbeldatum', 'Terugbeltijd', 'Aantal');
		} break;

		case 'B':
		case 'M':
		{
			DisableValidateAll();
			EnableValidate('Terugbeldatum', 'Terugbeltijd', 'Telefoon');
		} break;

		default:
		{
			DisableValidateAll();
		}
	}
	periodeHandler();

	if (bIsBMNR)
	{
		if (niet_naar_bmn_vrs_bij_resultaten.indexOf(result) != -1)
		{
			toonKlaarknop(true);
		}
		else if ($('#bmn_vrs_knop:hidden').length == 1 && !naarBmnrGestuurd)
		{
			toonVRSKnop();
		}
	}
	
	doValidate();
}

function EnableValidateAll()
{
	$(':input').each(function (i, element) { $(element).data('always_valid', false); });
}

function DisableValidateAll()
{
	$(':input').each(function (i, element) { $(element).data('always_valid', true); });
}

function EnableValidate()
{
	$.each(EnableValidate.arguments, function (i, element) { $('[name="field['+element+']"]').data('always_valid', false); });
}

function DisableValidate()
{
	$.each(DisableValidate.arguments, function (i, element) { $('[name="field['+element+']"]').data('always_valid', true); });
}

function stuurknop(functie,variable,agent)
{
	$('#bmn_vrs_knop').hide();
	naarBmnrGestuurd = true;
	$.post("knopscript.php?agent="+agent+"&functie="+functie+"&var="+variable);
}

function toonKlaarknop(komt_vanuit_doValidate)
{
	if (!komt_vanuit_doValidate) naarBmnrGestuurd = true;
	if (bIsBMNR == false) return false;

	$('#klaarknop').show();
	$('#bmn_vrs_knop').hide();
	$('#btekst').hide();
}

function toonVRSKnop()
{
	if (naarBmnrGestuurd) return false;
	if (bIsBMNR == false) return false;

	$('#klaarknop').hide();
	$('#bmn_vrs_knop').show();
	$('#btekst').show();
}

function TrackCount(fieldObj, countFieldName, maxChars)
{
}

function LimitText(fieldObj, maxChars)
{
}

function isRadioChecked(element)
{
	return $('[name="' + element.attr('name') + '"]').filter(':checked').length > 0;
}

function isAdult(element)
{
	var waarde = element.val();

	date1 = new Date();
	date2 = new Date();
	diff  = new Date();

	var matchArray = waarde.match(/^(\d{1,2})(\/|-)(\d{1,2})\2(\d{4})$/);
	if (matchArray == null) return false;

	month = matchArray[3];
	day   = matchArray[1];
	year  = matchArray[4];

	date2temp = new Date(month + '/' + day + '/' + year + ' 00:00:00');
	date2.setTime(date2temp.getTime());

	diff.setTime(Math.abs(date1.getTime() - date2.getTime()));

	var years  = date1.getFullYear() - date2.getFullYear();
	var months = date1.getMonth()    - date2.getMonth();
	var days   = date1.getDate()     - date2.getDate();
	if (months < 0)
	{
		years--;
	}
	if (months == 0 && days < 0)
	{
		years--;
	}

	return (years < 18) ? false : true;
}

function isVerkoop()
{
	var resultaat = getFieldVal('Resultaat');

	var aantal = getFieldVal('Aantal');
	var npl    = getFieldVal('Verkoop_npl');
	var jpv    = getFieldVal('Verkoop_jpv');
	var sbl    = getFieldVal('Verkoop_sbl');
	var et     = getFieldVal('Verkoop_et') == 'J';

	var verkoopresultaat = resultaat == 'C';
	var loten_aangeklikt = aantal > 0 || npl > 0 || jpv > 0 || sbl > 0 || et > 0;

	if (resultaat && verkoopresultaat == loten_aangeklikt)  return true;

	return false;
}

function checkResult()
{
	var resultaat = getFieldVal('Resultaat');
	if (resultaat == false) return false;
	
	return isVerkoop() || checkBedrag();
}

function vulVoicelogIn()
{
	var aantal = getFieldVal('Aantal');
	setVoicelogVeld('aantal', aantal);

	var naam   = getFieldVal('Voorletters') + ' ' + getFieldVal('Tussenvoegsels') + ' ' + getFieldVal('Achternaam');
	setVoicelogVeld('naam', naam);

	var rekno  = getFieldVal('Rekeningnummer');
	setVoicelogVeld('rekeningnummer', rekno);

	var aantal_npl = getFieldVal('Verkoop_npl');
	setVoicelogVeld('nplloten', aantal_npl);
	$('#nplloten').css('display', (aantal_npl > 0) ? 'block' : 'none');

	var aantal_vl  = getFieldVal('Verkoop_sbl');
	setVoicelogVeld('vlloten',  aantal_vl);
	setVoicelogVeld('slloten',  aantal_vl);
	$('#vlloten').css('display',  (aantal_vl > 0) ? 'block' : 'none');
}

function setVoicelogVeld(naam, inhoud)
{
	$.each({1: '#vl_'}, function (key, prefix)
	{
		var $element = $(prefix + naam);
		$element.html(inhoud);
		if ($element.parent().next().length && $element.parent().next().get(0).tagName && $element.parent().next().get(0).tagName.toLowerCase() == 'font')
		{
			if ($element.parent().next().html().match(/\[.+\]/))
			$element.parent().next().html('');
		}
	});
}

function vulvoicelog()
{
	return vulVoicelogIn();
}

function vulVoicelog()
{
	return vulVoicelogIn();
}

function get_address_strict()
{
	var url = '/postcode/get_address_strict.php';
	var postcode   = getFieldVal('Postcode');
	var huisnummer = getFieldVal('Huisnummer');

	var request    = '<request><postcode>' + postcode + '</postcode><hsn>' + huisnummer + '</hsn></request>';

	$.ajax({
		url:         url,
		type:        'POST',
		contentType: 'text/xml',
		processData: false,
		data:        request,
		success:     function (reply) {
			var delen = reply.split(';');

			$('[name="field[Straatnaam]"]').val(delen[0]);
			$('[name="field[Woonplaats]"]').val(delen[1]);
		}
	});
}

function elfproef(element)
{
	var waarde = element.val();
	var lengte = waarde.length;

	// Allemaal fout: lege waardes, de waarde '0', waardes van lengte 8, of lengte 11 en meer
	if (lengte == 0 || lengte == 8 || lengte >= 11 || waarde == 0)
	{
		return false;
	}

	// Overige waardes met een lengte van 7 of minder zijn goed (voormalige Postbank-gironummers)
	if (lengte <= 7)
	{
		return true;
	}

	var totaal = 0;
	for (var i = 0; i < lengte; ++i)
	{
		getal = waarde.substr(i, 1);
		totaal += getal * (9 - i);
	}

	// Als dit totaal schoon deelbaar is door 11, dan is het een geldig rekno

	return (totaal % 11 == 0);
}

function isValidDate(dateStr)
{
	var datePat = /^(\d{1,2})(\/|-)(\d{1,2})\2(\d{4})$/;
	var matchArray = dateStr.match(datePat);

	if (matchArray == null) {
		return false;
	}

	var month = matchArray[3];
	var day  = matchArray[1];
	var year = matchArray[4];

	if (month < 1 || month > 12) {
		return false;
	}
	if (day < 1 || day > 31) {
		return false;
	}
	if ((month == 4 || month == 6 || month == 9 || month == 11) && day == 31) {
		return false;
	}
	if (month == 2) {
		var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
		if (day > 29 || (day == 29 && !isleap)) {
			return false;
		}
	}
	return true;
}

function checkBedrag()
{
	var periode = getFieldVal('Periode');
	if (periode == false) return false;
	var bedrag  = getFieldVal('Bedrag')
	if (periode == 'F' && bedrag == '') return true;
	if (periode == 'F' && bedrag !== '') return false;
	if (bedrag == false) return false;
	bedrag = bedrag.replace(/,/g, '.');

	if (
		   (periode == 'A' && 12 * bedrag < MINIMUM_JAARBEDRAG)
		|| (periode == 'B' &&  4 * bedrag < MINIMUM_JAARBEDRAG)
		|| (periode == 'C' &&  2 * bedrag < MINIMUM_JAARBEDRAG)
		|| (periode == 'D' &&  1 * bedrag < MINIMUM_JAARBEDRAG)
		|| (periode == 'E' && bedrag < MINIMUM_EENMALIG_BEDRAG)
	)
	{
		return false;
	}
	
	return true;
}

function isRadioCheckedMail()
{
	var waarde = getFieldVal('emailreden');

	if (waarde == 'geenemail' || waarde == 'wilnietgeven')
	{
		$('[name="field[Email]"]').val('');
		DisableValidate('Email');
	}
	else if (waarde == 'opgegeven')
	{
		EnableValidate('Email');
	}
	return true;
}

function periodeHandler()
{
	var periode = getFieldVal('Periode');
	
	if (!periode) return;

	switch (periode)
	{
		case 'G':
		case 'I':
		case 'F':
		{
			DisableValidate('Rekeningnummer', 'Bedrag');
		} break;

		default:
		{
			EnableValidate('Rekeningnummer', 'Bedrag');
		} break;
	}
	doValidate();
}
