// Countdown timer
// set Date
var firstCountDownDate = new Date("March 20, 2026 17:00:00").getTime();


var timer;

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


function updateCountdown(distance) {
    document.getElementById("days").innerText = getDays(distance);
    document.getElementById("hours").innerText = getHours(distance);
    document.getElementById("minutes").innerText = getMinutes(distance);
    document.getElementById("seconds").innerText = getSeconds(distance);
}

function startCountdown(targetDate, endCallback) {
    clearInterval(timer);

    var now = new Date().getTime();
    var distance = targetDate - now;
    if (distance < 0) updateCountdown(distance);

    timer = setInterval(function () {
        var now = new Date().getTime();
        var distance = targetDate - now;
        if (distance >= 0) {
            updateCountdown(distance);
        }else {
            clearInterval(timer);
            endCallback();
    }
}, 1000);
}

// Start first countdown
startCountdown(firstCountDownDate, function () {

    document.querySelector(".countdown-container").style.display = "none"; // in case it's hidden
    document.getElementById("countdown-msg").innerText = "Hackathon has started!";
});


