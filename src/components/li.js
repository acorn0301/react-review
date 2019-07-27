import React, {Component} from 'react';
import Rates from './rates';
import Reply from './reply';
import ReplyForm from './replyform';
import { NONAME } from 'dns';

export default class Li extends Component{

    constructor(props){
        super(props);

        //글 삭제 버튼이 보이기 위한 조건 : 현재 로그인 한 회원과 게시물을 작성한 회원이 일치 할 때 
        let moreBtnStyle = "";
        if(this.props.member_num == this.props.row.member_num){
            moreBtnStyle = 'inline';
        }else{
            moreBtnStyle = 'none';
        }
        

        this.state = {
            show : {
                display: 'inline'
            },
            hide : {
                display: 'none'
            },
            rateDetailStyle :{
                display : 'none',
            },
            replyListStyle : {
                display : this.props.listStyle.display
            },
            // showOrHide : this.props.showText,
            showOrHide : "모두 보기",
            writeformStyle : {
                display : 'none',              
            },
            lastReplyPosition : 0,
            member_num : props.member_num,
            moreBtnStyle : {
                display: moreBtnStyle,
            },
            touchtime : 0,
            heartStyle : {
                opacity: 0,
            },
            alreadyLiked : 'no',


        };

        this.clickHeart = this.clickHeart.bind(this);
        this.unclickHeart = this.unclickHeart.bind(this);
        this.openDetailDiv = this.openDetailDiv.bind(this);
        this.toggleReplyList = this.toggleReplyList.bind(this);
        this.changeShowOrHide = this.changeShowOrHide.bind(this);
        this.showWriteForm = this.showWriteForm.bind(this);
        this.hideWriteForm = this.hideWriteForm.bind(this);
        this.scrollToLastReply = this.scrollToLastReply.bind(this);
        this.lastPositionConsolelog = this.lastPositionConsolelog.bind(this);
        this.hideWriteForm = this.hideWriteForm.bind(this);
        this.closeAllReplyList = this.closeAllReplyList.bind(this);
        this.scrollToLastReply = this.scrollToLastReply.bind(this);
        this.deleteData = this.deleteData.bind(this);
        this.showHeart = this.showHeart.bind(this);
        
    }


    //functions for li component

    //when to click empty heart button
    clickHeart = () => {

        //update like 
        this.props.updateLike(this.props.idx, this.props.row.review_num);

        this.setState({
            show : {
                display : 'none'
            },
            hide : {
                display : 'inline'
            },
            alreadyLiked : 'yes',
        })
    }

    //when to cancel clicked heart 
    unclickHeart = () => {

        //update unlike
        this.props.updateUnlike(this.props.idx, this.props.row.review_num);
 
        this.setState({
            show : {
                display : 'inline'
            },
            hide : {
                display : 'none'
            },
            alreadyLiked : 'no',
            
        })
    }

    //when to click rating div : show detail of ratings 
    openDetailDiv = () => {
        if(this.state.rateDetailStyle.display == 'none'){
            this.setState({
                rateDetailStyle : {
                    display : 'block',  
                    position: 'absolute',
                    top: '30px',
                    backgroundColor : 'white',
                    zIndex: 10
                }
            })
        }else{
            this.setState({
                rateDetailStyle : {
                    display : 'none',  
                }
            })
        }
        
    }

    //댓글 리스트를 열고 닫아주는 함수 
    toggleReplyList = () => {

        //아래 함수가 호출되면 댓글 토글 시 남의 댓글은 자동으로 닫힌다.
        // this.closeAllReplyList(this.props.idx);
        
        if(this.state.showOrHide == "모두 보기"){
            this.setState({
                replyListStyle : {
                    display : 'block'
                }
            });
       
        }else{
            this.setState({
                replyListStyle : {
                    display : 'none'
                }
            });
        }

            //  //시작위치 잡을 id 
            // let startReplyPositionId = "startReplyPosition" + this.props.row.review_num;
            // console.log("check id ", startReplyPositionId);

            // //시작위치 
            // let startReplyPosition = document.getElementById(startReplyPositionId).offsetTop;

            // //댓글 시작 위치 확인용
            // console.log("start reply list position : " , startReplyPosition);

            // //거기로 옮깁니다.
            // window.scroll({
            // top: startReplyPosition,
            // left: 0,
            // behavior: 'smooth'
            // });

        //스크롤을 해당 글의 댓글 리스트 최상단으로 옮겨주기
        // this.props.moveToReplyListStart(this.props.idx, this.props.windowScroll);
        
        //모두 보기 <-> 모두 닫기 문구 변경 
        this.changeShowOrHide();

        //만약 댓글 작성창이 기존에 열려있었다면 닫아줘야 한다.
        this.hideWriteForm();

    }

    
    //모든 댓글 리스트를 닫는 함수
    closeAllReplyList = (idx) => {
        //호출하는 자식의 인덱스를 부모에게 보냄 
        this.props.closeAllReplyList(idx);
        
    }

