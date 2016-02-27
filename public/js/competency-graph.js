window.onresize = resizeChart;
var competency = [
  {
    topic: 'Facebook',
    score: 100
  },
  {
    topic: 'Instagram',
    score: 25
  },
  {
    topic: 'Snapchat',
    score: 42
  },
  {
    topic: 'Twitter',
    score: 45
  },
  {
    topic: 'Reddit',
    score: 65
  },
  {
    topic: 'A',
    score: 23
  },
  {
    topic: 'B',
    score: 76
  },
  {
    topic: 'C',
    score: 23
  },
  {
    topic: 'D',
    score: 67
  }
];

function barChart() {
    var width = $('.chart').width();
    var height = 450;
    var padding = 20;
    var margin = {
        left: 75,
        top: 25,
        right: 0,
        bottom: 25
    };
    var w = width - margin.left - margin.right;
    var h = height - margin.top - margin.bottom;
  	
    var xExtent = d3.extent(competency, function(d) {
        return d.score;
    });
    var xScale = d3.scale.linear()
        .domain([0, d3.max(competency, function(d) {
            return d.score
        })])
        .range([0, w - padding])
    var yScale = d3.scale.ordinal()
        .domain(d3.range(0, competency.length))
        .rangeRoundBands([0, h - padding], .1);
    var yGuideScale = d3.scale.ordinal()
        .domain(competency.map(function(d) {
            return d.topic;
        }))
        .rangeRoundBands([margin.top, h - padding]);
    var labelScale = d3.scale.ordinal()
        .domain(d3.range(0, competency.length))
        .rangePoints([padding + 11.25, h - padding - 17]);
    //create the SVG
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
    //append rectangles
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
        .attr('fill', '#193441')
        .attr('shape-rendering', 'crispEdges')
        .attr('stroke', 'black');
    //x-axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(4);
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
    //y-axis
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
    //append labels
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
        })/*
        .text(function(d) {
            return Math.round(d.score);
        })*/;
    //append legend
    d3.select('svg')
        .append('text')
        .attr('text-size', 16)
        .attr('x', (margin.left))
        .attr('y', (height - 5));
    //apply transitions
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
    xGuide.transition()
        .delay(1700)
        .duration(800)
        .attr('opacity', 1);
}
//Remove SVG
function resizeChart() {
    $('svg').remove();
    barChart();
}
barChart();
