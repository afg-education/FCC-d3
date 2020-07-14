const datasetURI =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

let tooltip = d3
  .select("#chart")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

// base temperature + variance
// variance
d3.json(datasetURI).then((data) => {
  const baseTemp = data.baseTemperature;
  const dataset = data.monthlyVariance;

  const maxVariance = d3.max(dataset.map((d) => d.variance));
  const minVariance = d3.min(dataset.map((d) => d.variance));

  dataset.forEach((d) => {
    d.month = d.month - 1;
    d.temp = baseTemp + d.variance;
    d.hue =
      240 -
      ((d.variance * 1 - minVariance) / (maxVariance - minVariance)) * 240;
  });

  const years = dataset.map((d) => d.year);
  const temp = dataset.map((d) => d.temp);

  //console.log(dataset);

  const w = 1200;
  const h = 600;
  const padding = 60;

  // create svg canvas
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  //create x axis
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(years), d3.max(years)])
    .range([padding, w - padding]);

  const xFormat = d3.timeFormat("%Y");

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(26);

  svg
    .append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .attr("id", "x-axis")
    .call(xAxis);

  //create y axis
  const yScale = d3
    .scaleBand()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    .range([padding, h - padding]);

  const yFormat = d3.timeFormat("%B");

  const yAxis = d3
    .axisLeft(yScale)
    .tickValues(yScale.domain())
    .tickFormat((d) => months[d]);

  svg
    .append("g")
    .attr("transform", "translate(" + padding + "," + 0 + ")")
    .attr("id", "y-axis")
    .call(yAxis);

  //data

  const rectWidth = parseFloat(w / (d3.max(years) - d3.min(years)));
  const rectHeight = yScale.bandwidth();

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d, i) => d.month)
    .attr("data-year", (d, i) => d.year)
    .attr("data-temp", (d, i) => d.temp)
    .attr("x", (d, i) => xScale(d.year))
    .attr("y", (d, i) => yScale(d.month))
    .attr("width", rectWidth)
    .attr("height", rectHeight)
    .attr("style", (d, i) => "fill: hsl(" + d.hue + ",25%,25%)")
    .on("mouseover", (d, i) => {
      tooltip
        .attr("data-year", d.year)
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY + "px")
        .style("display", "inline-block")
        .style("opacity", 1)
        .html(
          d.year +
            "<br>" +
            "Varience: " +
            d.variance +
            "<br>" +
            "Temp: " +
            d.temp
        );
    })
    .on("mouseout", (d) => tooltip.style("opacity", 0));
  //console.log(dataset);  data-month, data-year, data-temp

  //legend

  const legendSvg = d3
    .select("#chart")
    .append("svg")
    .attr("width", w)
    .attr("height", 60)
    .attr("x", padding)
    .attr("y", h)
    .attr("id", "legend");

  const xScaleLegend = d3
    .scaleLinear()
    .domain([d3.min(temp), d3.max(temp)])
    .range([padding, w / 3 - padding]);

  const xAxisLegend = d3.axisBottom(xScaleLegend).tickFormat(function (d, i) {
    const scaleLabel = 2.8 + 1.1 * i;
    return scaleLabel.toFixed(1);
  });

  legendSvg
    .append("g")
    .attr("transform", "translate(0," + 40 + ")")
    .attr("id", "x-axislegend")
    .call(xAxisLegend);
  
   legendSvg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", (d,i)=> xScaleLegend(d.temp))
      .attr("y", (d) => 10)
      .attr("width", parseFloat(w / (d3.max(temp) - d3.min(temp))))
      .attr("height", 30)
      .attr("style", (d, i) => "fill: hsl(" + d.hue + ",25%,25%)")
});
