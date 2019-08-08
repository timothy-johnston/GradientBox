// For color conversions:
// https://github.com/bgrins/TinyColor

var apiURL = "https://tedwardj11.pythonanywhere.com";
//var apiURL = "http://127.0.0.1:8000";
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

        //TODO: Use ajax call to get gradients and confirm this css hasn't been used before
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
            
            //TODO: This is a bandaid fix for a bug on the back end
            //I sometimes return result = undefined from updateRandomGradient, haven't figured out why yet
            //For now I'll check whether a gradient was returned; if not, make the call again and check again
            //Need to put a proper fix in though in the api
            //I also check whether the random gradient matches the current gradient. this will stay.
            if (result.length > 0) {
                
                //Check that retrieved gradient is different from current gradient
                //If same, get a new gradient
                var gradient = result[0];
                var currentGradient = $('#gradient-surprise-css').text();
                currentGradient = currentGradient.substring(0, currentGradient.length - 1);
                if (gradient.gradient_css != currentGradient) {
                    updateRandomGradient(gradient)
                } else {
                    getRandomGradient();
                }

            } else {
                getRandomGradient();
            }
            
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

    //Ensure user has entered an author name and gradient name
    if (gradientInputIsValid()) {

        //Gets an array of gradient css, name, and author
        gradientProperties = getGradientProperties()

        //POST request, persist gradient to db
        addGradientAjaxRequest(gradientProperties)

    } else {
        validateMessage = "Please enter values for gradient name and author."
        showTopNotification(validateMessage);

        //Disable submit button for 5 seconds
        $('#gradient-submit-btn').prop("disabled", true);
        setTimeout(enableSubmitButton, 5000);
    }
}

//Reenable submit button
function enableSubmitButton() {
    $('#gradient-submit-btn').prop("disabled", false);
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
		beforeSend: function(xhr, settings) {
			if (!this.crossDomain) {
				xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
			}
		},
		type: 'post',
		contentType: 'application/json',
		data: JSON.stringify(payload),
		success: function(result, status, xhr){
            
            //Submission was successful. Notify the user
            var successMessage = "Submission successful! You're a true artist."
            showTopNotification(successMessage);

            clearInputFields();


		}
	});
}

//Validates that user has entered gradient name and author information
//Very basic for now - TODO check for length, obscenity, etc
function gradientInputIsValid() {
    if ($('#submit-gradient-name').val() != null && $('#submit-gradient-name').val() != undefined && $('#submit-author-name').val() != null && $('#submit-author-name').val() != undefined) {
    	if ($('#submit-gradient-name').val().length > 0 && $('#submit-author-name').val().length >  0 ) {
        	return true;
    	}
    }
    return false;
}

//Displays the top notification box for 30 seconds
function showTopNotification(message) {
    $('#notification-top').text(message);
    $('#notification-box-top').fadeToggle("fast", "linear");
    $('#notification-box-top').css("display", "flex");
    $('#notification-box-top').css("flex-direction", "column");
    $('#notification-box-top').css("justify-content", "center");

    //Close notification after 5 seconds
    setTimeout(closeTopNotification, 5000);

}

function clearInputFields() {
    $('.gradient-submit-input').val('');
}

function closeTopNotification() {
    $('#notification-box-top').fadeToggle("slow", "linear");
}

//Following django tutorial to get a cookie
//Will be initially used to get the csrf token for our ajax post
function getCookie(cookieName) {

	var cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);
			if (cookie.substring(0, cookieName.length + 1) === (cookieName + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(cookieName.length + 1));
				break;
			}
		}
	}
	return cookieValue
}

