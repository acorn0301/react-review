import React, {Component} from 'react';
import axios from 'axios';


export default class ReplyForm extends Component{

    constructor(props){
        super(props);

        //스테이트 초기화
        this.state = {
            member_num : this.props.member_num,//여기 this로 변경해봤는데 에러가 나는지 재확인 
            review_num : this.props.review_num,

            mbdto : {
                review_reply_num : null,
                review_num : null,
                member_num : props.member_num,
                review_reply_writeday: null,
                review_reply_comment : ''
            },
            buttonStyle : {
                border: 0,
                color: 'lightskyblue',
                paddingLeft: '10px',
                fontSize: '1em',
                marginTop: '-3px',
            }
        }

     

        //메서드 바인딩 
        this.getMemberData = this.getMemberData.bind(this);
        this.insertReply = this.insertReply.bind(this);

        if(this.state.member_num!==0){
            this.getMemberData(this.state.member_num);
        }

    }

    //서버로부터 db데이타를 받아옴 
    getMemberData = (member_num) => {
        var url="http://15.164.144.128:8080/HotelProject/reviewGetMember?member_num=" + member_num;

        axios.get(url)
        .then(res => {
            this.setState({
                mbdto : res.data
            })
        })
        .catch(err => {
            console.error(err); 
        })

    }

    //댓글 창에 값이 써짐에 따라 달라지는 버튼 style 
    inputChange = (e) => {
        if(e.target.value.length !== 0){ //버튼 활성화 상태 
            this.setState({
                buttonStyle : {
                    border: 0,
                    color: 'deepskyblue',
                    fontWeight: 'bold',
                    paddingLeft: '10px',
                    fontSize: '1em',
                    marginTop: '-3px',
                }
            })
        }else{ //버튼 비활성화 상태 
            this.setState({
                buttonStyle : {
                    border: 0,
                    color: 'lightskyblue',
                    paddingLeft: '10px',
                    fontSize: '1em',
                    marginTop: '-3px',
                }
            })
        }

        if(e.key == 'Enter'){
            this.insertReply();
        }
    }

    //댓글 인서트 메서드
    insertReply = (e) => {
        e.preventDefault();
        this.props.insertReply({...this.refs}, this.props.idx);
        this.props.showReplyList();

        //댓글 창 내용은 비우고 
        this.refs.review_reply_comment.value = '';
        //버튼의 스타일도 비활성화 상태로 바꿈 
        this.setState({
            buttonStyle : {
                border: 0,
                color: 'lightskyblue',
                paddingLeft: '10px',
                fontSize: '1em',
                marginTop: '-3px',
            }
        })

        //부모(li.js)에서 관리하는 writeformStyle의 display를 none으로 변경시켜야 한다.
        this.props.hideWriteForm();

        //스크롤 위치를 최신 댓글 위치로 변경 시켜봅시다.(부모가 가진 함수에요)
        this.props.scrollToLastReply();
        
    }

    goLoginPage = () => {
        console.log('goLoginPage');
        var url="http://15.164.144.128:8080/HotelProject/reactLogin";

        axios.get(url)
        .then(res => {
            this.setState({
                list : res.data
            })
        })
        .catch(err => {
            console.error(err); 
        })



    }
    

    render(){

        let user_pic = "http://15.164.144.128:8080/HotelProject/save/member_pic/" + this.state.mbdto.member_pic;
        let placeholder = this.state.mbdto.id + "님으로 댓글 달기...";

        if(this.props.member_num == 0){
            return(
                <div className="writeform_div">
                    <a href="http://15.164.144.128:8080/HotelProject/reactLogin.do?url=reviewlist.do">
                        <div className="writeform_nologin" >
                        댓글을 작성하시려면 먼저 <span>로그인</span>을 해주세요.
                        {/* 로그인 창으로 유도 및 url 값 넘겨주기!!  */}
                        </div>
                    </a>
                </div>
            )
        }else{
            return(
                <div className="review_reply_list_div writeform_div">
                    <div style={{float:'left'}}><img className="img-circle" src={user_pic} alt="member_pic"></img></div>
                    <div className="reply_comments">
                        <form onSubmit={this.insertReply}>
                        <input type="hidden" ref="member_num" value={this.state.member_num}></input>
                        <input type="hidden" ref="review_num" value={this.state.review_num}></input>
                        
                        <input type="text" ref="review_reply_comment" placeholder={placeholder} onChange={this.inputChange} 
                        // autoFocus={this.props.autoFocus.autoFocus}
                        ></input>
                        <button type="submit" style={this.state.buttonStyle} className="btn btn-xs btn-default" id="reply_submit">게시</button>
                        </form>
                    </div>
                    <div style={{clear:'both'}}></div>
                </div>
            )
        }
        
    }
}