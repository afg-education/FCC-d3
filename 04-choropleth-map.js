const countiesURI =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

const educationURI =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

const colors = [
  "#42A5F5",
  "#2196F3",
  "#1E88E5",
  "#1976D2",
  "#1565C0",
  "#0D47A1"
];

let tooltip = d3
  .select("#chart")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

d3.json(countiesURI).then((data) => {
  const countiesData = data;

  d3.json(educationURI).then((data) => {
    const educationData = data;

    function getEducationValue(countyId) {
      var returnValue = null;
      educationData.forEach((value) => {
        if (value.fips == countyId) {
          returnValue = value;
        }
      });
      return returnValue;
    }

    const w = 1500;
    const h = 700;
    const padding = 60;

    const path = d3.geoPath();

    // find min and max of education index

    const minEducation = d3.min(educationData, (d) => d.bachelorsOrHigher);
    const maxEducation = d3.max(educationData, (d) => d.bachelorsOrHigher);
    const colorRangeFactor = (maxEducation - minEducation) / colors.length;

    // create svg canvas
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    svg
      .append("g")
      .selectAll("path")
      .data(
        topojson.feature(countiesData, countiesData.objects.counties).features
      )
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "county")
      .attr("data-fips", (d) => getEducationValue(d.id).fips)
      .attr("data-education", (d) => getEducationValue(d.id).bachelorsOrHigher)
      .attr("fill", (d, i) => {
        let colorIndex = parseInt(
          (getEducationValue(d.id).bachelorsOrHigher - minEducation) /
            colorRangeFactor
        );
        return colors[colorIndex];
      })
      .on("mouseover", (d, i) => {
        tooltip
          .attr("data-education", getEducationValue(d.id).bachelorsOrHigher)
          .attr("id", "tooltip")
          .style("left", d3.event.pageX + 20 + "px")
          .style("top", d3.event.pageY + "px")
          .style("display", "inline-block")
          .style("opacity", 1)
          .html("Education: " + getEducationValue(d.id).bachelorsOrHigher);
      })
      .on("mouseout", (d) => tooltip.style("opacity", 0));

    const legendsvg = d3
      .select("#chart")
      .append("svg")
      .attr("class", "svglegend")
      .attr("width", w)
      .attr("height", 60)
      .attr("x", padding)
      .attr("y", h)
      .attr("id", "legend")
      .style("fill", "black");

    const xScaleLegend = d3
      .scaleLinear()
      .domain([0, 6])
      .range([10, w / 3.95 - padding]);

    const xAxisLegend = d3
      .axisBottom(xScaleLegend)
      .tickFormat((d, i)  => {
        const scaleLabel = minEducation + colorRangeFactor * i;
        return scaleLabel.toFixed(1);
      })
      .ticks(7);

    legendsvg
      .append("g")
      .attr("transform", "translate(0," + 40 + ")")
      .attr("id", "x-axislegend")
      .call(xAxisLegend);

    // Adding Rects in legend 'svg'

    legendsvg
      .selectAll("rect")
      .data(colors)
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScaleLegend(i))
      .attr("y", (d) => 10)
      .attr("width", 50)
      .attr("height", 30)
      .style("fill", (d, i) => colors[i]);
  });
});
