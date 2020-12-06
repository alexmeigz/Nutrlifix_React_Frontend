// BlogView.js
// Engineer: Alex Mei

import React, {useState} from "react";
import AddComment from "./AddComment.js"
import CommentPane from "./CommentPane.js"
import BlogUpdatePanel from "./BlogUpdatePanel.js"

import "./PostView.css"
import heart from "../../assets/heart.png";
import heart_default from "../../assets/heart_default.png";

function BlogView(props) {
    const [removed, setRemoved] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [adding, setAdding] = useState(false);
    const [liked, setLiked] = useState(props.postData["reacted_users"].includes(JSON.parse(sessionStorage.getItem("user")).user_id));
    const [numLikes, setLikes] =useState(props.postData["reacted_users"].length);
    const [comments, setComments] = useState({});
    const [showing, setShowing] = useState(false);

    let server = "http://localhost:8118/api"
    if (process.env.REACT_APP_REMOTE === "1") { 
        server = "https://nutriflix-flask-backend.herokuapp.com/api"
    }
    if (process.env.NODE_ENV !== "development") {
        server = "https://nutriflix-flask-backend.herokuapp.com/api"
    }

    function showComments(event){
        if(showing === true){
            setShowing(false);
        }
        else{
            let url = `${server}/comment/?display_all=True&post_id=${props.postData.post_id}`
            fetch(url, {
                method: 'GET',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },           
            })
            .then(response => response.json()) 
            .then(data => {
                console.log(data)
                setComments(data)
                setShowing(true)
            })
            .catch((error) => console.log("Show comment error: "+ error))
        }
    }

    function react(event){
        let url = `${server}/reaction/?user_id=${JSON.parse(sessionStorage.getItem("user")).user_id}&post_id=${props.postData.post_id}`
        if(liked){
            fetch(url, 
                {
                    method: 'DELETE',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },           
                })
                .then(response => response.json()) 
                    .then(data => {
                    if(data["message"] === "Reaction successfully removed"){
                        alert("Reaction successfully removed")
                        setLikes(numLikes - 1);
                        setLiked(false);
                    }
                    else{
                        alert(`Error deleting reaction: ${data["message"]}`)
                    }
                })
                .catch((error) => console.log("Reaction delete error: "+ error))
        }
        else{
            fetch(url, 
                {
                    method: 'POST',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },           
                })
                .then(response => response.json()) 
                    .then(data => {
                    if(data["message"] === "Reaction created successfully!"){
                        alert("Reaction created successfully!")
                        setLikes(numLikes + 1);
                        setLiked(true);
                    }
                    else{
                        alert(`Error creating reaction: ${data["message"]}`)
                    }
                })
                .catch((error) => console.log("Reaction delete error: "+ error))
        }
    }

    function addComment(event) {
        event.preventDefault();
        setAdding((prevAdding => !prevAdding));
        setUpdating(false);
    }

    function updatePost(event) {
        event.preventDefault();
        setAdding(false);
        setUpdating((prevUpdating => !prevUpdating));
    }

    function removePost(event) {
        event.preventDefault();
        
        let url = `${server}/post/?post_id=${props.postData["post_id"]}`
        fetch(url, 
            {
                method: 'DELETE',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },           
            })
            .then(response => response.json()) 
                .then(data => {
                if(data["message"] === "Post successfully removed"){
                    alert("Post successfully removed")
                    setRemoved(true);
                }
                else{
                    alert(`Error deleting post: ${data["message"]}`)
                }
            })
            .catch((error) => console.log("Post delete error: "+ error))
    }

    if(props.postData["image_url"]){
        return (
            <div className="post-pane">
                <div className="row">
                    <img className="post-image" alt=""
                        src={props.postData["image_url"] && props.postData["image_url"]}
                    />
                    <div className="post-column">
                        <div className="post-title row">
                            {props.postData["title"]}
                        </div>
                        <div className="post-user row">
                            By: {props.postData["username"]}
                        </div>
                        <div className="post-time row">
                            Last Edited: {props.postData["last_edit"]}
                        </div>
                    </div>
                </div>
                <div className="post-caption">
                    {props.postData["content"]}
                </div>
                <div className="row">
                    <div className="post-reacts">
                        { liked ?
                            <div className="post-reacts">
                                <input type="image" className="react-image" alt="" src={heart} 
                                    height="20px" onClick={react}/>
                                <div className="react-count"> {numLikes} </div>
                            </div>
                            :
                            <div className="post-reacts">
                                <input type="image" className="react-image" alt="" src={heart_default} 
                                    height="20px" onClick={react}/>
                                <div className="react-count"> {numLikes} </div>
                            </div>
                        }  
                    </div>
                    <div className="post-comments">
                        Comments
                    </div>
                </div>
                {(JSON.parse(sessionStorage.getItem("user")).user_id === props.postData.user_id || JSON.parse(sessionStorage.getItem("user")).user_id.account_type === "Admin") &&
                    <div>
                        <button className="post-button" onClick={removePost} disabled={removed}>{!removed ? "Remove Post": "Removed!"}</button>
                        <button className="post-button" onClick={updatePost} disabled={removed}>{!updating ? "Update Post": "Cancel Update"}</button>
                    </div>
                }

                {updating
                    ? <BlogUpdatePanel postData={props.postData} cancelUpdate={() => setUpdating(false)}/>
                    : null
                }
            </div>
        );
    }
    else{
        return (
            <div className="post-pane">
                <div className="post-title row">
                    {props.postData["title"]}
                </div>
                <div className="post-user row">
                    By: {props.postData["username"]}
                </div>
                <div className="post-time row">
                    Last Edited: {props.postData["last_edit"]}
                </div>
                <div className="post-caption">
                    {props.postData["content"]}
                </div>
                <div className="row">
                    { liked ?
                        <div className="post-reacts">
                            <input type="image" className="react-image" alt="" src={heart} 
                                height="20px" onClick={react}/>
                            <div className="react-count"> {numLikes} </div>
                        </div>
                        :
                        <div className="post-reacts">
                            <input type="image" className="react-image" alt="" src={heart_default} 
                                height="20px" onClick={react}/>
                            <div className="react-count"> {numLikes} </div>
                        </div>
                    }  
                    <div className="post-comments">
                        <button className="comment-button" onClick={showComments}> {!showing ? "Show Comments (X)": "Hide Comments"} </button> 
                    </div>

                    { showing && 
                        <div className="row comments">
                            {Object.values(comments).map(comment => (
                                <CommentPane 
                                    content={comment["com_info"]}
                                    user={comment["user_id"]}
                                    date={comment["com_date"]}
                                    />
                            ))}
                        </div>
                    }
                </div>
                {(JSON.parse(sessionStorage.getItem("user")).user_id === props.postData.user_id || JSON.parse(sessionStorage.getItem("user")).account_type === "Admin") &&
                    <div>
                        <button className="post-button" onClick={removePost} disabled={removed}>{!removed ? "Remove Post": "Removed!"}</button>
                        <button className="post-button" onClick={updatePost} disabled={removed}>{!updating ? "Update Post": "Cancel Update"}</button>
                    </div>
                }
                { JSON.parse(sessionStorage.getItem("isLoggedIn")) &&
                    <button className="post-button" onClick={addComment} disabled={removed}>{!adding ? "Add Comment": "Cancel Comment"}</button>
                }

                {updating
                ? <BlogUpdatePanel postData={props.postData} cancelUpdate={() => setUpdating(false)}/>
                : null
                }
                {adding ?
                    <AddComment postData={props.postData} cancelComment={() => setAdding(false)}/>
                :
                    null
                }
            </div>
        );
    }
};

export default BlogView;