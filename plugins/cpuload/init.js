plugin.loadMainCSS()

function rLoadGraph()
{
}

rLoadGraph.prototype.create = function( aOwner )
{
	this.owner = aOwner;
	this.maxSeconds = 180;
	this.seconds = -1;
	this.load = { label: null, data: [] };
	this.startSeconds = new Date().getTime()/1000;
}


rLoadGraph.prototype.draw = function( percent )
{
	var self = this;
	$(function() 
	{
		if(self.owner.height() && self.owner.width())
		{
			clearCanvas( self.owner.get(0) );
			self.owner.empty();
			
			$.plot(self.owner, [ self.load.data ],
			{ 
				legend: 
				{
					show: false
				},
				colors:
				[
					(new RGBackground()).setGradient(plugin.prgStartColor,plugin.prgEndColor,percent).getColor()
				],
				lines:
				{
					show: true,
					lineWidth: 1,
					fill: true
				},
				points: { lineWidth: 0, radius: 0 },
				grid:
				{
					show: false
				},
				xaxis: 
				{ 
					max: (self.seconds-self.startSeconds>=self.maxSeconds) ? null : self.maxSeconds+self.startSeconds,
					noTicks: true
			 	},
				shadowSize: 0,
			  	yaxis: 
			  	{ 
			  		min: 0,
					noTicks: true
		  		}
			});
			self.owner.append( $("<div>").attr("id","meter-cpu-text").css({top: 0}).text(percent+'%') ).prop("title", percent+'%');
		}
	}
	);
}

rLoadGraph.prototype.addData = function( percent )
{
	this.seconds = new Date().getTime()/1000;
	this.load.data.push([this.seconds,percent]);
	while((this.load.data[this.load.data.length-1][0]-this.load.data[0][0])>this.maxSeconds)
		this.load.data.shift(); 
	this.draw(percent);
}

plugin.init = function()
{
	if(getCSSRule("#meter-cpu-holder"))
	{
		plugin.prgStartColor = new RGBackground("#a6e22d");
		plugin.prgEndColor = new RGBackground("#c61152");
		plugin.addPaneToStatusbar("meter-cpu-td", 
			$("<div>").attr("id","meter-cpu-holder").get(0));
		$('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="tfavicon"><path d="M15 9h-6v6h6v-6zm-2 4h-2v-2h2v2zm8-2v-2h-2v-2c0-1.1-.9-2-2-2h-2v-2h-2v2h-2v-2h-2v2h-2c-1.1 0-2 .9-2 2v2h-2v2h2v2h-2v2h2v2c0 1.1.9 2 2 2h2v2h2v-2h2v2h2v-2h2c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2zm-4 6h-10v-10h10v10z"/></svg>')
			.insertBefore($('#meter-cpu-holder'));
		plugin.graph = new rLoadGraph();
		plugin.graph.create( $("#meter-cpu-holder") );
		plugin.check = function()
		{
			var AjaxReq = jQuery.ajax(
			{
				type: "GET",
				timeout: theWebUI.settings["webui.reqtimeout"],
			        async : true,
			        cache: false,
				url : "plugins/cpuload/action.php",
				dataType : "json",
				cache: false,
				success : function(data)
				{
					plugin.graph.addData( data.load );
				}
			});
		};
		plugin.check();
		plugin.reqId = theRequestManager.addRequest( "ttl", null, plugin.check );
		plugin.markLoaded();
	}
	else
		window.setTimeout(arguments.callee,500);
};

plugin.onRemove = function()
{
	plugin.removePaneFromStatusbar("meter-cpu-td");
	theRequestManager.removeRequest( "ttl", plugin.reqId );
}

plugin.init();