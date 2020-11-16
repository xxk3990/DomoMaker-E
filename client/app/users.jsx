const UserContainer = function(props) {
    if(props.users.length === 0) {
        return (
            <div>
                No users yet!
            </div>
        ); 
    }
    const userList = props.users.map((user) => {
        return (
           <div key = {user.username}>
               <ul>
                    <li>{user.username}</li>
               </ul>
           </div>
        );
    });

    return(
        <div>
            {userList}
        </div>
    );
    
};

const setupUserList = () => {
    
    ReactDOM.render(
        <UserContainer users = {[]} />, document.getElementById("users")
    );
    getListOfUsers();
    console.dir(users);
}
const getListOfUsers = () => {
    const xhr = new XMLHttpRequest();
    const setUsers = () => {
        const userResults = JSON.parse(xhr.response).split("\n");
        console.log(userResults);
        ReactDOM.render(
            <UserContainer users = {[userResults]} />, document.getElementById("users")
        );
    }
    xhr.onload = setUsers;
    xhr.open('GET', '/getUsers');
    xhr.send();
};

$(document).ready(function() {
    setupUserList();
});

// const xhr = new XMLHttpRequest();
// const setUsers = () => {
//     const userList = JSON.parse(xhr.response);
//     ReactDOM.render(<UserContainer users = {userList} />, document.querySelector("#users"))
// }
// xhr.onload = setUsers;
// xhr.open('GET', '/getUsers');
// xhr.send();