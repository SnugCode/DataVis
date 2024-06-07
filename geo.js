function init() {
    var width = 960;
    var height = 500;

    // Color mapping for highlighted countries
    var countryColors = {
        "Australia": "#ff9999",
        "Canada": "#66b3ff",
        "Denmark": "#99ff99",
        "Germany": "#ffcc99",
        "Israel": "#c2c2f0",
        "Sweden": "#ffb3e6",
        "USA": "#c2f0c2"
    };
    var defaultColor = "#d3d3d3";

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
                var countryName = d.properties.name === "United States of America" ? "USA" : d.properties.name;
                return countryColors[countryName] || defaultColor;
            })
            .style("stroke", "#000")
            .style("stroke-width", "1px")
            .on("mouseover", function (event, d) {
                var countryName = d.properties.name === "United States of America" ? "USA" : d.properties.name;
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(countryName)
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
        var countryName = country.properties.name === "United States of America" ? "USA" : country.properties.name;
        var countryInfo = document.getElementById("location_info");
        countryInfo.innerHTML = "<h4>" + countryName + "</h4>";
    }

    // Info button
    var infoButton = d3.select("#map").append("div")
        .attr("class", "info-button")
        .html("i");

    // Info tooltip
    var infoTooltip = d3.select("#map").append("div")
        .attr("class", "info-tooltip")
        .html("This map highlights specific countries that have been used within the previous visualizations.");

    infoButton.on("mouseover", function () {
        infoTooltip.style("display", "block");
    });

    infoButton.on("mouseout", function () {
        infoTooltip.style("display", "none");
    });
}

window.onload = init;
