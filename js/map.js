var year = 2004;		
var width = 960,
    height = 880;
      var projection_scale = [400000];
        var projection_translate = [97900.505335748254, 51700.791692685558];
		var a = [199466];
		var b = [49047.505335748254, 25762.791692685558];
		 var proj = d3.geo.mercator().translate(projection_translate)
                       .scale(projection_scale);
	var color = d3.scale.threshold()
    .domain([4000,7000,10000,13000])
    .range(["#f6cece","#f78181","#fa5858","#fe2e2e","#ff0000"]);
	
	var x = d3.scale.linear()
    .domain([0, 20000])
    .range([0, 400]);
	
	var x2 = d3.scale.linear()
    .domain([2004, 2013])
    .range([0, 845]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(13)
    .tickValues(color.domain())
	.tickFormat(d3.format(",.of"));

var path = d3.geo.path()
                 .projection(proj);
				 
var xAxis2  = d3.svg.axis()
    .scale(x2)
    .orient("bottom")
    .tickSize(13)
    .tickValues([2004,2005,2006,2007,2008,2009,2010,2011,2012,2013]);	

var svg = d3.select("div#mapChart").append("svg")
    .attr("width", width)
    .attr("height", height);
	
	
	var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(0,60)");
	
	var g2 = svg.append("g")
			.attr("class","yearaxis")
			.attr("transform", "translate(21,0)")
			.call(xAxis2);
		

		g.selectAll("rect")
		    .data(color.range().map(function(d, i) {
		      return {
		        x0: i ? x(color.domain()[i - 1]) : x.range()[0],
		        x1: i < color.domain().length ? x(color.domain()[i]) : x.range()[1],
		        z: d
		      };
		    }))
		.enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return d.x0; })
    .attr("width", function(d) { return d.x1 - d.x0; })
    .style("fill", function(d) { return d.z; });


		g.call(xAxis).append("text")
		    .attr("class", "caption")
		    .text("Statistics of crime in Chicago")
		    .attr("y", -6);
	update();
function update(){
d3.json("json/wards_2005.json", function(json) {
d3.tsv("data/Wardtototal/ward-total"+year+".tsv", function(error, data) {
			var remove = svg.selectAll(".path").remove();
      var map = svg.selectAll("path")
           .data(json.features)
           .enter()
           .append("path") 	
		   .attr("class", "path")
           .attr("d", path)
		   .attr("fill",function(d){return color(data[d.properties.WARD-1].total);})
		   .style("stroke-width",1)
		   .attr("stroke","#ffffff")
		   .append("title")
		   .text(function(d){return "Ward"+d.properties.WARD+": "+data[d.properties.WARD-1].total;});

});
});
}

 $(slider).slider({
        min: 2004, max: 2013, value: 2004, slide: function(e, ui) {
            //vis.fillStyle(color = color[this.id](ui.value)).render();
			year = ui.value;
            update();
 
          }
      });
	  var timer = undefined;
	  function playClick() {

          if (timer) {
              stop();
          } else {
              if(year == 2013) year = 2004;
              $(slider).slider('value', year);
              $(play).attr("src", "img/stop.png");
              update();
              timer = setInterval(function() {
                  year++;
                  if (year >= 2013) {
                      stop();
                  }
                  $(slider).slider('value', year);
                  update();
              }, 1000)
          }
      }
	  
	  function stop() {
          clearInterval(timer)
          timer = undefined;
          $(play).attr("src", 'img/play.png');
      }