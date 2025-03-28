// Countdown timer
// set Date
var firstCountDownDate = new Date("March 21, 2025 18:00:00").getTime();
var secondCountDownDate = new Date("March 23, 2025 12:00:00").getTime();


// Function to calculate days
function getDays(distance) {
    return Math.floor(distance / (1000 * 60 * 60 * 24));
}

// Function to calculate hours
function getHours(distance) {
    return Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
}

// Function to calculate minutes
function getMinutes(distance) {
    return Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
}

// Function to calculate seconds
function getSeconds(distance) {
    return Math.floor((distance % (1000 * 60)) / 1000);
}

// var x = setInterval(function () {
//     var now = new Date().getTime();
//     var distance = countDownDate - now;

//     if (distance >= 0) {
//         document.getElementById("days").innerText = getDays(distance);
//         document.getElementById("hours").innerText = getHours(distance);
//         document.getElementById("minutes").innerText = getMinutes(distance);
//         document.getElementById("seconds").innerText = getSeconds(distance);
//     } else {
//         clearInterval(x);
//         document.getElementById("end-message").innerText = "Start Coding!!!";
//         document.querySelector(".countdown-container").style.display = "none";
//     }
// }, 1000);

function startCountdown(targetDate, endCallback) {
    return setInterval(function () {
        var now = new Date().getTime();
        var distance = targetDate - now;

        if (distance >= 0) {
            document.getElementById("days").innerText = getDays(distance);
            document.getElementById("hours").innerText = getHours(distance);
            document.getElementById("minutes").innerText = getMinutes(distance);
            document.getElementById("seconds").innerText = getSeconds(distance);
        } else {
            clearInterval(x);
            endCallback();
        }
    }, 1000);
}

// Start first countdown
var x = startCountdown(firstCountDownDate, function () {
    // Show second countdown
    document.querySelector(".countdown-container").style.display = "flex"; // in case it's hidden
    document.getElementById("countdown-msg").innerText = "Countdown to Project Submission:";

    // Start second countdown
    x = startCountdown(secondCountDownDate, function () {
        document.querySelector(".countdown-container").style.display = "none";
    });
});