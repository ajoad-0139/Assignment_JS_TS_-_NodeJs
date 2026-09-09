// view all images section


// get device type
const  getDeviceType=()=> {
    if (window.matchMedia("(max-width: 767px)").matches) {
        return "mobile";
    }
    if (window.matchMedia("(max-width: 1023px)").matches) {
        return "tablet";
    }

    return "desktop";
}

// Slider state
let sliderImages = [];
let currentSlide = 0;

let touchStartX = 0;
let touchEndX = 0;

// Fetch and Render all images in the modal 
const viewAllImages = async () => {

    let allImageCards = "";

    try {

        const response = await fetch("http://localhost:3000/images");
        const images = await response.json();

        sliderImages = images.data;

        images.data.forEach((item) => {

            allImageCards += `
                <div style="
                    width: 100%;
                    height: 240px;
                    overflow: hidden;
                    border-radius: 12px;
                    background-color: #eeeeee;
                ">
                    <img
                        src="${item}"
                        alt="Campus photo"
                        style="
                            display: block;
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        "
                    >
                </div>
            `;

        });

        const platform = getDeviceType();

        const modal = document.getElementById("photo-modal");
        const desktopImageContainer = document.getElementById("modal-image-container");
        const tabletImageContainer = document.getElementById("modal-slider-container");

        modal.style.display = "flex";

        if (platform === "desktop") {
            
            tabletImageContainer.style.display = "none";
            desktopImageContainer.style.display = "grid";

            desktopImageContainer.innerHTML = allImageCards;
        }

        else {
            desktopImageContainer.style.display = "none";
            tabletImageContainer.style.display = "flex";

            currentSlide = 0;
            renderSlider();
        }
    }

    catch (error) {
        console.log("Error : ", error);
    }

};
function renderSlider() {

    const track = document.getElementById("slider-track");
    const counter = document.getElementById("slider-counter");

    let allImageCards = "";

    sliderImages.forEach((image) => {

        allImageCards += `
            <div style="
                min-width: 100%;
                width: 100%;
                height: min(65vh, 520px);
                background-color: #eeeeee;
                flex-shrink: 0;
            ">
                <img
                    src="${image}"
                    alt="Campus photo"
                    draggable="false"
                    style="
                        display: block;
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        user-select: none;
                        -webkit-user-drag: none;
                    "
                >
            </div>
        `;

    });

    // Put images inside the track
    track.innerHTML = allImageCards;

    // Smooth slider movement
    track.style.transition = "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
    track.style.transform = `translate3d(-${currentSlide * 100}%, 0, 0)`;

    // Update counter
    counter.textContent = `${currentSlide + 1} / ${sliderImages.length}`;

    renderDots();
    addTouchEvents();
}

function nextSlide() {

    console.log("next slide")
    if (currentSlide >= sliderImages.length - 1) {
        return;
    }

    currentSlide++;
    
    updateSlider();

}


function previousSlide() {
    console.log("previous slide")

    if (currentSlide <= 0) {
        return;
    }

    currentSlide--;
    updateSlider();

}


function updateSlider() {

    const track = document.getElementById("slider-track");
    const counter = document.getElementById("slider-counter"); 

    track.style.transition = "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    counter.textContent = `${currentSlide + 1} / ${sliderImages.length}`;

    renderDots();

}

function addTouchEvents() {

    console.log("touch event .. ")
    const slider = document.getElementById("mobile-slider");

    if (!slider) return;

    // Prevent adding the same event listeners multiple times
    if (slider.dataset.touchReady === "true") {
        return;
    }

    slider.dataset.touchReady = "true";

    slider.addEventListener("touchstart", (event) => {

        touchStartX = event.touches[0].clientX;
        touchEndX = touchStartX;

    }, { passive: true });


    slider.addEventListener("touchmove", (event) => {

        touchEndX = event.touches[0].clientX;

    }, { passive: true });


    slider.addEventListener("touchend", () => {

        const swipeDistance =
            touchStartX - touchEndX;

        const minimumSwipeDistance = 50;

        // Swipe left → next image
        if (swipeDistance > minimumSwipeDistance) {

            nextSlide();

        }

        // Swipe right → previous image
        else if (swipeDistance < -minimumSwipeDistance) {

            previousSlide();

        }

        // Reset
        touchStartX = 0;
        touchEndX = 0;

    });

}

function renderDots() {

    const dotsContainer = document.getElementById("slider-dots");

    const totalImages = sliderImages.length;
    const maxDots = 5;


    if (totalImages === 0) {
        dotsContainer.innerHTML = "";
        return;
    }

    const visibleDots = Math.min(totalImages, maxDots);
    let startIndex = 0;

    if (totalImages > maxDots) {

        startIndex =  currentSlide - Math.floor(maxDots / 2);

        if (startIndex < 0) {
            startIndex = 0;
        }

        if (startIndex + maxDots > totalImages) {
            startIndex = totalImages - maxDots;
        }

    }

    let dotsHTML = "";
    for (let i = startIndex; i < startIndex + visibleDots; i++) {

        const isActive = i === currentSlide;

        dotsHTML += `
            <button
                type="button"
                onclick="goToSlide(${i})"
                aria-label="Go to image ${i + 1}"
                style="
                    width: ${isActive ? "24px" : "8px"};
                    height: 8px;
                    padding: 0;
                    border: none;
                    border-radius: 20px;
                    background-color: ${isActive ? "#2C5745" : "#d0d0d0"};
                    cursor: pointer;
                    transition: all 0.25s ease;
                "
            ></button>
        `;

    }
    dotsContainer.innerHTML = dotsHTML;
}

