var app = new Vue({
    el: '#app',
    data: {
        username: "",
        password: ""
    },
    methods: {
        onLogin
    }
})


var connected = false;
var socket = io();
socket.on('connect', () => changeConnectionState(true));
socket.on('disconnect', () => changeConnectionState(false));

// Server connection handler
function changeConnectionState(state){
    connected = state;
    checkConnection();
}

function checkConnection(){
    if(connected !== true){
        $('body').dimmer({
            closable: false
        });
        $('body').dimmer("show");
        return false;
    }
    $('body').dimmer("hide");
    return true;
}

// Login handler
function onLogin(){
    if(!connected) return;
    socket.once('res.login', onLoginResponse);
    socket.emit('login', this.username, this.password);
}

function onLoginResponse(d) {
    console.log(d);
}