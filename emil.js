// -*- mode: javascript; coding: utf-8 -*-
// Copyright (C) 2011 Per Odlund <per.odlund@gmail.com>
// Copyright (C) 2011 Göran Weinholt <goran@weinholt.se>

function pycall() {
    // This calls a function in the python part of Emil.
    args = [];
    for (var i = 0; i < arguments.length; i++)
	args[i] = arguments[i];
    document.title = JSON.stringify(args)
}

function global_key_set(key, code) {
    pycall("global_key_set", key, code);
}

function kill_emil() {
    pycall("kill_emil");
}

// function user_input(callback) {
//     pycall("user_input",callback);
// }

function open_url(url) {
    console.log("Should open url: "+url);
}

function minibuf_eval(str) {
    pycall("minibuf_eval",str);
}
function status_eval(str) {
    pycall("status_eval",str);
}

function message(str) {
    minibuf_eval("update_minibuf("+JSON.stringify(str)+");");
}

function init_emil() {
    // This is called when all three pages are loaded.
    global_key_set("C-x C-c", "kill_emil();");
    //global_key_set("C-x C-l", "user_input(open_url);");
    document.body.bgColor = "#102e4e";
    document.body.text = "#eeeeee";
    minibuf_eval("document.body.bgColor = \"#102e4e\";");
    minibuf_eval("document.body.text = \"#eeeeee\";");
    message("Hello, world!");
}
