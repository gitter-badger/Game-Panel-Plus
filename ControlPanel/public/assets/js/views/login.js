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
socket.on('connect', () => {
    connected = true;
    checkConnection();
});
socket.on('disconnect', () => {
    connected = false;
    checkConnection();
});

// Server connection handler
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
    if(!checkConnection()) return;
    socket.once('res.login', onLoginResponse);
    socket.emit('login', this.username, this.password);
}

function onLoginResponse(d) {
    console.log(d);
}