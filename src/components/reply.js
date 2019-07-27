import React, {Component} from 'react'


export default class Main extends Component{

    constructor(props){
        super(props);

        let deleteBtnStyle = "";
        //해당 댓글이 로그인한 회원의 댓글일 경우 삭제 버튼이 보여야 한다 
        if(this.props.member_num == this.props.row.member_num){
            deleteBtnStyle = 'inline';
        }else{
            deleteBtnStyle = 'none';
        }

        this.state = {
            //state 초기화 
            deleteBtnStyle : {
                display : deleteBtnStyle,
            }
        }

        this.deleteReply = this.deleteReply.bind(this);
      
    }

    deleteReply = () => {
        this.props.deleteReply(this.props.row.review_reply_num, this.props.idx, this.props.review_num);
    }


    //render함수 
    render(){
        let member_pic = "http://15.164.144.128:8080/HotelProject/save/member_pic/" + this.props.row.member_pic;
        return(
            <div>
                 <div className="review_reply_list_div">
                    <div style={{float:'left'}}><img className="img-circle" src={member_pic} alt="member_pic"></img></div>
                    <div className="reply_comments">
                        <b>{this.props.row.id}</b> {this.props.row.review_reply_comment}
                        {/* 댓글 삭제 아이콘 */}
                        <span style={this.state.deleteBtnStyle} className="replyDeleteBtn" onClick={this.deleteReply}>
                            <i className="fas fa-times"></i>
                        </span>
                        <div style={{clear:'both'}} className="reply_writeday_div">{this.props.row.simpletime}</div>
                    </div>
                </div>
            </div>
        )
    }

}