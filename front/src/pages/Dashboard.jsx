import React, { Component } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid , Tooltip,Legend } from 'recharts';
import { connect } from 'react-redux'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded'
import { ScreenOverlay } from '../cmps/ScreenOverlay'
import AssignmentIcon from '@material-ui/icons/Assignment';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import { ReactComponent as ExclamationIcon } from '../assets/img/icons/exclamation-lg.svg'
import { ReactComponent as ChartIcon } from '../assets/img/icons/chart.svg'
import { BoardCharts } from '../cmps/BoardCharts'
import { CircularProgressbar } from 'react-circular-progressbar';
import { Loader } from '../cmps/Loader'
import 'react-circular-progressbar/dist/styles.css';

class _Dashboard extends Component {

    state = {
        chartsData: null
    }

    componentDidMount() {
        const cardsPerMemberMap = this.cardsPerMemberMap
        const cardsPerLabelMap = this.cardsPerLabelMap
        const cardsPerListMap = this.cardsPerListMap
        this.setState({ chartsData: { cardsPerMemberMap, cardsPerLabelMap, cardsPerListMap } })
    }

    get allCards() {
        const { lists } = this.props.board
        return lists.reduce((acc, list) => {
            acc = acc.concat(list.cards)
            return acc
        }, [])
    }

    get cardsCount() {
        const { lists } = this.props.board
        const cardsCount = lists.reduce((acc, list) => {
            acc += list.cards.length
            return acc
        }, 0)
        return cardsCount
    }

    get overdueCardsCount() {
        const { lists } = this.props.board
        const overdueCardsCount = lists.reduce((acc, list) => {
            const overdueCardsCountPerList = list.cards.reduce((acc, card) => {
                if ( card.isOverDue) acc++
                else if (card.dueDate < Date.now() && card.dueDate && !card.isDone) acc++
                return acc
            }, 0)
            acc += overdueCardsCountPerList
            return acc
        }, 0)
        return overdueCardsCount
    }

    get completedCardsCount() {
        const { lists } = this.props.board
        const completedCardsCount = lists.reduce((acc, list) => {
            const dueSoonCardsCountPerList = list.cards.reduce((acc, card) => {
                if (card.isDone) acc++
                return acc
            }, 0)
            acc += dueSoonCardsCountPerList
            return acc
        }, 0)
        return completedCardsCount
    }


    get criticalTasksCount() {
        const { lists } = this.props.board
        const criticalTasksCount = lists.reduce((acc, list) => {
            const criticalTasksCountList = list.cards.reduce((acc, card) => {
                if (card.urgency) {
                    acc++
                }
                return acc
            }, 0)
            acc += criticalTasksCountList
            return acc
        }, 0)
        return criticalTasksCount
    }



    get cardsPerMemberMap() {
        const { members } = this.props.board
        const allCards = this.allCards
        const cardsPerMemberMap = members.reduce((acc, member) => {
            if (!acc[member.fullname]) acc[member.fullname] = 0
            const cardsPerMemberCount = allCards.reduce((acc, card) => {
                const memberIdx = card.members.findIndex(currMember => currMember._id === member._id)
                if (memberIdx > -1 && !card.isDone) acc++
                return acc
            }, 0)
            acc[member.fullname] = cardsPerMemberCount
            return acc
        }, {})
        return cardsPerMemberMap
    }


    get cardsPerLabelMap() {
        const { labels } = this.props.board
        const allCards = this.allCards
        const cardsPerLabelMap = labels.reduce((acc, label) => {
            if (!acc[label.title]) acc[label.title] = { count: 0 }
            const cardsPerLabelCount = allCards.reduce((acc, card) => {
                const labelIdx = card.labelIds.findIndex(currLabelId => currLabelId === label.id)
                if (labelIdx > -1 && !card.isDone) acc++
                return acc
            }, 0)
            acc[label.title].count = cardsPerLabelCount
            return acc
        }, {})
        return cardsPerLabelMap


    }

    get completedCardsPerListMap() {
        const { lists } = this.props.board

        let data = []
        for(let i=0 ; i<lists.length; i++) {
            data.push(this.createListCardsData(lists[i] , i , "onTime"))
        }
        console.log(data)
        return data
    }
    get cardsPerListMap() {
        const { lists } = this.props.board

        let data = []
        for(let i=0 ; i<lists.length; i++) {
            data.push(this.createListCardsData(lists[i] , i , "total"))
        }
        console.log(data)
        return data
    }

