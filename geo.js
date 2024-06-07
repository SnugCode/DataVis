function init() {
    var width = 960;
    var height = 500;

    // Color scale for highlighted countries
    var highlightColor = "#69b3a2";
    var defaultColor = "#d3d3d3";

    // Countries to highlight
    var highlightCountries = ["Australia", "Canada", "Denmark", "Germany", "Israel", "Sweden", "United States of America"];

    // Projection
    var projection = d3.geoMercator()
        .scale(150)
        .translate([width / 2, height / 1.5]);

    // Path
    var path = d3.geoPath().projection(projection);

    // SVG setup
    var svg = d3.select("#map")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Function for panning and zooming
    var zooming = function (event) {
        var offset = [event.transform.x, event.transform.y];
        var newScale = event.transform.k * 2000;
        projection.translate(offset).scale(newScale);
        svg.selectAll("path").attr("d", path);
    }

    // Definition of zoom behavior
    var zoom = d3.zoom()
        .scaleExtent([0.07, 1.0])
        .translateExtent([[-5500, -3200], [5500, 3200]])
        .on("zoom", zooming);

    // SVG group container for pannable and zoomable elements
    var map = svg.append("g")
        .attr("id", "map")
        .call(zoom)
        .call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.08));

    // Load GeoJSON data
    d3.json("map.geojson").then(function (geojson) {
        map.selectAll(".country")
            .data(geojson.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .attr("d", path)
            .style("fill", function (d) {
                return highlightCountries.includes(d.properties.name) ? highlightColor : defaultColor;
            })
            .on("mouseover", function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d.properties.name)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    }).catch(function (error) {
        console.error("Error loading the GeoJSON file:", error);
    });

    // Tooltip div
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    function showCountryData(country) {
        var countryInfo = document.getElementById("location_info");
        countryInfo.innerHTML = "<h4>" + country.properties.name + "</h4>";
    }
}

window.onload = init;
