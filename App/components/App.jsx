import React from 'react';
import * as d3 from 'd3';
// import {withFauxDOM} from 'react-faux-dom';
import io from 'socket.io-client';
import Chart from './Chart.jsx';

let socket = io(`http://ec2-34-212-134-187.us-west-2.compute.amazonaws.com:9090`)

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            route1Stations: [], 
            route2Stations: [],
            activePos: {}
        };
    }

    componentDidMount() {
    
        let route1 = [[180, 200], [780, 200],[580, 200],[380, 200]], 
            route2 = [[180, 400], [780, 400],[580, 400],[380, 400]],
            activePos = {};
    
        socket.on(`widget:data`, data => {
          let entries = JSON.parse(data.message).Root.BinaryInSet.Entry;
          let route1Stations = [], route2Stations = [];
          let counterRoute1, counterRoute2 = 0 ;

          entries.forEach(function(Entry) {
              if(Entry.Name.indexOf('APM1') === 0) {
                Entry.StationLoc = route1.shift();
                route1Stations.push(Entry);
              }
              if(Entry.Name.indexOf('APM2') === 0) {
                Entry.StationLoc = route2.shift();
                route2Stations.push(Entry);
              }
              if(Entry.Value == 1) {
                  activePos = Entry;
              }
          });

          this.setState({
              route1Stations: route1Stations,
              route2Stations: route2Stations,
              activePos: activePos,
          });
        });
    }

    render() {
        let route1 = this.state.route1Stations,
            route2 = this.state.route2Stations,
            activePos = this.state.activePos;
        return (
            <div className='renderedD3'>
                <svg width="960" height="500">
                    <Chart pathId="M1" Stations={route1} route={[{'APM1_SOUTH': [180, 200]},  {'APM1_ALARM': [380, 200]},  {'APM1_MAINT': [580, 200]},  {'APM1_NORTH': [780, 200]}]} activePos={activePos} />
                    <Chart pathId="M2" Stations={route2} route={[{'APM2_SOUTH': [180, 400]},  {'APM2_ALARM': [380, 400]},  {'APM2_MAINT': [580, 400]},  {'APM2_NORTH': [780, 400]}]} activePos={activePos} />
                </svg>
            </div>
        );
    }
}

export default App;