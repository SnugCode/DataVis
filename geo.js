function init() {
    var width = 960;
    var height = 500;

    // Color scale
    var color = d3.scaleOrdinal(d3.schemeSet2);

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
            .style("fill", function (d, i) {
                return color(i);
            })
            .on("click", function (event, d) {
                showCountryData(d);
            });
    }).catch(function (error) {
        console.error("Error loading the GeoJSON file:", error);
    });

    function showCountryData(country) {
        var countryInfo = document.getElementById("location_info");
        countryInfo.innerHTML = "<h4>" + country.properties.name + "</h4>";
    }
}

window.onload = init;
