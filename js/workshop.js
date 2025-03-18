document.addEventListener("DOMContentLoaded", function () {
    // Get all cards
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
        // Find the image and background elements within the current card
        const cardImage = card.querySelector(".card-img");
        const cardBg = card.querySelector(".card-bg");

        // Ensure the image is loaded before extracting the color
        cardImage.onload = function () {
            const colorThief = new ColorThief();
            const dominantColor = colorThief.getColor(cardImage);
            const rgbColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
            cardBg.style.backgroundColor = rgbColor;
        };

        // If the image is already cached, trigger the onload event manually
        if (cardImage.complete) {
            cardImage.onload();
        }
    });
});



document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("popup-modal");
    const closeModalBtn = document.querySelector(".close-modal");
    const slidesButton = document.getElementById("slides-button");
    const linkedinButton = document.getElementById("linkedin-button");
    const instagramButton = document.getElementById("instagram-button");

    // Open modal when "Click for More" is clicked
    document.querySelectorAll(".button").forEach((button) => {
        button.addEventListener("click", function () {
            modal.style.display = "flex"; // Show modal

            // Get workshop details from the card
            const card = button.closest(".card");
            const slidesLink = card.getAttribute("data-slides");
            const linkedinLink = card.getAttribute("data-linkedin");
            const instagramLink = card.getAttribute("data-instagram");

            // Set up buttons
            slidesButton.onclick = () => {
                window.open(slidesLink, "_blank"); // Open slides in new tab
            };

            linkedinButton.onclick = () => {
                window.open(linkedinLink, "_blank"); // Open LinkedIn post in new tab
            };

            instagramButton.onclick = () => {
                window.open(instagramLink, "_blank"); // Open Instagram post in new tab
            };
        });
    });

    // Close modal when "X" is clicked
    closeModalBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Close modal when clicking outside the modal
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

