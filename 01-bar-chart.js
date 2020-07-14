const datasetURI =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

let tooltip = d3
  .select("#chart")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

d3.json(datasetURI).then((data) => {
  const dataset = data.data;

  const w = 600;
  const h = 400;
  const padding = 60;

  const years = dataset.map((i) => new Date(i[0]));
  const gdps = dataset.map((i) => i[1]);

  const xScale = d3
    .scaleTime()
    .domain([d3.min(years), d3.max(years)])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(gdps)])
    .range([h - padding, padding]);

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("data-date", (d, i) => d[0])
    .attr("data-gdp", (d, i) => d[1])
    .attr("x", (d, i) => xScale(years[i]))
    .attr("y", (d, i) => yScale(d[1]))
    .attr("width", (w - padding) / dataset.length)
    .attr("height", (d, i) => h - padding - yScale(d[1]))
    .attr("fill", "navy")
    .attr("class", "bar")
    .on("mouseover", function (d, i) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          years[i].getMonth() + ", " + years[i].getFullYear() + 
            "<br>" +
            "$" +
            gdps[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") +
            " Billion"
        )
        .attr("data-date", data.data[i][0])
        .style("left", (i * (w - padding) / dataset.length) + 30 + "px")
        .style("top", h - 100 + "px")
        .style("transform", "translateX(60px)");
    })
  .on('mouseout', function(d) {
      tooltip.transition()
        .duration(200)
        .style('opacity', 0);
    });

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .attr("id", "x-axis")
    .call(xAxis);

  svg
    .append("g")
    .attr("transform", "translate(" + padding + ", 0)")
    .attr("id", "y-axis")
    .call(yAxis);
});
