import { Component } from "react";
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { socketService } from "../services/socket.service";
import { openPopover, onLogout, closePopover } from '../store/actions/app.actions'
import { onSaveBoard } from '../store/actions/board.actions'
import { ReactComponent as BoardIcon } from '../assets/img/icons/board.svg'
import { ReactComponent as AddIcon } from '../assets/img/icons/add.svg'
import { ReactComponent as BellIcon } from '../assets/img/icons/notific-bell.svg'
import { ProfileAvatar } from './ProfileAvatar'
import { ElementOverlay } from "./Popover/ElementOverlay";
import { ReactComponent as HomeIcon } from '../assets/img/icons/home.svg'
import BarChartIcon from '@material-ui/icons/BarChart';

class _AppHeader extends Component {

    state = {
        filterTxt: '',
        currOpenModal: '',
        isNewNotific: false,
    }

    componentDidMount() {
        const {board , loggedInUser} = this.props
    }
    componentDidUpdate() {

            // this.setState({ isNewNotific: true })
    }

    toggleCurModal = (modalName = '') => {
        if (this.state.currOpenModal === modalName) this.setState({ currOpenModal: '' })
        else this.setState({ currOpenModal: modalName })
    }

    onOpenNotifics = (ev) => {

        this.setState({ isNewNotific: false }, () => {
            this.onOpenPopover(ev, 'NOTIFICATIONS')
        })
    }

    onOpenPopover = (ev, popoverName) => {
        const { openPopover, onLogout, history, loggedInUser, closePopover } = this.props
        let elPos = ev.target.getBoundingClientRect()
        const props = popoverName === 'PROFILE' ?
            {
                logOutUser: () => {
                    onLogout(loggedInUser)
                    closePopover()
                    history.push('/')
                },
                member: loggedInUser,
                isInCard: false,
                isLoggedInUser: true
            }
            : null
        openPopover(popoverName, elPos, props)
    }

    onLogout = () => {
        const { onLogout, loggedInUser } = this.props
        onLogout(loggedInUser)
    }


    render() {
        const { isNewNotific } = this.state
        const { isBoardStyle, openPopover, loggedInUser } = this.props
        return <div>
            <div className={`main-header flex justify-space-between ${isBoardStyle ? 'in-board' : 'out-board'} `}>
                <div className="btn-header-container flex">

                    <Link to="/workspace" className="btn-header">
                        <HomeIcon />
                    </Link>
                    <Link to={`/workspace/dashboard`} className="btn-header">
                        <BarChartIcon />
                        {/* <span className="wide-layout">Dashboard</span> */}
                    </Link>
                    {/* <button className="boards-btn btn-header flex" onClick={(ev) => this.onOpenPopover(ev, 'BOARDS_SEARCH')}>
                        <BoardIcon />
                        <span>
                            Boards
                        </span>
                        <ElementOverlay />
                    </button> */}
                </div>
                <div className="logo flex align-center">
                    <Link to="/workspace">
                        {/* <BoardIcon /> */}
                        <span>BuildApp</span>
                    </Link>
                </div>
                <div className="btn-header-container flex">
                    <div>
                        <button className="btn-header wide-layout" onClick={() =>{
                            if (loggedInUser.userType === "constructor" || loggedInUser.userType === 'client') return
                            openPopover('CREATE_BOARD')}
                        }>
                            <AddIcon />
                        </button>
                    </div>
                    <ProfileAvatar member={loggedInUser} onOpenPopover={this.onOpenPopover} size={32} />
                </div>
            </div>
        </div>
    }

}

function mapStateToProps(state) {
    return {
        loggedInUser: state.appModule.loggedInUser,
        board: state.boardModule.board
    }
}

const mapDispatchToProps = {
    openPopover,
    onLogout,
    closePopover,
    onSaveBoard
}


export const AppHeader = connect(mapStateToProps, mapDispatchToProps)(withRouter(_AppHeader))



