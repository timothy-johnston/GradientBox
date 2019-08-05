// For color conversions:
// https://github.com/bgrins/TinyColor

//For hanlding user input of text rgb or hex:
//Do an event listner for lose focus of text input field or submit button
//  on lose focus, re-gen color pickers

var apiURL = "http://127.0.0.1:8000";
var apiPathRandomGradient = "/api/randomgradient";
var apiPathGradients = "/api/gradients/";

$( document ).ready(function() {

    createColorPickers()

    test = {gradient_css: "testFromUI", gradient_name: "tj_gradient", gradient_author: "ui"};

    initiateAddGradient(test)

    //Event listeners
    $('#btn-surprise').click(function() {



    })

})

function createColorPickers() {

    var colorPicker1 = new iro.ColorPicker("#color-picker-1", {
        width: 300,
        color: "#ffffff"
    });
    var colorPicker2 = new iro.ColorPicker("#color-picker-2", {
        width: 300,
        color: "#bbbbbb"
    });

    colorPicker1.on(["color:init", "color:change"], function(color) {
        updateInput1Fields(color)
        updateGeneratedCss()
    });

    colorPicker2.on(["color:init", "color:change"], function(color) {
        updateInput2Fields(color)
        updateGeneratedCss()
    });

    

}

function updateInput1Fields(color) {

    var hex = color.hexString;
    var rgbSplit = (color.rgbString).substring(4).split(",");

    $("#rgba-input-R-1").val(parseInt(rgbSplit[0]));
    $("#rgba-input-G-1").val(parseInt(rgbSplit[1]));
    $("#rgba-input-B-1").val(parseInt(rgbSplit[2]));
    $("#hex-input-1").val(hex.substring(1));

}

function updateInput2Fields(color) {

    var hex = color.hexString;
    var rgbSplit = (color.rgbString).substring(4).split(",");

    $("#rgba-input-R-2").val(parseInt(rgbSplit[0]));
    $("#rgba-input-G-2").val(parseInt(rgbSplit[1]));
    $("#rgba-input-B-2").val(parseInt(rgbSplit[2]));
    $("#hex-input-2").val(hex.substring(1));

}

function updateGeneratedCss() {

    var colorString1;
    var colorString2;


    if ($("#lbl-colorformat-hex-custom").hasClass("active")) {
        colorString1 = "#" + $("#hex-input-1").val();
        colorString2 = "#" + $("#hex-input-2").val();
    } else {
        colorString1 = "rgba(" + $("#rgba-input-R-1").val() + "," + $("#rgba-input-G-1").val() + ", " + $("#rgba-input-B-1").val() + ")";
        colorString2 = "rgba(" + $("#rgba-input-R-2").val() + "," + $("#rgba-input-G-2").val() + ", " + $("#rgba-input-B-2").val() + ")";
    }

    var css = "linear-gradient(90deg, " + colorString1 + " 0%, " + colorString2 + " 100%);";

    $("#generated-css").text(css);

}

function getRandomGradient() {
    $.ajax({
        url: apiURL + apiPathRandomGradient,
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem("jwt"));
        },
        type: "GET",
        success: function(result, status, xhr) {
            var gradient = result[0];
            updateRandomGradient(gradient)
        },
        failure: function(result, status, xhr) {
            console.log("something broke :(")
        }
    });
}

function updateRandomGradient(gradient) {
    var gradientCss = gradient.gradient_css;
    var gradientName = gradient.gradient_name;
    var gradientAuthor = gradient.gradient_author;
    updateSurpriseGradSection(gradientCss, gradientName, gradientAuthor)
}

function updateSurpriseGradSection(gradientCss, gradientName, gradientAuthor) {

    //jQuery here to update the html

}

function initiateAddGradient() {

    //Gets an array of gradient css, name, and author
    gradientProperties = getGradientProperties()

    //POST request, persist gradient to db
    addGradientAjaxRequest(gradientProperties)

}

function getGradientProperties() {

    //jQuery to get values from css, author, and name fields

}

function addGradientAjaxRequest(gradient) {
	
	var payload = gradient;

	$.ajax({
		url: apiURL + apiPathGradients,
		dataType: 'json',
		type: 'post',
		contentType: 'application/json',
		data: JSON.stringify(payload),
		success: function(result, status, xhr){
			console.log("great job man!");
		}
	});
}