    //마지막 댓글위치를 출력하는 함수 
    lastPositionConsolelog = () => {      
        console.log("last reply position " , document.getElementById("lastReplyPosition").offsetTop);
    }

    
    //댓글 리스트를 보여주는 함수 
    showReplyList = () => {
        this.closeAllReplyList(this.props.idx);
        this.setState({
                    replyListStyle : {
                        display : 'block'
                    }
                });
        
    }


    //모두 보기 모두 닫기 토글 함수 
    changeShowOrHide = () => {
        if(this.state.showOrHide == "모두 보기"){
            this.setState({
                showOrHide : "모두 닫기"
            })
        }else if(this.state.showOrHide == "모두 닫기"){
            this.setState({
                showOrHide : "모두 보기"
            })
        }
    }


    //댓글 작성창을 보이게 하는 함수
    showWriteForm = () => {
        this.setState({
            writeformStyle : {
                display: 'block',
                zIndex : 10,
            },
            // autoFocus : {
            //     autoFocus : 'true'
            // } //이거 왜 안될까.... 슬프다..
        })

        this.showReplyList();

    }

    //댓글 작성창을 숨기게 하는 함수
    hideWriteForm = () => {
        this.setState({
            writeformStyle : {
                display : 'none',
            }
        })
    }

    //최신댓글 위치로 스크롤을 이동시키는 함수 
    //혹시 이걸 부모로 옮겨야 하나...?
    scrollToLastReply = () => {
        this.props.scrollToLastReply(this.props.idx, this.props.windowScroll);
    }

    // //자식(reply)로 부터 lastReplyPosition의 값을 받는 함수
    // getLastReplyPosition = (e) => {
    //     this.setState({
    //         lastReplyPosition : 
    //     })
    // }

    //게시물을 삭제하는 함수 
    deleteData = (review_num) => {
        this.props.deleteData(this.props.row.review_num);
    }

    //이미지 더블클릭 시 하트가 나타났다가 사라지게
    showHeart = () => {
        
        if (this.state.touchtime == 0) {
            // set first click
            this.setState({
                touchtime : new Date().getTime(),
            })
        } else {
            // compare first click to this click and see if they occurred within double click threshold
            if (((new Date().getTime()) - this.state.touchtime) < 800) {
                // double click occurred

                //하트 보이게 
                this.setState({
                    heartStyle : {
                        opacity: 1,
                        animation : 'showHeart 2s',
                        animationTimingFunction: 'ease',
                    },
                    touchtime : 0,
                })

                //0.9초 뒤에 다시 사라지도록 
                setTimeout(
                    function() {
                        this.setState({
                            heartStyle : {
                                opacity: 0,
                            }
                        })
                    }
                    .bind(this),
                    1900
                );

                //좋아요 버튼 누른 효과
                if(this.state.alreadyLiked!='yes'){
                    this.clickHeart();
                }

            } else {
                // not a double click so set as a new first click
                this.setState({
                    touchtime : new Date().getTime(),
                })
            }
        }
    }
    

