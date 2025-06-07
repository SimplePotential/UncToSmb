const prefix = "smb:\/\/";

// Capture the Enter key on the UNC box so we can call the conversion without click the button.
document.getElementById("txtUNC").addEventListener("keydown", (event)=>{
	if(event.key === 'Enter')
	{
		UncToMac();
		return false;
	}
});

/*
	Converts a Windows UNC path prefix with file:/// and/or \\
	into a MAC compatible SMB path.
*/
function UncToMac()
{
	let finalValue = "";
	
	// Obtain the UNC path.
	finalValue = document.getElementById("txtUNC").value;
	
	// If the UNC path was empty, do nothing and return.
	if(finalValue.trim().length == 0){ document.getElementById("main-form-form").reset(); return; }
	
	// Check the potentail UNC path prefixs and remove them.
	if(finalValue.substr(0,8) == "file:///"){ finalValue = finalValue.substr(8, finalValue.length) }
	if(finalValue.substr(0,2) == "\\\\"){ finalValue = finalValue.substr(2, finalValue.length) }
	if(finalValue.substr(0,1) == "\\"){ finalValue = finalValue.substr(1, finalValue.length) }
	
	// Replace backslash with forward slashes
	finalValue = finalValue.replace(/\\/g, "/");
	
	/*
	if(document.getElementById("chkSpaces").checked === true)
	{
		// Replace backslash with forward slashes
		finalValue = finalValue.replace(/ /g, "\\ ");
	}
	*/

	// Check if we want to escape spaces
	switch(document.getElementById("cboEscape").value)
	{
		case 'escape-1': // Escape with %20 such as for a URL, most of my test users needed this method.
			finalValue = finalValue.replace(/ /g, "%20");
			break;
		case 'escape-2': // Escape with standard backslash, some users had better luck with this method.
			finalValue = finalValue.replace(/ /g, "\\ ");
			break;
		default: // Do not escape spaces at all.
			finalValue = finalValue;
	}
	
	// Build the final SMB path
	finalValue = `${prefix}${finalValue}`;
	
	// Populate the result on the UI
	document.getElementById("txtSMB").value = finalValue;
	
	// Select the result and copy it to the clipboard if available.
	SelectAll(document.getElementById("txtSMB"));
	CopyToClipboard(document.getElementById("txtSMB").value);
}

/*
	Select all the text for a given text input.
	
	Parameters:
		obj - Form text input object.
		
	Returns
		true on success, false on fail.
*/
function SelectAll(obj)
{
	if(!obj.select){ return false; }
	obj.focus();
	obj.select();
	return true;
}

/*
	Copy the given value to the clipboard.
	
	Parameters:
		value - The value to place on the clipboard, could be any text or object type.
*/
function CopyToClipboard(value)
{
	// If clipboard available, copy results to the clipboard and display text that it occurred.
	if(navigator.clipboard)
	{
		navigator.clipboard.writeText(value).then(function() {
			document.getElementById("main-form-status").innerHTML = "SMB Link Copied to Clipboard";
		}, function(e){
			ClearStatus();
		});
	}
	else
	{
		ClearStatus();
	}
}

/*
	Clears the Status display.
*/
function ClearStatus()
{
	document.getElementById("main-form-status").innerHTML = "&nbsp;";
}