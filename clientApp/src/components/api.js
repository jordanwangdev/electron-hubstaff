const req = require('request');
const { IPC_URL } = require('../enums');
const { dialog } = require('electron')

/* 
    login and get user data
*/
function loginAPI(username, password, callback) {

    var userInfo = {
        email: username,
        password: password
    };

    var clientServerOptions = {
        url: 'https://api.workship.in/auth/login',
        body: JSON.stringify(userInfo),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    req(clientServerOptions, function (error, res) {
        var values = JSON.parse(res.body);
        if (values.statusType == 'error') {
            const options = {
                type: 'info',
                message: 'Connection Error!'
            };
            dialog.showMessageBox(null, options);
        } else {
            callback(error, values);
        }
    });
}

/*
    when play button is clicked 
    - get current server time
    - get current capture state in current time(10mins) ;
*/
function getCurrentIdleState(employeeData, callback) {
    var url = IPC_URL.WEBSERVER_URL + IPC_URL.GETCURRENTSTATE_URL + "?employeeId=";
    url = url.concat(employeeData._id);
    req.get(url, function (err, res, body) {
        if (err) {
            const options = {
                type: 'info',
                message: 'Connection Error!'
            };
            dialog.showMessageBox(null, options);
        }
        else {
            callback(res, body);
        }
    });
}


/* 
    update idletime and mouse/keyboard state
*/
function updateActionAPI(actionData, callback) {

    console.log(actionData);
    console.log(JSON.stringify(actionData));
    var clientServerOptions = {
        uri: IPC_URL.WEBSERVER_URL + IPC_URL.UPLOADSTATE_URL,
        body: JSON.stringify(actionData),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    req(clientServerOptions, function (error, response) {
        // console.log(error,response.body);
        callback();
        return;
    });

}

module.exports = {
    loginAPI, getCurrentIdleState, updateActionAPI
}