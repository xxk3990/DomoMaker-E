const handleDomo = (e) => {
    e.preventDefault();
    $("#domoMessage").animate({
        width: 'hide'
    }, 350);
    if ($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoHeight").val() == '') {
        handleError('RAWR! All fields are required.');
        return false;
    }
    sendAjax('POST', $("#domoForm").attr('action'), $("#domoForm").serialize(), function () {
        loadDomosFromServer();
    });
    return false;
}
const DomoForm = (props) => {
    return(
        <form id = "domoForm"
            onSubmit = {handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm">
                <label htmlFor = "name">Name: </label>
                <input id="domoName" type="text" name="name" placeholder="Domo name" />
                <label htmlFor = "age">Age: </label>
                <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
                <label htmlFor = "height">Height (feet): </label>
                <input id="domoHeight" type="number" min="1" max="10" step="0.1" name="height"/>
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="makeDomoSubmit" type="submit" value="Make Domo" />
            </form>
    )
}
const DomoList = function(props) {
    if(props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className = "emptyDomo">No Domos Yet</h3>
            </div>
        );
    }
    const domoNodes = props.domos.map(function(domo) {
        return (
            <div key={domo._id} className='domo'>
                <img src = "/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <section className = "domo-data">
                    <h4 className = "domoName">Name: {domo.name} </h4>
                    <h4 className = "domoAge">Age: {domo.age}</h4>
                    <h4 className = "domoHeight">Height: {domo.height + "ft"}</h4>
                </section>
            </div>
        )
    });
    return(
        <div className="domoList">
            {domoNodes}
        </div>
    );
}
const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos = {data.domos} />, document.querySelector("#domos")
        );
    });
}

const setup = function(csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );
    ReactDOM.render(
        <DomoList domos = {[]} />, document.querySelector("#domos")
    );
    loadDomosFromServer();
}
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    })
}
$(document).ready(function() {
    getToken();
})
