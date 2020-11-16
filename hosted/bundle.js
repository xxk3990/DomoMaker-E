"use strict";

var handleDomo = function handleDomo(e) {
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
};

var DomoForm = function DomoForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "domoForm",
    onSubmit: handleDomo,
    name: "domoForm",
    action: "/maker",
    method: "POST",
    className: "domoForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "domoName",
    type: "text",
    name: "name",
    placeholder: "Domo name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "age"
  }, "Age: "), /*#__PURE__*/React.createElement("input", {
    id: "domoAge",
    type: "text",
    name: "age",
    placeholder: "Domo Age"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "height"
  }, "Height (feet): "), /*#__PURE__*/React.createElement("input", {
    id: "domoHeight",
    type: "number",
    min: "1",
    max: "10",
    step: "0.1",
    name: "height"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeDomoSubmit",
    type: "submit",
    value: "Make Domo"
  }));
};

var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "domoList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyDomo"
    }, "No Domos Yet"));
  }

  var domoNodes = props.domos.map(function (domo) {
    return /*#__PURE__*/React.createElement("div", {
      key: domo._id,
      className: "domo"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "domo face",
      className: "domoFace"
    }), /*#__PURE__*/React.createElement("section", {
      className: "domo-data"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "domoName"
    }, "Name: ", domo.name, " "), /*#__PURE__*/React.createElement("h4", {
      className: "domoAge"
    }, "Age: ", domo.age), /*#__PURE__*/React.createElement("h4", {
      className: "domoHeight"
    }, "Height: ", domo.height + "ft")));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "domoList"
  }, domoNodes);
};

var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
      domos: data.domos
    }), document.querySelector("#domos"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoForm, {
    csrf: csrf
  }), document.querySelector("#makeDomo"));
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
    domos: []
  }), document.querySelector("#domos"));
  loadDomosFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var UserContainer = function UserContainer(props) {
  if (props.users.length === 0) {
    return /*#__PURE__*/React.createElement("div", null, "No users yet!");
  }

  var userList = props.users.map(function (user) {
    return /*#__PURE__*/React.createElement("div", {
      key: user.username
    }, /*#__PURE__*/React.createElement("ul", {
      className: "users-list"
    }, /*#__PURE__*/React.createElement("li", null, user.username)));
  });
  return /*#__PURE__*/React.createElement("div", null, userList);
};

var setupUserList = function setupUserList() {
  ReactDOM.render( /*#__PURE__*/React.createElement(UserContainer, {
    users: []
  }), document.getElementById("users"));
  getListOfUsers();
  console.dir(users);
};

var getListOfUsers = function getListOfUsers() {
  var xhr = new XMLHttpRequest();

  var setUsers = function setUsers() {
    var userResults = JSON.parse(xhr.response).split("\n");
    console.log(userResults);
    ReactDOM.render( /*#__PURE__*/React.createElement(UserContainer, {
      users: [userResults]
    }), document.getElementById("users"));
  };

  xhr.onload = setUsers;
  xhr.open('GET', '/getUsers');
  xhr.send();
};

$(document).ready(function () {
  setupUserList();
}); // const xhr = new XMLHttpRequest();
// const setUsers = () => {
//     const userList = JSON.parse(xhr.response);
//     ReactDOM.render(<UserContainer users = {userList} />, document.querySelector("#users"))
// }
// xhr.onload = setUsers;
// xhr.open('GET', '/getUsers');
// xhr.send();
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
