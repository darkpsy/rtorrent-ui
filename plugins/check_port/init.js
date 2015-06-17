plugin.loadLang();
plugin.loadMainCSS();

plugin.update = function()
{
	$$("port-td").className = "statuscell pstatus0";
	theWebUI.request("?action=portcheck", [plugin.getPortStatus, plugin]);
}

plugin.getPortStatus = function(d)
{
	$("#port-td").prop("title",d.port+": "+theUILang.portStatus[d.status]).get(0).className = "statuscell pstatus"+d.status;
	switch(d.status){
		case 0: 
			$('#port-holder').html('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="tfavicon yellow"><path d="M18 8h-1v-2c0-2.76-2.24-5-5-5s-5 2.24-5 5v2h-1c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-10c0-1.1-.9-2-2-2zm-6-5.1c1.71 0 3.1 1.39 3.1 3.1v2h-6.1v-2h-.1c0-1.71 1.39-3.1 3.1-3.1zm6 17.1h-12v-10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>');
		break;
		case 1: 
			$('#port-holder').html('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="tfavicon red"><path d="M18 8h-1v-2c0-2.76-2.24-5-5-5s-5 2.24-5 5v2h-1c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9h-6.2v-2c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>');
		break;
		case 2:
			$('#port-holder').html('<svg xmlns="http://www.w3.org/2000/svg" class="tfavicon green" width="24" height="24" viewBox="0 0 24 24"><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1v-2c0-2.76-2.24-5-5-5s-5 2.24-5 5h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2h-9.1c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-10c0-1.1-.9-2-2-2zm0 12h-12v-10h12v10z"/></svg>');
		break;
	}
}

rTorrentStub.prototype.portcheck = function()
{
	this.contentType = "application/x-www-form-urlencoded";
	this.mountPoint = "plugins/check_port/action.php";
	this.dataType = "json";
}

plugin.createPortMenu = function(e)
{
  if(e.which==3){
		theContextMenu.clear();
		theContextMenu.add([ theUILang.checkPort,  plugin.update ]);
		theContextMenu.show();
	}
	return(false);
}

plugin.onLangLoaded = function()
{
	plugin.addPaneToStatusbar("port-td", $('<div id="port_holder"><svg xmlns="http://www.w3.org/2000/svg" class="tfavicon green" width="24" height="24" viewBox="0 0 24 24"><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1v-2c0-2.76-2.24-5-5-5s-5 2.24-5 5h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2h-9.1c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-10c0-1.1-.9-2-2-2zm0 12h-12v-10h12v10z"/></svg></div>').attr("id","port-holder"), 2);
	if(plugin.canChangeMenu())
		$("#port-td").addClass("pstatus0").mouseclick( plugin.createPortMenu );
	plugin.update();
}

plugin.onRemove = function()
{
	plugin.removePaneFromStatusbar("port-td");
}
