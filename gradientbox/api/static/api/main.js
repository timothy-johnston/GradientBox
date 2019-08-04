// For color conversions:
// https://github.com/bgrins/TinyColor

var apiURL = "http://127.0.0.1:8000";
var apiPathRandomGradient = "/api/randomgradient";
var apiPathGradients = "/api/gradients/";

$( document ).ready(function() {

    
    test = {gradient_css: "testFromUI", gradient_name: "tj_gradient", gradient_author: "ui"};

    addGradient(test)





})

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