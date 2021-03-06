var juices;
var data;

d3.csv("../per_day_data.csv",function(d){
        var parse = d3.time.format("%Y-%m-%d").parse;

        data=d;
        data.forEach(function(s) {
                s.date = parse(s.date);
                s.total = +s.total;
        })


        juices = d3.nest()
                                                 .key(function(d) {return d.juice})
                                                 .sortValues(function(a,b) {return a.date<b.date?-1:(a.date==b.date)?0:1})
                                                 .entries(data);

        juices.forEach(function (juice) {
                juice.max=d3.max(juice.values,function(d) {return +d.total});
                juice.min=d3.min(juice.values,function(d) {return +d.total});
        })

        juices.max = d3.max(juices,function(d) {return d.max});

        drawSmallMultiples(juices,d3.select("#small_multiples"),juices.max);

});

function drawSmallMultiples(juices,container,max) {
        juices.forEach(function(juice) {
                var smallContainer = container.append("div").attr("style","float:left")
                smallContainer.append("div").append("p").attr("class","small_multiples_label").text(juice.key);
                drawSmallLineChart([juice],smallContainer,max);
        })
}



function drawSmallLineChart(juices, container,max) {
        var margin={left:20,right:20,top:20,bottom:20};
        var w = 200-margin.left-margin.right, h = 200-margin.top-margin.bottom;

        var color=d3.scale.category20();

        var vis=container.append("svg:svg")
                                                .attr("width",w+margin.left+margin.right)
                                                .attr("height",h+margin.top+margin.bottom)
                                                .append("svg:g").attr("transform","translate("+margin.left +","+margin.top+")");

        var x = d3.scale.linear().domain([0,juices[0].values.length]).range([0,w]);
        var y = d3.scale.linear().domain([0,max]).range([h,0]);
        var line = d3.svg.line()
                                                         .x(function(d,i) {return x(i)})
                                                         .y(function(d) {return y(d.total)}).interpolate("linear");

        var dateFormatter = d3.time.format("%d/%m");
        var yAxis = d3.svg.axis().orient("left");
        var xAxis = d3.svg.axis().orient("bottom").ticks(5);//.tickFormat(function(d) {return dateFormatter(juices[0].values[d].date)}).ticks(3);


        vis.selectAll("g")
           .data(juices)
                 .enter()
                 .append("svg:g")
                   .attr("class",function(d) {return d.key})
                         .append('svg:path')
                         .attr("d",function(d) {return line(d.values)})
                         .attr("stroke", function(d) {return color(d.key)})
                         .attr("stroke-width", "2.0")
                         .attr("fill","none");

        vis.append("g").attr("class","axis").call(yAxis.scale(y));
        vis.append("g").attr("transform","translate(0,"+h+")").attr("class","axis").call(xAxis.scale(x));

}
