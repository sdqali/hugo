function drawVis () {
  d3.csv("charity_shield.csv", function(data) {
    data = data.filter (function (d) {
      return +d.LeaguePosition != -1;
    });

    var width = 1200;
    var height = 600;
    var margin = {top: 50, right: 50, bottom: 50, left: 50};

    var xScale = d3.time.scale()
      .range([0, width - margin.left - margin.right])
      .domain(d3.extent(data, function(d) { return +d.Year; }));

    var yScale = d3.scale.linear()
      .range([height - margin.top - margin.bottom, 0])
      .domain([d3.max(data, function(d) { return +d.LeaguePosition; }), 1]);

    var vis = d3.select("#vis").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "winners")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var line = d3.svg.line()
      .x(function(d,i) { return xScale(+d.Year); })
      .y(function(d) { return yScale(+d.LeaguePosition); })

    vis.append("svg:path").attr("d", line(data));

    var circles = vis.selectAll ("circle")
      .data (data)
      .enter ()
      .append ("circle")
      .attr ("cx", function (d, i) {
        return xScale (d.Year)
      })
      .attr ("cy", function (d, i) {
        return yScale (+d.LeaguePosition);
      })
      .attr ("r", 4)
      .attr ("class", "team")
      .attr("opacity", 0.6)
      .on("mouseover", function(d){
        d3.select(this)
          .attr("r", 6)
          .attr("opacity", "1");
        drawLegend (d);
      })
      .on("mouseout", function(d){
        d3.select(this)
          .attr("r", 4)
          .attr("opacity", 0.6);
        clearLegend ();
      });

    circles.append ("title")
      .text (function (d, i) {
        return d.Year + " : " + d.Winner + ", " + d.LeaguePosition;
      });

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .tickFormat (d3.format ("d"))
      .ticks (30)
      .tickPadding(8);

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .tickPadding(8);

    vis.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + yScale.range()[0] + ")")
      .call(xAxis);

    vis.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    var yLabel = vis.append("g");
    yLabel.append("text")
      .text("League Position")
      .attr("text-anchor", "middle");
    yLabel.attr("transform", "translate(" + -margin.left * 3/4 + "," +  (height - margin.bottom)/2 +") rotate(270)");

    var xLabel = vis.append("g");
    xLabel.append("text")
      .text("Year")
      .attr("text-anchor", "middle");
    xLabel.attr("transform", "translate(" + (width - margin.left - margin.right) / 2 + "," +  (height - margin.bottom - 3) +")");
  });
}

function drawLegend (d) {
  d3.select ("#legend .details")
    .append ("text")
    .text (d.Year + " : " + d.Winner + ", " + d.LeaguePosition);
}

function clearLegend () {
    d3.select ("#legend .details")
    .select ("text")
    .remove ();
}
