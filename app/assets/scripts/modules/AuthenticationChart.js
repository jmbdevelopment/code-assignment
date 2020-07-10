import React from 'react'
import DisplayChart from './DisplayChart'

import { MONTHS_ARRAY, STUDENT_STRING, PARENT_STRING, TEACHER_STRING, TOTAL_STRING, YEAR_2020 } from '../base/Constants'

let studentIdArray = []
let parentIdArray = []
let teacherIdArray = []

let totalChartData = []
let studentChartData = []
let parentChartData = []
let teacherChartData = []

let chartDataMonthCount = 11

let chartDataCollection = [
    {name: TOTAL_STRING, data: totalChartData},
    {name: STUDENT_STRING, data: studentChartData},
    {name: PARENT_STRING, data: parentChartData},
    {name: TEACHER_STRING, data: teacherChartData}
]

class AuthenticationChart extends React.Component {
    state = {
        currentUserLoginData: [],
    }

    componentDidMount() {
        try {
            fetch('../../api/users.json')
            .then(res => res.json())
            .then(users => this.filterUserIdIntoArray({users}))

            fetch('../../api/authentication-log.txt')
            .then(res => res.text())
            .then(text => {
                let formattedAuthArray = []
                let totalMonthCount = []

                let textFormatted = text.split("\n")
                for(let i=0; i<textFormatted.length; i++) {
                    formattedAuthArray.push(textFormatted[i].split("\t"))
                }

                let authArray2020 = []
                authArray2020 = formattedAuthArray.filter(item => {return String(new Date(item[0]).getFullYear()) === YEAR_2020})

                for(let n=0; n<authArray2020.length; n++) {
                    let newDate  = new Date(authArray2020[n][0])

                    for(let m=0; m<=chartDataMonthCount; m++) {  
                        if(newDate.getMonth() === m){
                            totalMonthCount[m] === undefined ? totalMonthCount[m] = 1 : totalMonthCount[m] += 1
                        }
                    }
                }
                
                this.createUserChartData({authArray2020})
 
                for(let x=0; x<MONTHS_ARRAY.length; x++) {
                    totalChartData.push({x: (x+1), y: totalMonthCount[x]})
                }

                this.setState( { currentUserLoginData: totalChartData } )
            })
        } catch(e) {
            console.log(e)
        }
    }

    createUserChartData(props) {
        let studentMonthCount = []
        let parentMonthCount = []
        let teacherMonthCount = []

        let authArray = props.authArray2020

        for(let i=0; i<authArray.length; i++) {
            let newDate = new Date(authArray[i][0])
            let currentId = authArray[i][1]
            
            for(let m=0; m<=chartDataMonthCount; m++) {  
                if(newDate.getMonth() === m){
                    if(studentIdArray.includes(currentId)){
                        studentMonthCount[m] === undefined ? studentMonthCount[m] = 1 : studentMonthCount[m] += 1
                    }

                    if(parentIdArray.includes(currentId)){
                        parentMonthCount[m] === undefined ? parentMonthCount[m] = 1 : parentMonthCount[m] += 1
                    }

                    if(teacherIdArray.includes(currentId)){
                        teacherMonthCount[m] === undefined ? teacherMonthCount[m] = 1 : teacherMonthCount[m] += 1
                    }
                }
            }  
            
        }

        for(let x=0; x<MONTHS_ARRAY.length; x++) {
            studentMonthCount[x] === undefined ? studentChartData.push({x: (x+1), y: 0}) :  studentChartData.push({x: (x+1), y: studentMonthCount[x]})
            parentMonthCount[x] === undefined ? parentChartData.push({x: (x+1), y: 0}) :  parentChartData.push({x: (x+1), y: parentMonthCount[x]})
            teacherMonthCount[x] === undefined ? teacherChartData.push({x: (x+1), y: 0}) :  teacherChartData.push({x: (x+1), y: teacherMonthCount[x]})
        }
    }

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

    calculateTotalAmount(props) {
        let currentArray = (props.item.data)
        let total = 0;

        for(let i=0; i<currentArray.length; i++) {
            total += currentArray[i].y
        }

        return total
    }

    render() {
        return (
            <>
                {chartDataCollection.map(item => {
                    return(
                        <div key={item.name}>
                            <div className="chart-container--main__description" >
                                Totale aantal {(item.name === TOTAL_STRING) ? '' : item.name} logins in 2020: 
                                <div className="chart-container--main--total-amount">{this.calculateTotalAmount({item})}</div>
                            </div>
                            <DisplayChart dataArray={totalChartData} chartClass={'chart-container--main'} />
                        </div>
                    )
                })}
            </>
        )
    }
}



export default AuthenticationChart