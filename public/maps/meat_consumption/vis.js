var width = 960;
var height = 960;

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

var data = d3.map();
var india = {};


var quantize = function(min, max, len) {
  return d3.scale.linear()
    .domain([0, 3.883])
    .range([0.0, 1.0]);
};

function drawVis(item) {
  queue().
    defer(d3.json, "india.json")
    .defer(d3.csv, "consumption.csv", function(d) {
      data.set(d.id, d)
    })
    .await(function(error, data) {
      india = data;
      ready(error, item)
    });
}


var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


function ready(error, item) {
  if (error) return console.error(error);
  svg.selectAll("*").remove();

  var subunits = topojson.feature(india, india.objects.states);

  var projection = d3.geo.mercator()
    .center([83, 22.5])
    .scale(1100)
    .translate([width / 2, height * 1 / 3]);

  var path = d3.geo.path()
    .projection(projection);


  var ids = data.keys();

  var maxValue = d3.max(ids, function(id) {
    return data.get(id)[item];
  });

  var minValue = d3.min(ids, function(id) {
    return data.get(id)[item];
  });


  svg.append("g")
    .attr("class", "states")
    .selectAll("path")
    .data(topojson.feature(india, india.objects.states).features)
    .enter()
    .append("path")
    .attr("style", function(d) {
      return "fill: rgba(0, 0, 66," + quantize(minValue, maxValue, ids.length)(data.get(d.id)[item]) + ");";
    })
    .on("mouseover", function(d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip
	.html(toolTipHtml(d.id, item))
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    })
    .attr("d", path);

  svg.append("path")
    .datum(topojson.mesh(india, india.objects.states, function(a, b) { return a !== b; }))
    .attr("class", "states")
    .attr("d", path);
};

function toolTipHtml(id, item) {
  var state = data.get(id);
  return id +
    "<br/>" +
    state[item] + " kg/month";
}
