import React, {Component} from 'react'
import Li from './li'
import axios from 'axios'

export default class Main extends Component{

    constructor(props){
        super(props);
        this.state = {
            //state 초기화 
            list : [], // db 데이타를 저장 (여러개라서 배열로 받아야..)
            member_num : props.member_num,
            listStyle : {
                display : 'none',
            },
            showListStyle : {
                display: 'block',
            },
            // showText: "모두 보기",
            // hideText: "모두 닫기",
            callChildIdx : null,
            currentPage : 1,
        }
        this.list = this.list.bind(this);
        this.updateLike = this.updateLike.bind(this);
        this.updateUnlike = this.updateUnlike.bind(this);
        this.insertReply = this.insertReply.bind(this);
        this.closeAllReplyList = this.closeAllReplyList.bind(this);
        this.moveToReplyListStart = this.moveToReplyListStart.bind(this);
        this.windowScroll = this.windowScroll.bind(this);
        this.scrollToLastReply = this.scrollToLastReply.bind(this);
        this._infiniteScroll = this._infiniteScroll.bind(this);
        this.deleteData = this.deleteData.bind(this);
        this.deleteReply = this.deleteReply.bind(this);

    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // DB 관련 함수 시작 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //list 를 가져올 함수
    list = (currentPage) => {

        var url="http://15.164.144.128:8080/HotelProject/reviewList?currentPage=" + currentPage;

        axios.get(url)
        .then(res => {
            if(currentPage===1){
                this.setState({
                    list : res.data
                })
            }else{
                if(res.data.length === 0){
                    this.setState({
                        currentPage: this.state.currentPage-1,
                    })
                }else{
                    this.setState({
                        list : this.state.list.concat(res.data),
                    })
                }
               
            }
            
        })
        .catch(err => {
            console.error(err); 
        })

    }

    // 무한 스크롤 기능
    _infiniteScroll = () => {
        let scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        let scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        let clientHeight = document.documentElement.clientHeight;

        if(scrollTop+clientHeight===scrollHeight) {
            this.setState({
                currentPage : this.state.currentPage + 1,
            });
            this.list(this.state.currentPage);
        }
    }


    //댓글 인서트 메서드
    insertReply = (data, idx) => {

        var url = "http://15.164.144.128:8080/HotelProject/reviewReplyAdd?review_num=" + data.review_num.value +"&member_num=" + data.member_num.value + "&review_reply_comment=" + data.review_reply_comment.value;

        axios.get(url)
        .then(res => {
            //리스트를 현재 열었던 currentpage만큼 재 리스팅해서 가져와야 한다.? 
            // for(let i = 1 ; i <= this.state.currentPage ; i++){
            //     this.list(i);
            // }
            //위의 방법은 큰 문제가 있다. 왜냐하면 자바스크립트가 비동기 방식이라서 순서대로 for문이 돌아가질 않거던...ㅅㅂ..
            //해결책1 : 보혜씨네 조 처럼 전체 DB 다 가져오고 갯수를 잘라서 보여주는 방식 -> DB가 커지면 엄청 부담될거 같아서 이 방법은 좀..
            //해결책2 : 콜백 지옥으로 처리
            //해결책3 : 부분적으로 댓글리스트만 가져와서 list스테이트의 댓글 리스트만 변경한다면 어떨까? => 잘된다!!!
            
            //일단 DB로부터 새로 갱신된 댓글 리스트를 받아온다.
            let replyList = res.data;
     
            //해당 리뷰 글의 reply_list부분만 새로 받아온걸로 교체한다.
            let changeItem = this.state.list[idx];
            changeItem.reply_list = replyList;

            //이유는 모르겠는데 리액트에서는 배열 관련 꼭 콘캣으로 처리해야되는 부분이 있는것 같다.. (이래놓고 filter나 map 이런건 또 잘됨.. 미스테리)
            //그래서 해당 리뷰글 기준으로 전글, 후글을 나눠서 전글,바뀐글,후글 순서대로 콘캣으로 연결해 주려고 한다.
            let beforeItem = this.state.list.filter( (row, id) => {
                return id < idx
            })

            let afterItem = this.state.list.filter( (row, id) => {
                return id > idx
            })

            this.setState({
                list : beforeItem.concat(changeItem).concat(afterItem),
            })
            
            
        })
        .catch(err => {
            console.error(err); 
        })

    }

    //댓글 삭제하는 함수
    deleteReply = (review_reply_num, idx, review_num) => {

        var url="http://15.164.144.128:8080/HotelProject/reviewReplyDelete?review_reply_num=" + review_reply_num + "&review_num=" + review_num;

        axios.get(url)
        .then(res => {
            
             //일단 DB로부터 새로 갱신된 댓글 리스트를 받아온다.
             let replyList = res.data;
     
             //해당 리뷰 글의 reply_list부분만 새로 받아온걸로 교체한다.
             let changeItem = this.state.list[idx];
             changeItem.reply_list = replyList;
 
             //그래서 해당 리뷰글 기준으로 전글, 후글을 나눠서 전글,바뀐글,후글 순서대로 콘캣으로 연결해 주려고 한다.
             let beforeItem = this.state.list.filter( (row, id) => {
                 return id < idx
             })
 
             let afterItem = this.state.list.filter( (row, id) => {
                 return id > idx
             })
 
             this.setState({
                 list : beforeItem.concat(changeItem).concat(afterItem),
             })

        })
        .catch(err => {
            console.error(err); 
        })

    }



    //update like when heart button is clicked
    updateLike = (idx, review_num) => {

        var url="http://15.164.144.128:8080/HotelProject/reviewUpdateLike?review_num=" + review_num;

        axios.get(url)
        .then(res => {
            
            //일단 DB로부터 새로 갱신된 review_like값을 받아온다.
            let review_like = res.data;
     
            //해당 리뷰 글의 review_like부분만 새로 받아온걸로 교체한다.
            let changeItem = this.state.list[idx];
            changeItem.review_like = review_like;

            //그래서 해당 리뷰글 기준으로 전글, 후글을 나눠서 전글,바뀐글,후글 순서대로 콘캣으로 연결해 주려고 한다.
            let beforeItem = this.state.list.filter( (row, id) => {
                return id < idx
            })

            let afterItem = this.state.list.filter( (row, id) => {
                return id > idx
            })

            this.setState({
                list : beforeItem.concat(changeItem).concat(afterItem),
            })

        })
        .catch(err => {
            console.error(err); 
        })
    }

    updateUnlike = (idx, review_num) => {

        var url="http://15.164.144.128:8080/HotelProject/reviewUpdateUnlike?review_num=" + review_num;

        axios.get(url)
        .then(res => {
            //일단 DB로부터 새로 갱신된 review_like값을 받아온다.
            let review_like = res.data;
     
            //해당 리뷰 글의 review_like부분만 새로 받아온걸로 교체한다.
            let changeItem = this.state.list[idx];
            changeItem.review_like = review_like;

            //그래서 해당 리뷰글 기준으로 전글, 후글을 나눠서 전글,바뀐글,후글 순서대로 콘캣으로 연결해 주려고 한다.
            let beforeItem = this.state.list.filter( (row, id) => {
                return id < idx
            })

            let afterItem = this.state.list.filter( (row, id) => {
                return id > idx
            })

            this.setState({
                list : beforeItem.concat(changeItem).concat(afterItem),
            })

        })
        .catch(err => {
            console.error(err); 
        })
    };


    //게시물 삭제하는 함수 
    deleteData = (review_num) => {

        var url="http://15.164.144.128:8080/HotelProject/reviewDelete?review_num=" + review_num;

        axios.delete(url)
        .then(res => {
            for(let i = 1 ; i <= this.state.currentPage ; i++){
                this.list(i);
            }
        })
        .catch(err => {
            console.error(err); 
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //DB 관련 함수 끝
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //모든 댓글리스트를 닫는 함수
    closeAllReplyList = (idx) => {
        //인자로 받은 idx가 누구인지 받아서 state에 저장한다.
        this.setState({
            callChildIdx : idx,
        })
   
    }

    //댓글보기 버튼을 눌렀을때 스크롤 위치를 댓글 최 상단으로 옮겨주는 함수
    moveToReplyListStart = (idx, callback) => {
            // //시작위치 
            let accHeight = 0;

            for(let i=0 ; i<idx ; i++){
                accHeight += document.getElementById("startReplyPosition"+idx).offsetTop;
                accHeight += 100;
            }

            let startReplyPosition = document.getElementById("startReplyPosition"+idx).offsetTop;
            //그냥 아이디 기준으로 보내보자...
            //좌표 찍지 말고
            
            startReplyPosition += accHeight;

            // //댓글 시작 위치 확인용
            console.log("id : " , ("startReplyPosition"+idx) ,"|| acc Height : " , startReplyPosition);

            // //거기로 옮깁니다.
            // window.scroll({
            // top: startReplyPosition,
            // left: 0,
            // behavior: 'smooth'
            // });

            //위 기능을 콜백으로 처리해보자
            callback(startReplyPosition);

    }

    windowScroll = (startReplyPosition) =>{
        window.scroll({
            top: startReplyPosition,
            left: 0,
            behavior: 'smooth'
            });
    }

    //댓글 작성하기 submit 했을때 최신 댓글 위치가 화면의 맨 하단으로 가게 이동시키는 함수 
    scrollToLastReply = (idx, callback) => {

        let accHeight = 0;

        for(let i=0 ; i<idx ; i++){
            accHeight += document.getElementById("lastReplyPosition"+idx).offsetTop + 20;
        }
        console.log("accHeight" , accHeight);

        let lastReplyPosition = document.getElementById("lastReplyPosition"+idx).offsetTop;
        let clientHeight = document.documentElement.clientHeight;

        lastReplyPosition += accHeight - clientHeight;

        // //댓글 마지막 위치 확인용
        console.log("id : " , ("lastReplyPosition"+idx) ,"|| acc Height : " , lastReplyPosition);

        //위 기능을 콜백으로 처리해보자
        callback(lastReplyPosition);
    }


     componentWillMount(){
        for(let i = 1 ; i <= this.state.currentPage ; i++){
            this.list(i);
        }
        window.addEventListener('scroll', this._infiniteScroll, true);

    }

    


    //render함수 
    render(){
        return(
            <div>
                <ul>
                    {
                        this.state.list.map( (row,idx) => {

                            if(idx===this.state.callChildIdx){ //만약 idx 가 우리가 받은 idx와 같다면...listStyle은 block
                                return <Li idx={idx} row={row} key={idx} 
                                updateLike={this.updateLike} 
                                updateUnlike={this.updateUnlike} 
                                member_num={this.props.member_num}
                                insertReply={this.insertReply}
                                closeAllReplyList = {this.closeAllReplyList}
                                listStyle= {this.state.showListStyle}
                                moveToReplyListStart = {this.moveToReplyListStart}
                                windowScroll = {this.windowScroll}
                                scrollToLastReply = {this.scrollToLastReply}
                                deleteData = {this.deleteData}
                                deleteReply = {this.deleteReply}
                                // showText = {this.state.hideText}
                                list={this.list}></Li>
                            }else{ //만약 idx가 우리가 받은 idx와 다르다면...listStyle은 none
                                return <Li idx={idx} row={row} key={idx} 
                                updateLike={this.updateLike} 
                                updateUnlike={this.updateUnlike} 
                                member_num={this.props.member_num}
                                insertReply={this.insertReply}
                                closeAllReplyList = {this.closeAllReplyList}
                                listStyle= {this.state.listStyle}
                                moveToReplyListStart = {this.moveToReplyListStart}
                                windowScroll = {this.windowScroll}
                                scrollToLastReply = {this.scrollToLastReply}
                                deleteData = {this.deleteData}
                                deleteReply = {this.deleteReply}
                                // showText = {this.state.showText}
                                list={this.list}></Li>
                            }

                          
                        }

                        )
                    }
                </ul>
                <div id="test"></div>
            </div>
        )
    }

}

