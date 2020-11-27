// VendorsPage.js
// Engineer: Joseph Ng

import React, {useState, useEffect} from 'react';

import NavigationBar from '../common/NavigationBar';
import ContactUsFooter from "../common/ContactUsFooter";
import AccountInfoBar from "../common/AccountInfoBar";
import VendorProfileView from "./VendorProfileView";
import VendorPane from "./VendorPane";

// eslint-disable-next-line
import FilterOption from "./FilterOption.js"

import "./Vendor.css"

function VendorsPage (props) {
    const [results, setResults] = useState({})
    // eslint-disable-next-line
    const [filters, setFilters] = useState({
        account_type: null
    });

    const [isListView, setIsListView] = useState(true);
    const [vendorView, setVendorView] = useState()

    let server = "https://nutriflix-flask-backend.herokuapp.com/api"
    // let server = "http://localhost:8118/api"

    let url = `${server}/user/?display_all=True&filter=vendor`

    useEffect(() => {
        if (isListView) {
            fetch(url, {
                method: 'GET',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },              
            })
            .then(response => response.json()) 
            .then(data => {
                setResults(data)
            })
            .catch((error) => console.log("Error: " + error))
        }
    }, [isListView, url])

    // eslint-disable-next-line
    function filter(param, value){
        let newUrl = url;
        if(value != null){
            newUrl += `&account_type=${param}`
        }
        fetch(newUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },              
            })
        .then(response => response.json()) 
        .then(data => {
            setResults(data)
        })
        .catch((error) => console.log("Fetch Failure (is server up?): "+ error))
    }

    function changeView(event, type, vendorData) {
        setIsListView(prevIsListView => !prevIsListView);
        if (type === "vendor-pane" && vendorData && isListView) {
            setVendorView(<VendorProfileView 
                isLoggedIn={props.isLoggedIn} 
                user={props.user} 
                onUserChange={props.onUserChange} 
                vendor={vendorData.vendor}
            />);
        }
    };

    function handleLoginChange(value) {
        props.onLoginChange(value)
    }
    function handleUserChange(value) {
        props.onUserChange(value)
    }



    return (
    
        <div>
            <NavigationBar isLoggedIn={props.isLoggedIn} onLoginChange={handleLoginChange} user={props.user}/>
            {props.isLoggedIn ? <AccountInfoBar user={props.user} onUserChange={handleUserChange}/> : null}

            
            {!isListView
            ? <div><button className="vendor_back_button" onClick={(e) => changeView(e, "vendor-view")}>Back</button>
                {vendorView}
            </div>
            : <div className="container">
                <h1>Vendors</h1>
                {/* <div className="side_panel">
                    <div className="title">
                        Filters
                    </div>
                    <div className="filters"> 
                        <FilterOption name="Home Vendor" param="Home" value="" 
                            filters={filters} changeFilter={setFilters} onChange={filter} field={filters.account_type} 
                        />
                        <FilterOption name="Business Vendor" param="Business" value="true" 
                            filters={filters} changeFilter={setFilters} onChange={filter} field={filters.account_type}
                        />
                    </div>
                </div> */}
                <div className="vendor_panel">
                    <div className="title">
                        Vendor Results (Total: {Object.keys(results).length})
                    </div>
                    {Object.values(results).map(vendor => (
                        <button className="vendor_panel_button" onClick={(e) => changeView(e, "vendor-pane", {
                            vendor: vendor
                        })}>
                            <VendorPane user={props.user} onUserChange={handleUserChange} vendor={vendor}/>
                        </button>
                    ))}
                </div>
                
            
            </div>}

            <ContactUsFooter />
        </div>
    );
};

export default VendorsPage;