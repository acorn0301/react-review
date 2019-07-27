import React, {Component} from 'react';
import Ul from './ul';


const Main = ({match}) => {
      return (
        <Ul member_num={match.params.member_num}></Ul>
     );
};

export default Main;

