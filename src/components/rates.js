import React, {Component} from 'react'


export default class Main extends Component{

    constructor(props){
        super(props);
        this.state = {
            //state 초기화 
        }
    }



    //render함수 
    render(){
        let rate = this.props.rate;

        if(rate == 0){
            return(
                <div>
                    <i className='far fa-star'></i>
                    <i className='far fa-star'></i>
                    <i className='far fa-star'></i>
                    <i className='far fa-star'></i>
                    <i className='far fa-star'></i>
                    <div style={{clear:'both'}}></div>
                </div>
            )
        }else if(rate == 1){
            return(
                <div>
                    <i className='fas fa-star'></i>
                    <i className='far fa-star'></i>
                    <i className='far fa-star'></i>
                    <i className='far fa-star'></i>
                    <i className='far fa-star'></i>
                    <div style={{clear:'both'}}></div>
                </div>
            )
        }else if(rate == 2){
            return(
                <div>
                    <i className='fas fa-star'></i>
                    <i className='fas fa-star'></i>
                    <i className='far fa-star'></i>
                    <i className='far fa-star'></i>
                    <i className='far fa-star'></i>
                    <div style={{clear:'both'}}></div>
                </div>
            )
        }else if(rate == 3){
            return(
                <div>
                    <i className='fas fa-star'></i>
                    <i className='fas fa-star'></i>
                    <i className='fas fa-star'></i>
                    <i className='far fa-star'></i>
                    <i className='far fa-star'></i>
                    <div style={{clear:'both'}}></div>
                </div>
            )
        }else if(rate == 4){
            return(
                <div>
                    <i className='fas fa-star'></i>
                    <i className='fas fa-star'></i>
                    <i className='fas fa-star'></i>
                    <i className='fas fa-star'></i>
                    <i className='far fa-star'></i>
                    <div style={{clear:'both'}}></div>
                </div>
            )
        }else{
            return(
                <div>
                    <i className='fas fa-star'></i>
                    <i className='fas fa-star'></i>
                    <i className='fas fa-star'></i>
                    <i className='fas fa-star'></i>
                    <i className='fas fa-star'></i>
                    <div style={{clear:'both'}}></div>
                </div>
            )
        }


    }

}