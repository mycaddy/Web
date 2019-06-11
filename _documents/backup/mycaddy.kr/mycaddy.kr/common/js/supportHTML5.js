if (!Modernizr.canvas){
	document.createElement("address");
	document.createElement("article");
	document.createElement("aside");
	document.createElement("figure");
	document.createElement("footer");
	document.createElement("header");
	document.createElement("hgroup");
	document.createElement("menu");
	document.createElement("nav");
	document.createElement("section");

	$(document).ready(readyDoc_supportHTML5);
}

function readyDoc_supportHTML5() {
	$(document.getElementsByTagName("address")).css("display", "block");
	$(document.getElementsByTagName("article")).css("display", "block");
	$(document.getElementsByTagName("aside")).css("display", "block");
	$(document.getElementsByTagName("figure")).css("display", "block");
	$(document.getElementsByTagName("footer")).css("display", "block");
	$(document.getElementsByTagName("header")).css("display", "block");
	$(document.getElementsByTagName("hgroup")).css("display", "block");
	$(document.getElementsByTagName("menu")).css("display", "block");
	$(document.getElementsByTagName("nav")).css("display", "block");
	$(document.getElementsByTagName("section")).css("display", "block");
}