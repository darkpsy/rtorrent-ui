plugin.loadLang();
plugin.loadMainCSS();

plugin.setValue = function( full, free )
{
        var percent = iv(full ? (full-free)/full*100 : 0);
        if(percent>100)
	        percent = 100;
	$("#meter-disk-value").width( percent+"%" ).css( { "background-color": (new RGBackground()).setGradient(this.prgStartColor,this.prgEndColor,percent).getColor(),
		visibility: !percent ? "hidden" : "visible" } );
	$("#meter-disk-text").text(percent+'%');
	$("#meter-disk-td").prop("title", theConverter.bytes(free)+"/"+theConverter.bytes(full));

	if($.noty && plugin.allStuffLoaded)
	{
		if((free<plugin.notifySpaceLimit) && !plugin.noty)
			plugin.noty = $.noty(
			{
				text: theUILang.diskNotification, 
				layout : 'bottomLeft',
				type: 'error',
				timeout : false,
				closeOnSelfClick: false
			});
		if((free>plugin.notifySpaceLimit) && plugin.noty)
		{
			$.noty.close(plugin.noty);
			plugin.noty = null;
		}
	}
}

plugin.init = function() {
	if(getCSSRule("#meter-disk-holder")){
		plugin.prgStartColor = new RGBackground("#a6e22d");
		plugin.prgEndColor = new RGBackground("#c61152");
		plugin.addPaneToStatusbar( "meter-disk-td", 
			$("<div>").attr("id","meter-disk-holder")
				.append($('<svg xmlns="http://www.w3.org/2000/svg" class="tfavicon" width="24" height="24" viewBox="0 0 24 24"><path d="M2 20h20v-4h-20v4zm2-3h2v2h-2v-2zm-2-13v4h20v-4h-20zm4 3h-2v-2h2v2zm-4 7h20v-4h-20v4zm2-3h2v2h-2v-2z"/></svg>'))
				.append( $("<span></span>").attr("id","meter-disk-text").css({overflow: "visible"}) )
				.append( $("<div>").attr("id","meter-disk-value").css({ visibility: "hidden", float: "left" }).width(0).html("&nbsp;") ).get(0) );

		plugin.check = function(){
			var AjaxReq = jQuery.ajax(
			{
				type: "GET",
				timeout: theWebUI.settings["webui.reqtimeout"],
				async : true,
				cache: false,
				url : "plugins/diskspace/action.php",
				dataType : "json",
				cache: false,
				success : function(data)
				{
					plugin.setValue( data.total, data.free );
				},
				complete : function(jqXHR, textStatus)
				{
					plugin.diskTimeout = window.setTimeout(plugin.check,plugin.interval*1000);
				}
			});
		};
		plugin.check();
		plugin.markLoaded();
	}
	else
		window.setTimeout(arguments.callee,500);
};

plugin.onRemove = function()
{
	plugin.removePaneFromStatusbar("meter-disk-td");
	if(plugin.diskTimeout)
	{
		window.clearTimeout(plugin.diskTimeout);
		plugin.diskTimeout = null;
	}
}

plugin.init();