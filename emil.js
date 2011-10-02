// -*- mode: javascript; coding: utf-8 -*-
// Copyright (C) 2011 Per Odlund <per.odlund@gmail.com>
// Copyright (C) 2011 Göran Weinholt <goran@weinholt.se>

var minibuf_active = false;
var minibuf_callback;

function pycall() {
    // This calls a function in the python part of Emil. First setting
    // the title to false prevents multiple identical calls from
    // getting lost.
    document.title = "false";
    args = [];
    for (var i = 0; i < arguments.length; i++)
	args[i] = arguments[i];
    document.title = JSON.stringify(args)
}
function main_eval(str) {
    pycall("main_eval",str);
}
function minibuf_eval(str) {
    pycall("minibuf_eval",str);
}
function status_eval(str) {
    pycall("status_eval",str);
}
function with_minibuf(fun) {
    // Provides a convenient way to access the minibuf document
    str = "("+fun+")(";
    for (var i = 1; i < arguments.length; i++) {
	str += JSON.stringify(arguments[i]);
	if (i < arguments.length-1) str += ",";
    }
    str += ");";
    minibuf_eval(str);
}
function with_main(fun) {
    // Provides a convenient way to access the main document
    str = "("+fun+")(";
    for (var i = 1; i < arguments.length; i++) {
	str += JSON.stringify(arguments[i]);
	if (i < arguments.length-1) str += ",";
    }
    str += ");";
    main_eval(str);
}

function global_key_set(key, fun) {
    pycall("global_key_set", key, fun.name||fun+"");
}

function kill_emil() {
    pycall("kill_emil");
}

function unused_key(key) {
    update_minibuf(key + " has no binding");
}

function user_input(prompt,def,callback) {
    // Request input from the user. Would be so much better with
    // recursive editing.
    with_minibuf(
    	function(prompt, def) {
	    document.getElementById("p").innerHTML = prompt;
	    document.body.text = "#00ffff";
	    var line = document.minibuf.line;
	    line.value = def;
	    line.focus();
	    line.selectionStart = def.length;
    	}, prompt, def);
    minibuf_active = true;
    minibuf_callback = callback.name||callback+"";
    pycall("minibuf_focus");
}

function update_minibuf(msg) {
    with_minibuf(
    	function(msg) {
	    document.getElementById("p").innerHTML = msg;
	    document.body.text = "#eeeeee";
	    document.minibuf.line.value = "";
    	}, msg);
}

function open_url(url) {
    // TODO: this would be done in a new webview.
    document.location = url;
}

function open_file(fn) {
    pycall("load_file", "buf0", fn);
}

function _load_file_cb(buf_id, fn, contents) {
    var buf = document.getElementById(buf_id);
    buf.value = contents;
    buf.selectionStart = 0;
    buf.selectionEnd = 0;
}

function message(str) {
    update_minibuf(str);
}

function return_pressed() {
    if (minibuf_active == true) {
	minibuf_active = false;

	with_minibuf(
	    function (callback)  {
		pycall("main_focus");
		main_eval("("+callback+")("+JSON.stringify(document.minibuf.line.value)+")");
		update_minibuf("");
		// with_main(function(callback,input) {
		//     callback(input); 
		// }, callback,document.minibuf.line.value);
	    }, minibuf_callback);
    }
}

function init_emil() {
    // This is called when all three pages are loaded.
    global_key_set("C-x C-c", kill_emil);
    global_key_set("C-c C-l",
		   function () {
		       user_input("Go to URL: ", "http://weinholt.se", open_url);
		   });
    global_key_set("C-x C-f",
		   function () {
		       user_input("Open file: ", "", open_file);
		   });
    global_key_set("Return", return_pressed);
    global_key_set("KP_Enter", return_pressed);
    document.body.bgColor = "#102e4e";
    document.body.text = "#eeeeee";
    with_minibuf(function() {
	document.body.bgColor = "#102e4e";
	document.body.text = "#00ffff";
	document.minibuf.line.style.color = "#eeeeee";
    });
    message("Hello, world!");
}
