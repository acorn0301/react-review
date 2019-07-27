import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux'


 
const Root = ({store}) => {

    
 return (
    // <BrowserRouter>
    // <App/>
    // </BrowserRouter>


    <Provider store={store} basename={process.env.PUBLIC_URL}> 
        <HashRouter> 
            root...
            <App/> 
        </HashRouter> 
    </Provider>


 );
};

export default Root;