import React from 'react'

import { MONTHS_ARRAY, STUDENT_STRING, PARENT_STRING, TEACHER_STRING, TOTAL_STRING, YEAR_2020, HOY_BLUE } from '../base/Constants'

import { VictoryChart, VictoryAxis, VictoryArea } from 'victory'

// Commented out because the dropdown filter didn't work due to the arrow functions not registering
//import Dropdown from 'rc-dropdown';
//import Menu, { Item as MenuItem, Divider } from 'rc-menu';
//import 'rc-dropdown/assets/index.css';

// Arrays containing unique id's matching corresponding users
let studentIdArray = []
let parentIdArray = []
let teacherIdArray = []

// Data arrays for charting data matching corresponding users
let totalChartData = []
let studentChartData = []
let parentChartData = []
let teacherChartData = []

// Styling for chart axis
const axisStyle = {
    tickLabels: { fill: '#ccc', fontFamily: 'Open Sans' },                    
    axis: { stroke: "#ccc" }
}

class AuthenticationChart extends React.Component {
    state = {
        currentUserLoginData: [],
    }

    componentDidMount() {
        try {
            // Fetch users and call filter function to store user id's
            fetch('../../api/users.json')
            .then(res => res.json())
            .then(users => this.filterUserIdIntoArray({users}))

            // Fetch authentication log text file
            fetch('../../api/authentication-log.txt')
            .then(res => res.text())
            .then(text => {
                let formattedAuthArray = []
                let totalMonthCount = []

                // Seperate data in text file by every new line
                let textFormatted = text.split("\n")
                for(let i=0; i<textFormatted.length; i++) {
                    // Seperate the date and time in the time aspect of the data retrieved
                    formattedAuthArray.push(textFormatted[i].split("\t"))
                }

                for(let n=0; n<formattedAuthArray.length; n++) {
                    // Create placeholder variable for each item in the array
                    let newDate  = new Date(formattedAuthArray[n][0])
                    
                    // Filter out authentication logs for the year 2020
                    if(newDate.getFullYear() == YEAR_2020) {
                        for(let m=0; m<=11; m++) {  
                            // Count up how many times a certain month was logged in to
                            if(newDate.getMonth() == m){
                                totalMonthCount[m] == undefined ? totalMonthCount[m] = 1 : totalMonthCount[m] += 1
                            }
                        }
                    }
                }
                
                // Call function that will filter current data into unique chart data for each user
                this.createUserChartData({formattedAuthArray})

                // Assign total amount of logins for 2020
                for(let x=0; x<MONTHS_ARRAY.length; x++) {
                    totalChartData.push({x: (x+1), y: totalMonthCount[x]})
                }

                // Set initial state of chart with total logins
                this.setState( { currentUserLoginData: totalChartData } )
            })

            

        } catch(e) {
            console.log(e)
        }
    }

    // fill in chart data for every user
    createUserChartData(props) {
        // Arrays for each user group meant to store the amount of times logged in per month
        let studentMonthCount = []
        let parentMonthCount = []
        let teacherMonthCount = []

        // Create placeholder for formatted array containing all login information
        let authArray = props.formattedAuthArray

        for(let i=0; i<authArray.length; i++) {
            let newDate = new Date(authArray[i][0])
            let currentId = authArray[i][1]

            if(newDate.getFullYear() == YEAR_2020) {
                for(let m=0; m<=11; m++) {  
                    // Count how many times a certain month was logged in to for each specific user
                    if(newDate.getMonth() == m){
                        // If the current id being looped through finds a match with a user group, we can count one extra login for that specific month
                        if(studentIdArray.includes(currentId)){
                            studentMonthCount[m] == undefined ? studentMonthCount[m] = 1 : studentMonthCount[m] += 1
                        }

                        if(parentIdArray.includes(currentId)){
                            parentMonthCount[m] == undefined ? parentMonthCount[m] = 1 : parentMonthCount[m] += 1
                        }

                        if(teacherIdArray.includes(currentId)){
                            teacherMonthCount[m] == undefined ? teacherMonthCount[m] = 1 : teacherMonthCount[m] += 1
                        }
                    }
                }  
            }
        }

        // Assign chart data for all users
        for(let x=0; x<MONTHS_ARRAY.length; x++) {
            // shorthand if checking if there weren't any logins a specific month, fill in '0' so the chart can interpret that
            studentMonthCount[x] == undefined ? studentChartData.push({x: (x+1), y: 0}) :  studentChartData.push({x: (x+1), y: studentMonthCount[x]})
            parentMonthCount[x] == undefined ? parentChartData.push({x: (x+1), y: 0}) :  parentChartData.push({x: (x+1), y: parentMonthCount[x]})
            teacherMonthCount[x] == undefined ? teacherChartData.push({x: (x+1), y: 0}) :  teacherChartData.push({x: (x+1), y: teacherMonthCount[x]})
        }
    }