    createListCardsData = (list , i , type) => {
        let openTasks = 0
        let completedTasks = 0
        let overDue = 0
        let onTime = 0
        list.cards.forEach((card) => {
            if(!card.isDone) openTasks++
            else {
                completedTasks++
                if(!card.isOverDue) onTime++
            }
            if (card.isOverDue || (card.dueDate < Date.now() && card.dueDate ) ) overDue++
        })
        if (type === "total") return {
            name: list.title ,
            open: openTasks ,
            completed: completedTasks ,
            amt : Math.floor(Math.random()*200)+ 2100
        }   
        if (type === "onTime") return {
            name: list.title ,
            onTime: onTime ,
            overDue: overDue ,
            amt : Math.floor(Math.random()*200)+ 2100
        }   
    }
    // createListcompletedCardsData = (list , i) => {
    //     let openTasks = 0
    //     let completedTasks = 0
    //     list.cards.forEach((card) => {
    //         // if(!card.isDone) openTasks+=1
    //         else completedTasks+=1
    //     })
    //     return {
    //         name: list.title ,
    //         open: openTasks ,
    //         completed: completedTasks ,
    //         amt : Math.floor(Math.random()*200)+ 2100
    //     }   
    // }

    get progressCircleStyle() {
        return {
            path: {
                stroke: ` #2fb4f5`,
                transition: 'stroke-dashoffset 0.5s ease 0s',
                transformOrigin: 'center center',
            },
            trail: {
                stroke: '#ffffff',
                strokeLinecap: 'butt',
                transform: 'rotate(0.25turn)',
                transformOrigin: 'center center',
            },
            text: {
                fill: '#ffffff',
                fontSize: '25px',

            },
        }
    }
    get completedPercentage() {
        return +((this.completedCardsCount / this.cardsCount * 100).toFixed(1))
    }
    get overduePercentage() {

        return +((this.overdueCardsCount / this.cardsCount * 100).toFixed(1))
    }

    goBackToBoard = () => {
        const { board } = this.props
        this.props.history.push(`/board/${board._id}`)
    }

    render() {
        const totalData = this.cardsPerListMap
        const onTimeData =  this.completedCardsPerListMap
        // console.log(data ,"data in render")
        const { chartsData } = this.state
        if (!chartsData) return <Loader />
        return (
            <>
                <ScreenOverlay styleMode="heavy-dark" />
                <section className="dashboard-container flex column">
                    <CloseRoundedIcon className="close-svg" onClick={() => this.goBackToBoard()} />
                    <div className="general-statistics flex justify-center wrap">

                        <div className="stats flex justify-space-between  ">
                            <div className="content flex  column justify-space-between">

                                <h3 className="flex align-center"><AssignmentIcon /> ????"?? ???????????? ????????'???????? </h3>
                                <h4>{this.cardsCount}</h4>
                            </div>
                            <ChartIcon />
                        </div>

                        <div className="stats flex justify-space-between  ">
                            <div className="content flex  column justify-space-between">
                                <h3 className="flex align-center">  <QueryBuilderIcon /> ???????????? ??????????????</h3>
                                <h4>{this.completedCardsCount}</h4>
                            </div>
                            <CircularProgressbar value={this.completedPercentage} text={`${this.completedPercentage}%`}
                                styles={this.progressCircleStyle} />
                        </div>

                        <div className="stats flex justify-space-between  ">
                            <div className="content flex  column justify-space-between">

                                <h3 className="flex align-center"><ExclamationIcon />???????????? </h3>
                                <h4>{this.overdueCardsCount}</h4>
                            </div>
                            <CircularProgressbar value={this.overduePercentage} text={`${this.overduePercentage}%`}
                                styles={this.progressCircleStyle} />
                        </div>
                    </div>
                    <div className="board-charts-con flex">
                        <div className="board-chart">
                            <BoardCharts label={'hello 1'}  data={totalData} dataKey1={"open"} dataKey2={"completed"} />
                        </div>
                        <div className="board-chart">
                            <BoardCharts data={onTimeData} dataKey1={"overDue"} dataKey2={"onTime"} />
                        </div>
                    </div>
                </section>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        board: state.boardModule.board,
    }
}

export const Dashboard = connect(mapStateToProps, null)(_Dashboard)
