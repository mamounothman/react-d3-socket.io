import React from 'react';
import * as d3 from 'd3';

class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Stations: this.props.Stations,
            Destination: this.props.activePos
        };
    }

    render() {
        return (
            <path id={this.props.pathId}></path>
        );
    }

    componentWillReceiveProps() {
        let svg = d3.select("svg");
        if(d3.selectAll(`.text-${this.props.pathId}`)[0].length < 4) {
            svg.selectAll(`.text-${this.props.pathId}`)
            .data(this.props.Stations)
            .enter()
            .append("text")
            .attr("class", `text-${this.props.pathId}`)
            .attr("x", function(d) { return d.StationLoc[0] - 30 })
            .attr("y", function(d) { return d.StationLoc[1] + 30 })
            .attr("dy", ".35em")
            .text(function(d) {  let stationName = d.Name.replace("APM1_", ""); return stationName.replace("APM2_", "") });
        }
        console.log(this.props.activePos);
        if(typeof this.props.activePos.Value != 'undefined') {
            let activeRoute =  this.props.activePos.Name.substr(0, 4);
            let animatedCircleId = (activeRoute == 'APM1') ? 'M1': 'M2';
            let destination = d3.select(`circle.station-${this.props.activePos.Name}`);
            let translate = d3.transform(destination.attr('transform'));
            
            let circle = d3.select(`circle.animated-${animatedCircleId}`);
            circle.transition()
                .duration(1000)
                .ease("linear")
                .attr("transform", `translate(${translate.translate})`);
        }
    }

    componentDidMount() {
        let svg = d3.select("svg");
        
        let route = this.fetshRoute();

        d3.select(`path#${this.props.pathId}`)
            .data([route])
            .attr("d", d3.svg.line());
        
        d3.select(`path#${this.props.pathId}`)
            .data([route])
            .attr("d", d3.svg.line());

        svg.selectAll(`.station${this.props.pathId}`)
            .data(route)
            .enter().append("circle")
            .attr("r", 7)
            .attr("class", (Entry, index) => { let Station = Object.values(this.props.route)[index]; return `station station-${Object.keys(Station)[0]}` })
            .attr("transform", function(d) { return `translate(${d})`; });
        
        let circle = svg.append("circle")
            .attr("r", 5)
            .attr('class', `animated-${this.props.pathId}`)
            .attr('fill', 'steelblue')
            .attr("transform", `translate(${route[0]})`);

        let pingInterval = setInterval(this.ping, 300, this.props.pathId);
    }

    ping(pathId) {
        d3.selectAll('circle[r="35"]').remove();
        let svg = d3.select('svg');
        let circle = d3.select(`circle.animated-${pathId}`)

        let translate = d3.transform(circle.attr('transform'));
        if(translate.translate[0]) {
            svg.append('circle')
            .transition()
            .attr({
                'cx': translate.translate[0],
                'cy': translate.translate[1],
                'r': 1,
                'stroke': 'red',
                'stroke-opacity': 1,
                'stroke-width': '3px',
            })
            .transition()
            .duration(3000)
            .attr({
                'fill': 'none',
                'r': 35,
                'stroke': '#369',
                'stroke-width': '0px',
                'stroke-opacity': 0,
                'class' : 'finised'
            });
        }
        
    }

    fetshRoute() {
        return this.props.route.map(function(Entry) {
            return Object.values(Entry)[0];
        });
    }
}

Chart.defaultProps = {
  chart: 'loading'
}

export default Chart;