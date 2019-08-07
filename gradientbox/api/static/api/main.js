// For color conversions:
// https://github.com/bgrins/TinyColor

//For hanlding user input of text rgb or hex:
//Do an event listner for lose focus of text input field or submit button
//  on lose focus, re-gen color pickers

var apiURL = "https://tedwardj11.pythonanywhere.com";
// var apiURL = "http://127.0.0.1:8000";
var apiPathRandomGradient = "/api/randomgradient";
var apiPathGradients = "/api/gradients/";
var cssFormatCustomHex = true;
var colorStringsToPersist;

$( document ).ready(function() {

    getRandomGradient();

    createColorPickers();

    //Event listeners
    $('.btn-surprise').click(function() {
        $('html, body').animate({
            scrollTop: $("#section-surprise").offset().top
        }, 1000);
        getRandomGradient();
    })

    $('#btn-custom').click(function() {
        $('html, body').animate({
            scrollTop: $("#section-custom").offset().top
        }, 1000);
        getRandomGradient();
    })

    $('.lbl-colorformat-custom').click(function() {

        if ($(this).attr('id') == "lbl-colorformat-hex-custom") {
            cssFormatCustomHex = true;
        } else {
            cssFormatCustomHex = false;
        }

        updateGeneratedCss();
    })

    $('#gradient-submit-btn').click(function() {

        //Need to do some validations here
        //Use jQuery validate to check that a gradient and author name have been entered

        //Use ajax call to get gradients and confirm this css hasn't been used before
        //Will need to put initiateAddGradient in the success callback block
        //  AFTER doing an if (!allPreviousGradientCss.includes(CssToSubmit))
        //      else display error message

        initiateAddGradient();
    });

})

function createColorPickers() {

    var wheelWidth = setColorPickerWidth()

    var colorPicker1 = new iro.ColorPicker("#color-picker-1", {
        width: wheelWidth,
        color: "#ffffff"
    });
    var colorPicker2 = new iro.ColorPicker("#color-picker-2", {
        width: wheelWidth,
        color: "#ffffff"
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

//Can't set wheel width with css, so for mobile set width on page 
//load based on screen width
function setColorPickerWidth() {
    
    var windowWidth = $(window).width();
    var wheelWidth;

    if (windowWidth >= 767) {
        wheelWidth = 250;
    } else {
        wheelWidth = 150;
    }

    return wheelWidth;

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


    if (cssFormatCustomHex) {
        colorString1 = "#" + $("#hex-input-1").val();
        colorString2 = "#" + $("#hex-input-2").val();
    } else {
        colorString1 = "rgba(" + $("#rgba-input-R-1").val() + ", " + $("#rgba-input-G-1").val() + ", " + $("#rgba-input-B-1").val() + ")";
        colorString2 = "rgba(" + $("#rgba-input-R-2").val() + ", " + $("#rgba-input-G-2").val() + ", " + $("#rgba-input-B-2").val() + ")";
    }

    var css = "linear-gradient(90deg, " + colorString1 + " 0%, " + colorString2 + " 100%)";

    colorStringsToPersist = ["#" + $("#hex-input-1").val(), "#" + $("#hex-input-2").val()];

    $("#generated-css").text(css + ";");

    updateCustomSectionBackground(css);

}

function updateCustomSectionBackground(css) {

    $('#section-custom').css("background", css);

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

    $('#gradient-surprise-name').text(gradientName);
    $('#gradient-surprise-author').text(gradientAuthor);
    $('#gradient-surprise-css').text(gradientCss + ";");

    $('#section-surprise').css("background", gradientCss);

}

function initiateAddGradient() {

    //Gets an array of gradient css, name, and author
    gradientProperties = getGradientProperties()

    //POST request, persist gradient to db
    addGradientAjaxRequest(gradientProperties)

}

function getGradientProperties() {

    //jQuery to get values from css, author, and name fields

    var css = "linear-gradient(90deg, " + colorStringsToPersist[0] + " 0%, " + colorStringsToPersist[1]  + " 100%)";

    var properties = {gradient_css: css, gradient_name: $('#submit-gradient-name').val(), gradient_author: $('#submit-author-name').val()};

    return properties;

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
			//TODO: Display Submission Successful notification
		}
	});
}
