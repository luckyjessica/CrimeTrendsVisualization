function display(){
var margin = {top: 100, right: 100, bottom: 0, left: 0},
    width = 950,
    height = 250;
	var j;
	var xDomain = [];
	for(j = 0; j<50; j++){
	xDomain[j] = j;
	}
	var yDomain=[0,1,2,3,4,5,6,7,8,9,10,11];
var x = d3.scale.ordinal().domain(xDomain).rangeBands([0, width]),
	y = d3.scale.ordinal().domain(yDomain).rangeBands([0, height]),
    z = d3.scale.threshold().range(["#f6cece","#f78181","#fa5858","#fe2e2e","#ff0000"]);

var svg = d3.select(".graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	

d3.tsv("data/Monthtoward/month-ward13.tsv", function(error, data) {
  var matrix = [];
  var i;
  for(i = 0; i<data.length; i++){
  matrix[i] = valuesToArray(data[i]);
  }
  
   var min = min(matrix);
   var max = max(matrix);

   z.domain([min+(max-min)/5,min+(max-min)/5*2,min+(max-min)/5*3,min+(max-min)/5*4]);
   svg.append("text")
   .attr("transform","translate(-10,-20)")
   .text("Ward")
   	  
 svg.append("line")
	.attr("x2", width)
	.attr("transform","translate(0,"+height+")");

 svg.append("line")
	.attr("x2", height)
	.attr("transform","translate("+width+",0)rotate(90)");

  var row = svg.selectAll(".row")
      .data(matrix)
    .enter().append("g")
      .attr("class", "row")
      .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; })
      .each(row);

  row.append("line")
      .attr("x2", width);

  row.append("text")
      .attr("x", -6)
      .attr("y", x.rangeBand() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "end")
			.style("cursor","default")
      .text(function(d, i) { return data[i].month; })
	  .style("font-size","10px");

  var column = svg.selectAll(".column")
      .data(matrix[0])
    .enter().append("g")
      .attr("class", "column")
      .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

  column.append("line")
      .attr("x1", -width);

  column.append("g")
		.attr("transform","rotate(90)translate(0,-17)")
		.append("text")
      .attr("x", 6)
      .attr("y", x.rangeBand() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "start")
      .text(function(d, i) { return (i+1); })
	  .style("font-size","11px");

  function row(row) {
    var cell = d3.select(this).selectAll(".cell")
        .data(row)
      .enter().append("rect")
        .attr("class", "cell")
		.attr("x", function(d,i) { return x(i); })
        .attr("width", x.rangeBand())
        .attr("height", y.rangeBand())
        .style("fill", function(d) {  return z(parseInt(d)); });
  }


  function valuesToArray(obj) {
  var result = Object.keys(obj).map(function (key) { return obj[key]; });
  result.splice(0,1);
  return result;
}
  function min(array){
  var minn = array[0][0];
  for(var a = 0; a < array.length; a++){
    for(var b = 0; b < array[a].length; b++){
	if(parseInt(array[a][b])<parseInt(minn)){
	minn = array[a][b];
	}
	}
  }
  return parseInt(minn);
  }
  
    function max(array){
  var maxx = array[0][0];
  for(var a = 0; a < array.length; a++){
    for(var b = 0; b < array[a].length; b++){
	if(parseInt(array[a][b])>parseInt(maxx))
	maxx = array[a][b];
	}
  }
  return parseInt(maxx);
  }

});
}