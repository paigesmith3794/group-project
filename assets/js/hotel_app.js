// /* 
// HOTEL_APP.JS PSEUDOCODE

//     begin
//         prompt user for input on location / get location/date data from another part of app
//             with that information...
//                 store the date data in a variable called date(s)_of_visit
//                 make a call to the location API to return the citycode of the city that the event is in
//             using that citycode...
//                 make a call to the hotel API to return a list of hotels in the area
//         display the hotel information in the appropriate div

// HOTEL_APP.JS VARIABLE PROTOTYPES

//     location (string) - A variable holding either the name of the airport in the destination city, or the airport code of the                         destination city 

//     dates_of_visit (array of strings) - an array which will hold the date of arrival in the first position, and the date of                                           departure in the second position. The date of departure is optional, and will be set to                                       null if the user does not input one


// */

// var location;
// var dates_of_visit=[];

// $("#submit_btn").on("click",function(){
//     alert("clicked");
//     location = $("#city_entry").val();
//     console.log(locaiton);

// })
var dates_of_visit = [];

$(document).ready(() => {
    $("#submit_btn").on("click", () => {
        var location = $("#city_entry").val().trim();
        var dates_of_visit = [];
        dates_of_visit.push($("#arrival_date_entry").val().trim());
        dates_of_visit.push($("#departure_date_entry").val().trim());
        if (dates_of_visit[1] == null) {
            dates_of_visit[1] = dates_of_visit[0];
        }

        // console.log(location);
        // console.log(dates_of_visit);

        // Nested API calls which allow the user to see hotels in the destination city
        $.ajax({
            beforeSend: function (request) {
                request.setRequestHeader("X-RapidAPI-Host", "apidojo-kayak-v1.p.rapidapi.com");
                request.setRequestHeader("X-RapidAPI-Key", "da97cf968cmsha16cf672fa90a65p1735a7jsnc510610589d5");
            },
            url: "https://apidojo-kayak-v1.p.rapidapi.com/locations/search?where=" + location,
            method: "GET"
        }).then(function (response) {
            // console.log(response);
            // retrieve city code 
            var city_code = response[1].ctid;
            // console.log(city_code);
            $.ajax({
                beforeSend: function (request) {
                    request.setRequestHeader("X-RapidAPI-Host", "apidojo-kayak-v1.p.rapidapi.com");
                    request.setRequestHeader("X-RapidAPI-Key", "da97cf968cmsha16cf672fa90a65p1735a7jsnc510610589d5");
                },
                url: "https://apidojo-kayak-v1.p.rapidapi.com/hotels/create-session?&rooms=1&citycode=" + city_code + "&checkin=" + dates_of_visit[0] + "&checkout=" + dates_of_visit[1] + "&adults=1",
                method: "GET"
            }).then(function (response) {
                // console.log(response);
                console.log(response.hotelset)
                if (response.hotelset.length == 0) {
                    alert("no results found!");
                }
                for (let i = 0; i < response.hotelset.length; i++) {
                    $(".hotel_display").append(
                        "<tr><td>" + (i + 1) + "</td>" + "<td>" + response.hotelset[i].name + "</td>"
                        + "<td>" + response.hotelset[i].price + "</td>" + "<td>" + response.hotelset[i].address
                        + "</td>" + "<td>" + "<a href=" + response.baseUrl + response.hotelset[i].shareURL + " target='blank'>Get a room</a>"
                        + "</td></tr>"
                    );
                }


            })
        })
    })
})