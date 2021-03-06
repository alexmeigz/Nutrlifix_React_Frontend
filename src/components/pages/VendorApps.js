// MyProductsList.js
// Engineer: Alex Mei

import React, { useState, useEffect } from 'react';

import "./Application.css"
import ApplicationView from "./ApplicationView";
import ApplicationPane from "./ApplicationPane"

function VendorApps (props) {   
    const [results, setResults] = useState({});
    const [isListView, setIsListView] = useState(true);
    const [applicationData, setApplicationData] = useState({})
    const [removed, setRemoved] = useState(false);

    let server = "http://localhost:8118/api"
    if (process.env.REACT_APP_REMOTE === "1") { 
        server = "https://nutriflix-flask-backend.herokuapp.com/api"
    }
    if (process.env.NODE_ENV !== "development") {
        server = "https://nutriflix-flask-backend.herokuapp.com/api"
    }

    useEffect(() => {
        if (isListView) {
            const url = `${server}/application/?display_all=True`
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
        
    }, [server, isListView])
    
    function changeView(event, type, applicationData) {
        setIsListView(prevIsListView => !prevIsListView);
        if (type === "product-pane") {
            setApplicationData(applicationData);
            setRemoved(false);
        }
    };

    function approveApplication(){
        const userurl = `/user/?user_id=${applicationData["user"]}&account_type=${applicationData["type"]}&vendor_name=${applicationData["name"]}&vendor_location=${applicationData["location"]}`
        const applicationurl = `/application/?id=${applicationData["id"]}`
        fetch(server+userurl, {
            method: 'PATCH',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },              
        })
        .then(response => response.json()) 
        .then(data => {
            alert(data["message"])
            fetch(server+applicationurl, {
                method: 'DELETE',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },              
            })
            .then(response => response.json()) 
            .then(data => {
                alert(data["message"])
                setRemoved(true)
            })
            .catch((error) => console.log("Error: " + error))
        })
        .catch((error) => console.log("Error: " + error))
    }

    function denyApplication(){
        const url = `${server}/application/?id=${applicationData["id"]}`
        fetch(url, {
            method: 'DELETE',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },              
        })
        .then(response => response.json()) 
        .then(data => {
            alert(data["message"])
            setRemoved(true)
        })
        .catch((error) => console.log("Error: " + error))
    }

    return (
        <div className="container">
            {!isListView

            ? <div>   
                <h1> Review Application </h1>
                {<ApplicationView applicationData={applicationData} />}
                <button className="product_back_button" onClick={(e) => changeView(e, "product-view")}> Back </button>
                <button className="product_back_button" disabled={removed} onClick={() => approveApplication()}> Approve </button>
                <button className="product_back_button" disabled={removed} onClick={() => denyApplication()}> Deny </button>
            </div>

            : <div>
                <h1> Vendor Applications </h1>

                    <div className="title">
                        Active Applications (Total: {Object.keys(results).length})
                    </div>

                    <div className="application_header">
                        <div className="application_user">
                            User ID
                        </div>
                        <div className="application_date">
                            Application Date
                        </div>
                        <div className="application_type">
                            Application Type
                        </div>
                    </div>

                        {Object.values(results).map(application => (
                            <button className="product_panel_button" onClick={(e) => changeView(e, "product-pane", {
                                user: application["user_id"],
                                date: application["applsDate"],
                                type: application["vendorType"],
                                reason: application["reason"],
                                name: application["restName"],
                                id: application["application_id"],
                                location: application["busLocation"]
                            })}>
                                <ApplicationPane 
                                    user={application["user_id"]}
                                    date={application["applsDate"]} 
                                    type={application["vendorType"]}
                                />   
                            </button>  
                        ))}                
                </div>
            }
        </div>
    );
};

export default VendorApps;