 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: 'AIzaSyDuPi3eUz71Xnw-95EWYUGgJIcrSfsofV8',
    authDomain: "project-1-f9be6.firebaseapp.com",
    databaseURL: "https://project-1-f9be6.firebaseio.com",
    projectId: "project-1-f9be6",
    storageBucket: "project-1-f9be6.appspot.com",
        messagingSenderId: "70800531563",
        appId: '1:70800531563:web:72c9e8de0a1e507a15512e'
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Create a variable to reference the database.
  var database = firebase.database();
//creating empty variables to hold the value........
  var trainName = "";
var destination = "";
var startTime = "";
var frequency = 0;
//using moment() to display to current time in a format and run time every one second...
function currentTime() {
  var current = moment().format('LT');
  $("#currentTime").html(current);
  setTimeout(currentTime, 1000);
};

//
$("#submit").on("click", function(event) {
  event.preventDefault();
//validation if any of the field is emply display the below message........
  if ($("#train-name").val().trim() == "" ||
    $("#destination").val().trim() == "" ||
    $("#first-train").val().trim() == "" ||
    $("#frequency").val().trim() == "") {

    alert("Please fill in all details to add new train");
//else grab the value and push it to the empty variable.... to display on the page.........
  } else {

    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    startTime = $("#first-train").val().trim();
    frequency = $("#frequency").val().trim();

    $(".form-field").val("");

    database.ref().push({
      trainName: trainName,
      destination: destination,
      frequency: frequency,
      startTime: startTime,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
//once its submitted clear the session........
    sessionStorage.clear();
  }

});

database.ref().on("child_added", function(childSnapshot) {
  var startTimeConverted = moment(childSnapshot.val().startTime, "hh:mm").subtract(1, "years");
  var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
  var timeRemain = timeDiff % childSnapshot.val().frequency;
  var minToArrival = childSnapshot.val().frequency - timeRemain;
  var nextTrain = moment().add(minToArrival, "minutes");
  var key = childSnapshot.key;
//creating new row when u Add a new train..........
  var newrow = $("<tr>");
  newrow.append($("<td>" + childSnapshot.val().trainName + "</td>"));
  newrow.append($("<td>" + childSnapshot.val().destination + "</td>"));
  newrow.append($("<td class='text-center'>" + childSnapshot.val().frequency + "</td>"));
  newrow.append($("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>"));
  newrow.append($("<td class='text-center'>" + minToArrival + "</td>"));
  newrow.append($("<td class='text-center'><button class='arrival btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>"));

  if (minToArrival < 6) {
    newrow.addClass("info");
  }

  $("#train-table-rows").append(newrow);

});



$(document).on("click", ".arrival", function() {
  keyref = $(this).attr("data-key");
  database.ref().child(keyref).remove();
  window.location.reload();
});

currentTime();

setInterval(function() {
  window.location.reload();
}, 60000);