function goToSlide(index) {

    if (index < 0 || index >= sliderImages.length ) return;

    currentSlide = index;
    updateSlider();
}

// remove modal click handle
const handleModalRemove = ()=>{
    const modal = document.getElementById("photo-modal");
    modal.style.cssText=`display:none`;
}


// Outside modal click handle
const modal = document.getElementById("photo-modal");
modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }

});


/// requirement - 2:

let toggleDescriptionHeight = true;

const heroArticle = document.getElementById("hero-article-id");
const heroArticleBtn = document.getElementById("hero-article-btn-id");

function readMore(){
    heroArticle.style.height="auto";
    heroArticleBtn.innerText="Collapse";
    toggleDescriptionHeight=false;
}
function readLess(){
    heroArticle.style.height="30px";
    heroArticleBtn.innerText="Read more"
    toggleDescriptionHeight=true;
}



/// requirement - 3:



const dateInput = document.getElementById("hotel-date-picker");
const checkInText= document.getElementById("check-in-p");
const checkOutText= document.getElementById("check-out-p");
const totalPrizeElement =document.getElementById("total-prize-id");
const availabilityMessage = document.getElementById("availability-message-id");

const datepicker = new HotelDatepicker(dateInput, {
    format: "YYYY-MM-DD",
    minNights: 1,
      onSelectRange: function () {
        const value = dateInput.value;

        const [checkIn, checkOut] = value.split(" - ");
        const totalPrize = 2026*datepicker.getNights();

        checkInText.innerText=checkIn;
        checkOutText.innerText=checkOut;
        totalPrizeElement.innerText='$ '+totalPrize;

        availabilityMessage.style.display="flex";
        setTimeout(()=>{
            availabilityMessage.style.display="none";
        },3000)

      }
}); 

function pickupDates (){
    console.log("picking up dates ")
    datepicker.open();
    
}


const guestsModal = document.getElementById("checkout-quests-modal");
const questsBtn = document.getElementById("check-out");
const questsSummaryText = document.getElementById("quests-summary-p");
const closeBtn = guestsModal.querySelector(".checkout-quests-modal__close");


questsBtn.addEventListener("click", function () {
    guestsModal.style.display = "block";
});

closeBtn.addEventListener("click", function () {
    guestsModal.style.display = "none";
});

document.addEventListener("click", function (event) {

    if (
        guestsModal.style.display === "block" &&
        !guestsModal.contains(event.target) &&
        event.target !== questsBtn &&
        !questsBtn.contains(event.target)
    ) {
        guestsModal.style.display = "none";
    }

});


let guests = 1;
let infants = 0;
let pets = 0;


const guestRow = document.querySelector('[data-filter="guests"]');
const infantRow = document.querySelector('[data-filter="infants"]');
const petRow = document.querySelector('[data-filter="pets"]');


// Guest elements
const guestValue = guestRow.querySelector(".checkout-quests-stepper__value");
const guestDecrease = guestRow.querySelector('[data-action="decrement"]');
const guestIncrease = guestRow.querySelecSUNtor('[data-action="increment"]');


// Infant elements
const infantValue = infantRow.querySelector(".checkout-quests-stepper__value");
const infantDecrease = infantRow.querySelector('[data-action="decrement"]');
const infantIncrease = infantRow.querySelector('[data-action="increment"]');


// Pet elements
const petValue = petRow.querySelector(".checkout-quests-stepper__value");
const petDecrease = petRow.querySelector('[data-action="decrement"]');
const petIncrease = petRow.querySelector('[data-action="increment"]');

guestIncrease.addEventListener("click", function () {

    guests = guests + 1;

    guestValue.textContent = guests;

    updateSummary();

});


guestDecrease.addEventListener("click", function () {

    if (guests > 2) {
        guests = guests - 1;
    }

    guestValue.textContent = guests;

    updateSummary();

});



infantIncrease.addEventListener("click", function () {

    infants = infants + 1;

    infantValue.textContent = infants;

    updateSummary();

});


infantDecrease.addEventListener("click", function () {

    if (infants > 0) {
        infants = infants - 1;
    }

    infantValue.textContent = infants;

    updateSummary();

});

petIncrease.addEventListener("click", function () {

    pets = pets + 1;

    petValue.textContent = pets;

    updateSummary();

});


petDecrease.addEventListener("click", function () {

    if (pets > 0) {
        pets = pets - 1;
    }

    petValue.textContent = pets;

    updateSummary();

});


function updateSummary() {

    let summary = "";

    if (guests > 0) {

        if (guests === 1) {
            summary = guests + " GUEST";
        } else {
            summary = guests + " GUESTS";
        }

    }


    if (infants > 0) {

        if (summary !== "") {
            summary = summary + ", ";
        }

        if (infants === 1) {
            summary = summary + infants + " INFANT";
        } else {
            summary = summary + infants + " INFANTS";
        }

    }


    if (pets > 0) {

        if (summary !== "") {
            summary = summary + ", ";
        }

        if (pets === 1) {
            summary = summary + pets + " PET";
        } else {
            summary = summary + pets + " PETS";
        }

    }


    if (summary === "") {
        summary = "ADD GUESTS";
    }


    questsSummaryText.textContent = summary;
}


guestValue.textContent = guests;
infantValue.textContent = infants;
petValue.textContent = pets;

updateSummary();