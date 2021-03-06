import React, { Component } from 'react'
import { TextareaAutosize } from '@material-ui/core';
import FmdBadIcon from '@mui/icons-material/FmdBad';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { utilsService } from '../services/utils.service'
import { boardService } from '../services/board.service'
import { socketService } from '../services/socket.service'
import { onSaveBoard } from '../store/actions/board.actions'
import { connect } from 'react-redux'

export class _CardAdd extends Component {

    state = {
        titleTxt: '' ,
        isUrgent: false ,
        isNew : true ,
    }

    componentDidMount() {
        const { loggedInUser } = this.props
    }
    
    handleChange = (ev) => {
        const { value } = ev.target;
        if (ev.key === 'Enter') {
            ev.preventDefault();
            this.onAddCard()
            return;
        }
        this.setState({ titleTxt: value });
    }
    
    onAddCard = (isReject) => {
        const { titleTxt , isUrgent, isNew } = this.state;
        if (!titleTxt) {
            this.textArea.focus();
            return;
        }

        const { board, currList, saveBoard , onSaveBoard , loggedInUser} = this.props;
        const listIdx = board.lists.findIndex(list => list.id === currList.id);

        const card = {
            id: utilsService.makeId(),
            title: titleTxt,
            description: '',
            comments: [],
            checklists: [],
            members: [],
            byMember: loggedInUser, 
            labelIds: [],
            createdAt: Date.now(),
            startDate: 0,
            dueDate: 0,
            attachs: [],
            isReject: isReject,
            isUrgent: isUrgent,
            isNew: isNew ,
            style: {
                coverMode: (isUrgent) ? 'full':'',
                bgColor: ''
            }
        }
        const cardToEdit = boardService.addActivityToCard(card , 'add' , loggedInUser , null ,null , board.lists[listIdx].title)
        // this.props.onEditBoard(board)card , actionType , byMember , txt=null , member=null , listTitle=null
        const boardToEdit = boardService.addActivityToBoard(board, cardToEdit.activity[0])
        board.lists[listIdx].cards.push(cardToEdit)
        saveBoard(boardToEdit)
        onSaveBoard(boardToEdit)
        this.setState({ titleTxt: '' }, () => {
            this.textArea.focus()
        })
    }
    
    onToggleUrgentTask = ()=>{ 
        const isUrgent = this.state.isUrgent
        this.setState({isUrgent : !isUrgent})
    }

    render() {
        const { titleTxt , isUrgent} = this.state
        const { toggleCardAdd , loggedInUser } = this.props;
        return (
            <div className="card-add">
                <div className="card-add-input-container">
                    <TextareaAutosize className="card-add-input" ref={(textArea) => this.textArea = textArea} value={titleTxt} autoFocus onChange={this.handleChange} onKeyDown={this.handleChange} placeholder="???????? ?????????? ????????????" aria-label="empty textarea" />
                    <FmdBadIcon className="card-preview-urgent-btn" style={{color: isUrgent ? '#EB5A46' : '#6b778c'}} onClick={this.onToggleUrgentTask}/>
                </div>
                <div className="flex">
                    {loggedInUser.userType !== 'client' && loggedInUser.userType !== 'constructor' && (<div>
                        <button className="primary-btn" onMouseDown={(ev) => this.onAddCard(false)}>???????? ??????????</button>
                    </div>)}
                    <button className="primary-btn" onMouseDown={(ev) => this.onAddCard(true)}>???????? ??????'????</button>
                    <CloseRoundedIcon onMouseDown={() => toggleCardAdd()} />
                </div>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
      loggedInUser: state.appModule.loggedInUser,
    //   board : state.boardModule.board,
    }
  }
const mapDispatchToProps = {
    onSaveBoard,
}

  
  export const CardAdd = connect(mapStateToProps , mapDispatchToProps)(_CardAdd)
  