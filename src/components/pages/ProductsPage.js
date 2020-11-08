// ProductsPage.js
// Engineer: Joseph Ng

import React from 'react';

import NavigationBar from '../common/NavigationBar';
import ContactUsFooter from "../common/ContactUsFooter";
import AccountInfoBar from "../common/AccountInfoBar";



function ProductsPage (props) {
    return (
        // TODO
        <div>
            <NavigationBar isLoggedIn={props.isLoggedIn? "LoggedIn": null}/>
            {props.isLoggedIn ? <AccountInfoBar /> : null}
            
            {/* Import from Alex's branch */}
            
            <ContactUsFooter />
        </div>
    );
};

export default ProductsPage;