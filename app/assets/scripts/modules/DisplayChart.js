import React from 'react'
import { VictoryChart, VictoryAxis, VictoryArea } from 'victory'
import { HOY_BLUE } from '../base/Constants'

const axisStyle = {
    tickLabels: { fill: '#ccc', fontFamily: 'Open Sans' },                    
    axis: { stroke: "#ccc" }
}

const DisplayChart = props => {
    return (
        <div className={props.chartClass}>
        <VictoryChart
            style={{
                data: { fill: "green" },
                labels: { fill: "green" },
                parent: {  },
                }}
            animate={{duration: 800}}
            >
            <VictoryAxis style={axisStyle} />
            <VictoryAxis dependentAxis style={axisStyle} />
            <VictoryArea
                style={{
                data: { fill: HOY_BLUE },
                }}
                data={props.dataArray}
            />
        </VictoryChart>
        </div>
    )
}

export default DisplayChart