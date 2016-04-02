window.onresize = resizeChart;
var competency = [];


function barChart() {
    var threshold = 75;
    var width = $('.chart').width();
    var height = competency.length * 25;
    var padding = 20;
    var margin = {
        left: 75,
        top: 25,
        right: 0,
        bottom: 25
    };
    var w = width - margin.left - margin.right;
    var h = height - margin.top - margin.bottom;
    var widthT = width*threshold/100;

    var xExtent = d3.extent(competency, function(d) {
        return d.score;
    });
    var xScale = d3.scale.linear()
        .domain([0, 100])
        .range([0, w - padding])
    var yScale = d3.scale.ordinal()
        .domain(d3.range(0, competency.length))
        .rangeRoundBands([0, h - padding], .1);
    var yGuideScale = d3.scale.ordinal()
        .domain(competency.map(function(d) {
            return d.topic;
        }))
        .rangeRoundBands([margin.top, h - padding]);
    var yGuideScaleT = d3.scale.ordinal()
        .rangeRoundBands([margin.top, h - padding]);
    var labelScale = d3.scale.ordinal()
        .domain(d3.range(0, competency.length))
        .rangePoints([padding + 11.25, h - padding - 17]);

    var svg = d3.select('.chart')
        .append('svg')
        .attr('width', w + margin.left + margin.right)
        .attr('height', h + margin.top + margin.bottom)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    var loadingText = svg.append('text')
        .attr('x', w / 2)
        .attr('y', h / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', 32)
        .text('Loading...');

    var barChart = svg.selectAll('rect')
        .data(competency)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', function(d, i) {
            return yScale(i);
        })
        .attr('width', 0)
        .attr('height', yScale.rangeBand())
        .attr('fill', function(d) {
          if(d.score >= threshold) {
            return '#099538';
          } else {
            return '#750303';
          }
        })
        .attr('shape-rendering', 'crispEdges')
        .attr('stroke', 'black');

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(5);
    var xGuide = d3.select('svg')
        .append('g')
        .attr('opacity', 0);
    xAxis(xGuide)
    xGuide.attr('transform', 'translate(' + margin.left + ', ' + (h) + ')')
    xGuide.selectAll('path')
        .style({
            fill: 'none',
            stroke: '#000'
        });

    var yAxis = d3.svg.axis()
        .scale(yGuideScale)
        .orient('left');
    var yGuide = d3.select('svg')
        .append('g')
        .attr('opacity', 0);
    yAxis(yGuide);
    yGuide.attr('transform', 'translate(' + margin.left + ','+(margin.top/2)+')')
    yGuide.attr('text-anchor', 'bottom');
    yGuide.selectAll('path')
        .style({
            fill: 'none',
            stroke: '#000'
        });

    var yAxisT = d3.svg.axis()
            .scale(yGuideScaleT)
            .orient('left');
    var yGuideT = d3.select('svg')
        .append('g')
        .attr('opacity', 0);
    yAxisT(yGuideT);
    yGuideT.attr('transform', 'translate(' + (widthT) + ','+(margin.top/2)+')')
    yGuideT.attr('text-anchor', 'bottom');
    yGuideT.selectAll('path')
        .style({
            fill: 'none',
            stroke: '#000'
        });

    var barText = svg.selectAll('.bartext')
        .data(competency)
        .enter()
        .append('text')
        .attr('class', 'bartext')
        .attr('text-anchor', 'end')
        .attr('fill', 'white')
        .attr('x', 0)
        .attr('y', function(d, i) {
            return labelScale(i);
        });

    d3.select('svg')
        .append('text')
        .attr('text-size', 16)
        .attr('x', (margin.left))
        .attr('y', (height - 5));

    barChart.transition()
        .attr('width', function(d) {
            return xScale(d.score);
        })
        .delay(1500)
        .duration(1400)
        .ease('elastic')
    barText.transition()
        .attr('x', function(d) {
            return xScale(d.score) - 5
        })
        .delay(1500)
        .duration(1400)
        .ease('elastic')
    loadingText.transition()
        .delay(1000)
        .remove();
    yGuide.transition()
        .delay(1700)
        .duration(800)
        .attr('opacity', 1);
    yGuideT.transition()
        .delay(1700)
        .duration(800)
        .attr('opacity', 1);
    xGuide.transition()
        .delay(1700)
        .duration(800)
        .attr('opacity', 1);
}

barChart();

function resizeChart() {
    $('svg').remove();
    barChart();
}

function setCompetency(c) {
    $('svg').remove();
    competency = c;
    barChart();
}