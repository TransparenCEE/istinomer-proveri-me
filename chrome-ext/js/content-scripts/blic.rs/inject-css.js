/** Hightlight factcheck logic implementation for blic.rs **/


var API_URL_GET_CHECKED_FACTS = "http://datacentar.io/app/istinomer-factchecker/api/get-page-fact-check-requests";
var currentTabUrl  = window.location.href;

var greenList = ['Half true', 'Mostly true', 'True', 'Consistent', 'In progress', 'Almost fulfilled', 'Fulfilled'];
var yellowList = ['Stalled','In between'];
var redList = ['Pants on fire','False', 'Not started', 'Unfulfilled', 'Inconsistent', 'Mostly false'];

function getHighlightClassBasedOnGrade(value){
    if($.inArray( value, greenList )>=0){
        return  "light-green";
    }
    else if($.inArray( value, yellowList )>=0){
        return  "yellow";
    }
    else if($.inArray( value, redList )>=0){
        return  "red";
    }
    else {
        return "light-grey";
    }
}

function styleFactCheckRequest(statement, grade) {
    $("#lead,#detail").find('p').each(function () {
        var str = $(this).text();
        if (str.indexOf(statement) !== -1) {
            $(this).html(
                $(this).html().replace(statement, "<span class=" + getHighlightClassBasedOnGrade(grade) + "> $& <span id='grade-logo-factchecker'></span></span> ")
            );
        }
    });
}

var data = {currentUrl: currentTabUrl};
$.ajax({
    type: "POST",
    url: API_URL_GET_CHECKED_FACTS,
    crossDomain: true,
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function(respData){
        for (var index = 0; index < respData.length; index++) {
            var statement = respData[index]["text"];
            var grade = respData[index]["grade"];

            styleFactCheckRequest(statement, grade);
        }
    },
    error: function(err){
        console.error("Unexpected error while trying to retrieve fact-checking requests for blic.rs");
    }
});

