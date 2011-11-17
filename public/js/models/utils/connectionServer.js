YUI.add("connectionserver", function(Y)
{
	var Lang = Y.Lang;
	
	var namespace = Y.namespace("ModuleConnectionServer");


	namespace.getJSON = function(url,callback)
	{
		Y.io(url,
		     {
			on :
			{
				success : function (tx, r)
				{
					var data;

					// protected against malformed JSON response
					data = Y.JSON.parse(r.responseText);
						callback(data);
					/*	
					try
					{
						data = Y.JSON.parse(r.responseText);
						callback(data);
					}
					catch (e)
					{
						alert("JSON Parse failed!");
						return;
					}*/
				}
			}
		});
	}

}, "1.0", {requires:['io','json-parse']});