function drawbarChart4 () {
  d3.csv ("accident_deaths.csv", function (data) {
    var width = 800;
    var height = 500;

    var margins = {
      left: 50,
      top: 50,
      right: 50,
      bottom: 50
    };

    var chart = d3.select("#barchart4").append("svg")
      .attr ("class", "chart")
      .attr ("width", width)
      .attr ("height", height);

    var xScale = d3.scale.linear ()
      .domain ([0, d3.max (data, function (d) {return d.deaths;})])
      .range ([margins.left, width - margins.right]);

    var yScale = d3.scale.ordinal ()
      .domain (data.map (function (d) {return d.year;}))
      .rangeBands ([margins.top, height - margins.bottom]);

    // Add rectangles
    chart.selectAll ("rect")
      .data (data)
      .enter ()
      .append ("rect")
      .attr ("width", function (d) {
        return xScale (d.deaths) - xScale(0);
      })
      .attr("x", function(d) {
        return margins.left;
      })
      .attr ("height", yScale.rangeBand ())
      .attr ("y", function (d, i) {
        return yScale (d.year);
      });

    // Add text showing number of deaths
    chart.selectAll ("text")
      .data (data)
      .enter ()
      .append ("text")
      .text (function (d) {
        return String (d.deaths);
      })
      .attr ("x", function (d) {
        return xScale (d.deaths);
      })
      .attr ("y", function (d, i) {
        return yScale (d.year) + yScale.rangeBand () / 2;
      })
      .attr("dy", ".35em")
      .attr("dx", "-5")
      .attr ("text-anchor", "end");

    //Add x axis
    var xAxis = d3.svg.axis()
      .scale(xScale)
      .ticks(20)
      .orient("bottom");

    chart.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (height - margins.bottom) + ")")
      .call(xAxis);

    // Add y axis
    var yAxis = d3.svg.axis()
      .scale(yScale)
      .ticks(data.length)
      .orient("left");

    chart.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + margins.left +", 0)")
      .call(yAxis);

    // Add y rules
    var yRule = chart.append("g")
    .selectAll(".rule")
    .data(xScale.ticks(20))
    .enter()
    .append("g")
    .attr("class", "rule")
    .attr("transform", function(d) {
        return "translate(" + xScale(d) + "," + margins.top + ")";
    });

    yRule.append("line")
    .attr("y2", height - 2 * margins.bottom);
  });
}
