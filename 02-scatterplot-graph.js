const datasetURI =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

let tooltip = d3
  .select("#chart")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

d3.json(datasetURI).then((data) => {
  data.forEach((d) => {
    let parseTime = d.Time.split(":");
    d.Time = new Date(1970, 0, 1, 0, parseTime[0], parseTime[1]);
    d.Year = new Date(d.Year, 0, 1, 0, 0, 0);
  });

  const dataset = data;

  const w = 600;
  const h = 400;
  const padding = 60;

  const years = dataset.map((i) => i.Year);
  const times = dataset.map((i) => i.Time);

  console.log(d3.min(years).getFullYear());

  const xScale = d3
    .scaleTime()
    .domain([d3.min(years), d3.max(years)])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleTime()
    .domain([d3.min(times), d3.max(times)])
    .range([h - padding, padding]);

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  const xFormat = d3.timeFormat("%Y");
  const yFormat = d3.timeFormat("%M:%S");

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale).tickFormat(yFormat);

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

  svg
    .append("div")
    .attr("id", "legend")
    .html("some info about chart")
    .style("left", (w - padding) + 30 + "px")
    .style("top", h - 100 + "px");

  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => xScale(years[i]))
    .attr("cy", (d, i) => yScale(times[i]))
    .attr("r", (d) => 5)
    .attr("class", "dot")
    .attr("data-xvalue", (d, i) => years[i])
    .attr("data-yvalue", (d, i) => times[i])
    .on("mouseover", function (d, i) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(years[i])
        .attr("data-year", years[i])
        .style("left", (i * (w - padding)) / dataset.length + 30 + "px")
        .style("top", h - 100 + "px")
        .style("transform", "translateX(60px)");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(200).style("opacity", 0);
    });
});
