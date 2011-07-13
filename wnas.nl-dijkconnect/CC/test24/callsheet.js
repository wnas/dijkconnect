function DummyCommandForDebug()
{
  alert("Hallo...."); 
  return;
}

function DummyCommandSetFocus()
{
  alert("Set focus now...."); 
  window.focus();
  return;
}

function CheckRequiredValues()
{
  if (document.callsheet['field[Resultaat]'].selectedIndex==0)
// resultaat=maak keuze
  {
    alert("Resultaat is een verplicht veld.");
    return false;
  }
  if (document.callsheet['field[Resultaat]'].selectedIndex==1)
// resultaat=gereed
  {
    if (document.callsheet['field[Zender]'].value.length==0)
	{
      alert("Media is een verplicht veld.");
      return false;
	}
    if (document.callsheet['field[Spot]'].value.length==0)
	{
      alert("Spotje is een verplicht veld.");
      return false;
	}
    if (document.callsheet['field[Voorletters]'].value.length==0)
	{
      alert("Voorletters is een verplicht veld.");
      return false;
	}
    if (document.callsheet['field[Achternaam]'].value.length==0)
	{
      alert("Achternaam is een verplicht veld.");
      return false;
	}
    if (document.callsheet['field[Geslacht]'].value.length==0)
	{
      alert("Geslacht is een verplicht veld.");
      return false;
	}

    if (document.callsheet['field[Periode]'].selectedIndex==0)
    {
      alert("Periode is een verplicht veld.");
      return false;
    }
    if (document.callsheet['field[Periode]'].selectedIndex==5)
// accept giro
	{
      if (document.callsheet['field[Bedrag]'].value.length!=0)
  	  {
        alert("Bedrag moet leeg zijn.");
        return false;
	  }
      if (document.callsheet['field[Rekeningnummer]'].value.length!=0)
	  {
        alert("Rekeningnummer moet leeg zijn.");
        return false;
	  }
	}
	else
// overig
    {
      if (document.callsheet['field[Bedrag]'].value.length==0)
  	  {
        alert("Bedrag is een verplicht veld.");
        return false;
	  }
      if (document.callsheet['field[Rekeningnummer]'].value.length==0)
	  {
        alert("Rekeningnummer is een verplicht veld.");
        return false;
	  }
    }
  }
  return true;
}
