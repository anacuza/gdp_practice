async function drawLineChart() {

    let dimensions = {
        width: window.innerWidth * 0.9, height: window.innerHeight * 0.9,
        margin: {
              top: 15,
              right: 15,
              bottom: 40,
              left: 60,
        }, }
    
    dimensions.boundedWidth = dimensions.width
        - dimensions.margin.left
        - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
        - dimensions.margin.top
        - dimensions.margin.bottom



const svg = d3.select("#d3_demo")
				.append("svg")
				.attr("width", dimensions.width*2)
				.attr("height", dimensions.height*2)
				.append("g")
				.style("transform", `translate(${
					dimensions.margin.left
				  }px, ${
					dimensions.margin.top
				  }px)`);


var income_groups = ['High income', 'Upper middle income' , 'Lower middle income', 'Low income']
const dataset = await d3.csv("/income_data.csv")
console.log(dataset)

var xScale = d3.scaleLinear().domain(d3.extent(dataset, function(d) {return d.Years;})).range([0, dimensions.boundedWidth]).nice()
var yScale = d3.scaleLinear().domain(d3.extent(dataset, function(d) {return d['High income'];})).range([dimensions.boundedHeight , 0]).nice()

var line = d3.line()
			.x(function(d) { console.log(xScale(d.Years)); return xScale(d.Years); })
			.y(function(d) { console.log(yScale(d['High income']*100)); return yScale(d['High income']*100); });

// would work a lot more on these colors using https://projects.susielu.com/viz-palette
var colScale= d3.scaleOrdinal().range(["#17273E", "#416A75" , "#87A897", "#F3F5CE" ]).domain(income_groups)

income_groups.forEach(function(income_group, i) {

	const line = d3.line()
		.x(function(d) {  console.log(xScale(d.Years)); return xScale(d.Years); })
		.y(function(d) {  return yScale(d[income_group]); });
	var line_path = svg.append("path")
		.attr("class", "line")
		.attr("d", line(dataset))
        .attr("id", "line"+i)
        .style("fill", "none")
		.attr("stroke", colScale(income_group)) 
		.attr("stroke-width", 5)

    var line_text = svg.append("text")
      .attr("id", "text"+i)
      .attr("transform", "translate("+(dimensions.boundedWidth - 80)+","+(yScale(dataset[dataset.length-1][income_group])-10)+")")
      .attr("dy", "1em")
      .attr("text-anchor", "start")
      .style("fill", "#666666")
      .text(income_group);

    line_path.on("mouseover", function(e,d){
        d3.selectAll('.line:not(#' + this.id + ')').transition().style("stroke", "#c4c4c4");
        line_text.transition().style("fill", "#121212");
      })

    line_path.on("mouseout", function(e,d){
        d3.selectAll('.line:not(#' + this.id + ')').transition().each(function(d) {
            console.log(this.id[4]); // Logs the element attached to d.
            d3.select(this).style("stroke", colScale(income_groups[this.id[4]]));
          });
          line_text.transition().style("fill", "#666666");  
    })
    
})


const yAxisGenerator = d3.axisLeft() .scale(yScale)

const yAxis = svg.append("g") .call(yAxisGenerator)
.append("text")
.attr("x", -dimensions.boundedHeight / 2)
.attr("y", -dimensions.margin.left + 10)
.attr("fill", "black")
.style("font-size", "1.4em")
.text("GDP in trillions")
.style("transform", "rotate(-90deg)")
.style("text-anchor", "middle")


const xAxisGenerator = d3.axisBottom() .scale(xScale)

const xAxis = svg.append("g") .call(xAxisGenerator)
.style("transform", `translateY(${ dimensions.boundedHeight
}px)`)
.append("text")
.attr("x", dimensions.boundedWidth / 2)
.attr("y", dimensions.margin.bottom - 5)
.attr("fill", "black")
.style("font-size", "1.4em")
.html("Years")


//creating legend
var lineLegend = svg.selectAll(".lineLegend").data(income_groups)
    .enter().append("g")
    .attr("class","lineLegend")
    .attr("transform", function (d,i) {
            return "translate(" + (dimensions.width-60) + "," + (i*19)+")";
        });

lineLegend.append("text").text(function (d) {return d;})
    .attr("transform", "translate(15,9)"); //align texts with boxes

lineLegend.append("rect")
    .attr("fill", function (d, i) {return colScale(d); })
    .attr("width", 10).attr("height", 10);

}
drawLineChart()