    //render함수 
    render(){

        //복잡한 스트링 처리는 미리 해주도록 합니다.
        let review_img = "http://15.164.144.128:8080/HotelProject/save/review/" + this.props.row.review_img;
        let member_pic = "http://15.164.144.128:8080/HotelProject/save/member_pic/" + this.props.row.member_pic;
        let heart = "http://15.164.144.128:8080/HotelProject/save/images/heart.png";

        let startReplyPositionId = "startReplyPosition" + this.props.idx;
        // let replyListId = "replyList" + this.props.row.review_num;

        let lastReplyPositionId = "lastReplyPosition" + this.props.idx;
        
        //별점 총점 계산 
        let totalRate = (this.props.row.review_clean + this.props.row.review_dining + this.props.row.review_location + this.props.row.review_service + this.props.row.review_service)/5;
        totalRate = Math.round(totalRate);

        // '모두 보기' '모두 닫기' 
        let showOrHideText = '';

        // 댓글이 없을 경우 아무 문구도 띄우지 않습니다.
        if(this.props.row.review_reply_count == 0){
            showOrHideText = '';
        }else{
            showOrHideText = this.state.showOrHide;
        }

        //스크롤 천천히 내리게 하기 위한 작업..
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
        
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        return(
            <div>
                <li>
                    <div className="review_div">
                        
                        {/* 작성자 프로필, 아이디 출력 */}
                        <div className="review_member_div">
                            <img className="" src={member_pic} alt="member_pic"></img>
                            <b>{this.props.row.id}</b>
                        </div>

                        {/* 별점 총점 이 출력(상세별점은 숨겨져 있음) */}
                        <div className="review_rating_div" onClick={this.openDetailDiv}>
                                     <Rates rate={totalRate}></Rates>
                                <div style={{clear:'both'}}></div>
                                
                                {/* 상세 별점 */}
                                <div className="review_rating_details_div" style={this.state.rateDetailStyle}>
                                    <i className="fas fa-broom" ></i> <Rates  rate={this.props.row.review_clean}></Rates>
                                    <div style={{clear:'both'}}></div>
                                    <i className="fas fa-utensils"></i><Rates rate={this.props.row.review_dining}></Rates>
                                    <div style={{clear:'both'}}></div>
                                    <i className="fas fa-map-marker-alt"></i><Rates rate={this.props.row.review_location}></Rates>

                                    <i className="fas fa-smile"></i> <Rates rate={this.props.row.review_service}></Rates>
                                    <i className="fas fa-dollar-sign"></i><Rates rate={this.props.row.review_price}></Rates>
                                </div>
                        </div>


                        
                        <div className="review_below">
                        
                            {/* 사진 나오는곳  */}
                            <div className="review_pics_div" >
                                <img src={review_img} alt="review_pic" ></img>
                                <div style={this.state.heartStyle} className="imgHeart" onClick={this.showHeart}><img src={heart} alt="heart"></img></div>
                            </div>


                            {/* 좋아요버튼, 댓글쓰기 버튼  */}
                            <div className="review_func_div">
                                {/* 좋아요 버튼 - 비어있는 하트  */}
                                <span ref="emptyHeart" style={this.state.show} >
                                    <i className="far fa-heart" onClick={this.clickHeart}></i>
                                </span>
                                {/* 좋아요 버튼 - 채워져있는 하트 */}
                                <span ref="filledHeart" style={this.state.hide} >
                                    <i className="fas fa-heart" style={{color:'orangered'}} onClick={this.unclickHeart}></i>
                                </span>
                                {/* 댓글쓰기 버튼 */}
                                <span><i className="far fa-comment" onClick={this.showWriteForm}></i></span>
                                {/* 수정, 삭제 버튼 */}
                                <span style={this.state.moreBtnStyle} className="review_func_more" onClick={this.deleteData} ><i className="fas fa-times"></i></span>
                                <div style={{clear: 'both'}}></div>
                            </div>


                            {/* 댓글 작성 창 */}
                            <div className="review_reply_writeform_div" style={this.state.writeformStyle}>
                                        <ReplyForm member_num={this.props.member_num}
                                        review_num={this.props.row.review_num}
                                        insertReply={this.props.insertReply}
                                        idx = {this.props.idx} 
                                        showReplyList={this.showReplyList}
                                        //    autoFocus = {this.state.autoFocus}
                                        hideWriteForm = {this.hideWriteForm}
                                        scrollToLastReply = {this.scrollToLastReply}
                                        ></ReplyForm>   
                            </div>


                            {/* 좋아요 갯수 출력 */}
                            <div className="review_like_div">
                                <b>좋아요 {this.props.row.review_like} 개 </b>
                            </div>

                            {/* 내용 출력  */}
                            <div className="review_content_div">
                                <b>{this.props.row.id}</b> {this.props.row.review_comment}
                            </div>

                             {/* 작성 시간 출력  */}
                             <div className="review_writeday_div">
                                {this.props.row.simpletime}
                            </div>

                            {/* 댓글 출력  */}
                            <div className="review_reply_div div_last" id={startReplyPositionId}>
                                {/* <a href={"#"+startReplyPositionId}>test!!!</a> */}
                                {/* <div onClick={this.toggleReplyList}>
                                    <span>댓글 {this.props.row.review_reply_count} 개 {showOrHideText}</span>
                                </div> */}
                                <div >
                                    <a className="a_reply" href={"#"+startReplyPositionId} onClick={this.toggleReplyList}>댓글 {this.props.row.review_reply_count} 개 {showOrHideText}</a>
                                </div>

                                {/* <div style={this.props.listStyle} ref={replyListId}> */}
                                    <div className="review_reply_list_div" style={this.state.replyListStyle}>
                                        {
                                            this.props.row.reply_list.map( (row,idx) => 
                                                (<div key={row.review_reply_num}>
                                                    <Reply row={row} idx={this.props.idx} 
                                                    review_num={this.props.row.review_num}
                                                    member_num={this.state.member_num}
                                                    deleteReply = {this.props.deleteReply}
                                                    ></Reply>
                                                <div style={{clear:'both'}}></div></div>)
                                            )
                                        }
                                        
                                        {/* 댓글 목록 내부에 위치한 댓글 작성창  */}
                                        <div className="review_reply_writeform_div_inList" >
                                        <ReplyForm member_num={this.props.member_num}
                                        review_num={this.props.row.review_num}
                                        insertReply={this.props.insertReply}
                                        idx = {this.props.idx} 
                                        showReplyList={this.showReplyList}
                                        //    autoFocus = {this.state.autoFocus}
                                        hideWriteForm = {this.hideWriteForm}
                                        scrollToLastReply = {this.scrollToLastReply}
                                        ></ReplyForm>   
                                        </div>

                                    </div>
                                {/* </div> */}
                                <div id={lastReplyPositionId}></div>
                            </div>

                        </div>

                    </div>
                </li>
            </div>
        )
    }

}
