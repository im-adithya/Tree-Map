//Let's start
var width = "60vw"
var height = "80vh"
const pxwidth = (window.innerWidth)
const pxheight = (window.innerHeight)

function conv(x) {
    x = x.split("v")
    if (x[1] == "w") {
        return (parseInt(x[0]) * pxwidth) / 100
    }
    else if (x[1] == "h") {
        return (parseInt(x[0]) * pxheight) / 100
    }
}

width = conv(width)
height = conv(height)

const url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"
const color = d3.scaleOrdinal(d3.schemeCategory10);


const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

var tooltip = d3.select(".holder")
    .append("span")
    .attr("id", "tooltip")
    .style("opacity", 0);

fetch(url)
    .then(response => response.json())
    .then(data => {

        const dataset = data
        console.log(dataset)

        const treemap = d3.treemap()
            .size([width, height])
            .padding(1)

        const root = d3.hierarchy(dataset)
            .sum(d => d.value)

        treemap(root)

        const cell = svg.selectAll('g')
            .data(root.leaves())
            .enter().append('g')
            .attr('transform', d => `translate(${d.x0}, ${d.y0})`);

        const tile = cell.append('rect')
            .attr('class', 'tile')
            .attr('data-name', d => d.data.name)
            .attr('data-category', d => d.data.category)
            .attr('data-value', d => d.data.value)
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0)
            .attr('fill', d => color(d.data.category))
            .on("mouseover", function (d, i) {
                const { name, category, value } = d.data;
                console.log(name, category, value)
                tooltip.transition()
                    .duration(0)
                    .style("opacity", 0.9)
                    .style("top", (event.clientY - 80).toString() + "px")
                    .style("left", (event.clientX - 80).toString() + "px")
                    .attr("data-value", value)
                d3.select("#tooltip").html(`Name: ${name} Category: ${category}<br>Value: ${value}`)
            })
            .on("mouseout", function () {
                tooltip.transition()
                    .duration(0)
                    .style("opacity", 0)
                    .style("top", "0vw")
                    .style("left", "0vw")
            })

        cell.append('text')
            .selectAll('tspan')
            .data(d => {
                var a = []
                a.push(d.data.name)
                a = a[0].split(" ")
                console.log(a);
                return a
            })

            .enter().append("tspan")
            .attr("style", "font-size: 8px !important")
            .attr('x', 4)
            .attr('y', (d, i) => 10 + i * 15)
            .html(d => d)

        const categories = root.leaves().map(n => n.data.category).filter((item, idx, arr) => arr.indexOf(item) === idx);

        const blockSize = 20;
        const legendWidth = 100;
        const legendHeight = (blockSize + 2) * categories.length;

        const legend = d3.select('#legend')
            .append('svg')
            .attr('width', legendWidth)
            .attr('height', legendHeight)

        legend.selectAll('rect')
            .data(categories)
            .enter()
            .append('rect')
            .attr('class', 'legend-item')
            .attr('fill', d => color(d))
            .attr('x', blockSize / 2)
            .attr('y', (_, i) => i * (blockSize + 1) + 10)
            .attr('width', blockSize)
            .attr('height', blockSize)

        legend.append('g')
            .selectAll('text')
            .data(categories)
            .enter()
            .append('text')
            .attr('fill', 'black')
            .attr('x', blockSize * 2)
            .attr('y', (_, i) => i * (blockSize + 1) + 25)
            .text(d => d)

    })
