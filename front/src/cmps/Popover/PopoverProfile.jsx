import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Popover } from './Popover'
import { ProfileAvatar } from '../ProfileAvatar'
import { boardService } from '../../services/board.service'
import { onSaveBoard } from '../../store/actions/board.actions'
import { closePopover, onLogout } from '../../store/actions/app.actions'

function _PopoverProfile({
    board,
    card,
    member,
    onSaveBoard,
    closePopover,
    overlayType,
    isInCard = true,
    showStatus = false,
    isLoggedInUser = false, logOutUser, loggedInUser }) {

    const onRemoveMember = () => {
        const memberIdx = card.members.findIndex(currMember => currMember._id === member._id)
        card.members.splice(memberIdx, 1)
        const savedBoard = boardService.updateCardInBoard(board, card);
        onSaveBoard(savedBoard)
        closePopover()
    }

    return (
        <Popover className="clean" overlay={overlayType}>
            <div className="mini-profile-container">
                <div className="mini-profile">
                    <div className="mini-profile-avatar"><ProfileAvatar member={member} size={50} showStatus={showStatus} /></div>
                    <div className="mini-profile-info">
                        <div className="clean-link" onClick={closePopover}>{member.fullname}</div>
                        <p>@{member.username.toLowerCase()}</p>
                        {isLoggedInUser && loggedInUser.userType === 'admin' && <Link to="/users" onClick={closePopover} >משתמשים</Link>}

                    </div>
                </div>
            </div>
            {isInCard && <span className="remove clean-btn" onClick={() => onRemoveMember()}>Remove from card</span>}
            {isLoggedInUser && <span className="remove clean-btn" onClick={logOutUser}>התנתק</span>}
        </Popover >
    )
}

function mapStateToProps(state) {
    return {
        board: state.boardModule.board,
        loggedInUser: state.appModule.loggedInUser
    }
}

const mapDispatchToProps = {
    onSaveBoard,
    closePopover,
    onLogout
}

export const PopoverProfile = connect(mapStateToProps, mapDispatchToProps)(_PopoverProfile)