    // Filter into three different arrays with corresponding id's
    filterUserIdIntoArray(props) {
        let userData = props.users
        
        for(let i=0; i<userData.length; i++) {
            switch (userData[i].type) {
                case STUDENT_STRING:
                    studentIdArray.push(userData[i].id)
                    break;
    
                case PARENT_STRING:
                    parentIdArray.push(userData[i].id)
                    break;
    
                case TEACHER_STRING:
                    teacherIdArray.push(userData[i].id)
                    break;
            
                default:
                    console.log('no match found.')
                    break;
            }
        }
    }

    // Calculate and return total amount of logins based on passed props
    calculateTotalAmount(props) {
        let currentArray = (Object.values(props)[0])
        let total = 0;

        for(let i=0; i<currentArray.length; i++) {
            total += currentArray[i].y
        }

        return total
    }

    render() {
        return (
            <div>
                <div className="chart-container--main__description">
                    Totale aantal logins in 2020: 
                    <div className="chart-container--main--total-amount">{this.calculateTotalAmount({totalChartData})}</div>
                </div>
                <DisplayChart dataArray={totalChartData} chartClass={'chart-container--main'} />

                <div className="chart-container--main__description">
                    Totale aantal studenten logins in 2020: 
                    <div className="chart-container--main--total-amount">{this.calculateTotalAmount({studentChartData})}</div>
                </div>
                <DisplayChart dataArray={studentChartData} chartClass={'chart-container--main'} />

                <div className="chart-container--main__description">
                    Totale aantal ouder logins in 2020: 
                    <div className="chart-container--main--total-amount">{this.calculateTotalAmount({parentChartData})}</div>
                </div>
                <DisplayChart dataArray={parentChartData} chartClass={'chart-container--main'} />

                <div className="chart-container--main__description">
                    Totale aantal docent logins in 2020: 
                    <div className="chart-container--main--total-amount">{this.calculateTotalAmount({teacherChartData})}</div>
                </div>
                <DisplayChart dataArray={teacherChartData} chartClass={'chart-container--main'} />
            </div>
        )
    }
}

const DisplayChart = (props) => {
    return (
        <>
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
        </>
    )
}

export default AuthenticationChart





/* Dropdown filter code that was commented out because of a arrow function issue */

/*
function onSelect({ key }) {
    //console.log(`${key} selected`);
    switch (key) {
                case TOTAL_STRING:
                    () => this.setState({ currentUserLoginData: studentChartData })
                    break;

                case STUDENT_STRING:
                    () => this.setState({ currentUserLoginData: studentChartData })
                    break;
    
                case PARENT_STRING:
                    () => this.setState({ currentUserLoginData: parentChartData })
                    break;
    
                case TEACHER_STRING:
                    () => this.setState({ currentUserLoginData: teacherChartData })
                    break;
            
                default:
                    console.log('invalid key.')
                    break;
}

const menu = (
    <Menu onSelect={onSelect}>
        <MenuItem key={TOTAL_STRING}>{TOTAL_STRING}</MenuItem>
        <Divider />
        <MenuItem key={STUDENT_STRING}>{STUDENT_STRING}</MenuItem>
        <Divider />
        <MenuItem key={PARENT_STRING}>{PARENT_STRING}</MenuItem>
        <Divider />
        <MenuItem key={TEACHER_STRING}>{TEACHER_STRING}</MenuItem>
    </Menu>
)


I had this dropdown included to filter between users and re-render the main chart, there was an issue with arrow
functions not working so I disabled the dropdown for now.

<Dropdown
    trigger={['click']}
    overlay={menu}
    animation="slide-up"
>
    <button style={{ width: 100 }}>filter</button>
</Dropdown>


*/