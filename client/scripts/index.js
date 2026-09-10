// view all images section

// get device type
const getDeviceType = () => {
  if (window.matchMedia('(max-width: 767px)').matches) {
    return 'mobile';
  }
  if (window.matchMedia('(max-width: 1023px)').matches) {
    return 'tablet';
  }

  return 'desktop';
};

// Slider state
let sliderImages = [];
let currentSlide = 0;

let touchStartX = 0;
let touchEndX = 0;

// Fetch and Render all images in the modal
const viewAllImages = async () => {
  let allImageCards = '';

  try {
    const response = await fetch('http://localhost:3000/images');
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

    const modal = document.getElementById('photo-modal');
    const desktopImageContainer = document.getElementById(
      'modal-image-container',
    );
    const tabletImageContainer = document.getElementById(
      'modal-slider-container',
    );

    modal.style.display = 'flex';

    if (platform === 'desktop') {
      tabletImageContainer.style.display = 'none';
      desktopImageContainer.style.display = 'grid';

      desktopImageContainer.innerHTML = allImageCards;
    } else {
      desktopImageContainer.style.display = 'none';
      tabletImageContainer.style.display = 'flex';

      currentSlide = 0;
      renderSlider();
    }
  } catch (error) {
    console.log('Error : ', error);
  }
};
function renderSlider() {
  const track = document.getElementById('slider-track');
  const counter = document.getElementById('slider-counter');

  let allImageCards = '';

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
  track.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
  track.style.transform = `translate3d(-${currentSlide * 100}%, 0, 0)`;

  // Update counter
  counter.textContent = `${currentSlide + 1} / ${sliderImages.length}`;

  renderDots();
  addTouchEvents();
}

function nextSlide() {
  console.log('next slide');
  if (currentSlide >= sliderImages.length - 1) {
    return;
  }

  currentSlide++;

  updateSlider();
}

function previousSlide() {
  console.log('previous slide');

  if (currentSlide <= 0) {
    return;
  }

  currentSlide--;
  updateSlider();
}

function updateSlider() {
  const track = document.getElementById('slider-track');
  const counter = document.getElementById('slider-counter');

  track.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  counter.textContent = `${currentSlide + 1} / ${sliderImages.length}`;

  renderDots();
}

function addTouchEvents() {
  console.log('touch event .. ');
  const slider = document.getElementById('mobile-slider');

  if (!slider) return;

  // Prevent adding the same event listeners multiple times
  if (slider.dataset.touchReady === 'true') {
    return;
  }

  slider.dataset.touchReady = 'true';

  slider.addEventListener(
    'touchstart',
    (event) => {
      touchStartX = event.touches[0].clientX;
      touchEndX = touchStartX;
    },
    { passive: true },
  );

  slider.addEventListener(
    'touchmove',
    (event) => {
      touchEndX = event.touches[0].clientX;
    },
    { passive: true },
  );

  slider.addEventListener('touchend', () => {
    const swipeDistance = touchStartX - touchEndX;

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
  const dotsContainer = document.getElementById('slider-dots');

  const totalImages = sliderImages.length;
  const maxDots = 5;

  if (totalImages === 0) {
    dotsContainer.innerHTML = '';
    return;
  }

  const visibleDots = Math.min(totalImages, maxDots);
  let startIndex = 0;

  if (totalImages > maxDots) {
    startIndex = currentSlide - Math.floor(maxDots / 2);

    if (startIndex < 0) {
      startIndex = 0;
    }

    if (startIndex + maxDots > totalImages) {
      startIndex = totalImages - maxDots;
    }
  }

  let dotsHTML = '';
  for (let i = startIndex; i < startIndex + visibleDots; i++) {
    const isActive = i === currentSlide;

    dotsHTML += `
            <button
                type="button"
                onclick="goToSlide(${i})"
                aria-label="Go to image ${i + 1}"
                style="
                    width: ${isActive ? '24px' : '8px'};
                    height: 8px;
                    padding: 0;
                    border: none;
                    border-radius: 20px;
                    background-color: ${isActive ? '#2C5745' : '#d0d0d0'};
                    cursor: pointer;
                    transition: all 0.25s ease;
                "
            ></button>
        `;
  }
  dotsContainer.innerHTML = dotsHTML;
}

function goToSlide(index) {
  if (index < 0 || index >= sliderImages.length) return;

  currentSlide = index;
  updateSlider();
}

// remove modal click handle
const handleModalRemove = () => {
  const modal = document.getElementById('photo-modal');
  modal.style.cssText = `display:none`;
};

// Outside modal click handle
const modal = document.getElementById('photo-modal');
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

/// requirement - 2:

let toggleDescriptionHeight = true;

const heroArticle = document.getElementById('hero-article-id');
const heroArticleBtn = document.getElementById('hero-article-btn-id');

function readMore() {
  heroArticle.style.height = 'auto';
  heroArticleBtn.innerText = 'Collapse';
  toggleDescriptionHeight = false;
}
function readLess() {
  heroArticle.style.height = '30px';
  heroArticleBtn.innerText = 'Read more';
  toggleDescriptionHeight = true;
}

/// requirement - 3:

const dateInput = document.getElementById('hotel-date-picker');
const checkInText = document.getElementById('check-in-p');
const checkOutText = document.getElementById('check-out-p');
const totalPrizeElement = document.getElementById('total-prize-id');
const availabilityMessage = document.getElementById('availability-message-id');

const datepicker = new HotelDatepicker(dateInput, {
  format: 'YYYY-MM-DD',
  minNights: 1,
  onSelectRange: function () {
    const value = dateInput.value;

    const [checkIn, checkOut] = value.split(' - ');
    const totalPrize = 2026 * datepicker.getNights();

    checkInText.innerText = checkIn;
    checkOutText.innerText = checkOut;
    totalPrizeElement.innerText = '$ ' + totalPrize;

    availabilityMessage.style.display = 'flex';
    setTimeout(() => {
      availabilityMessage.style.display = 'none';
    }, 3000);
  },
});

function pickupDates() {
  console.log('picking up dates ');
  datepicker.open();
}

const guestsModal = document.getElementById('checkout-quests-modal');
const questsBtn = document.getElementById('check-out');
const questsSummaryText = document.getElementById('quests-summary-p');
const closeBtn = guestsModal.querySelector('.checkout-quests-modal__close');

questsBtn.addEventListener('click', function () {
  guestsModal.style.display = 'block';
});

closeBtn.addEventListener('click', function () {
  guestsModal.style.display = 'none';
});

document.addEventListener('click', function (event) {
  if (
    guestsModal.style.display === 'block' &&
    !guestsModal.contains(event.target) &&
    event.target !== questsBtn &&
    !questsBtn.contains(event.target)
  ) {
    guestsModal.style.display = 'none';
  }
});

let guests = 1;
let infants = 0;
let pets = 0;

const guestRow = document.querySelector('[data-filter="guests"]');
const infantRow = document.querySelector('[data-filter="infants"]');
const petRow = document.querySelector('[data-filter="pets"]');

// Guest elements
const guestValue = guestRow.querySelector('.checkout-quests-stepper__value');
const guestDecrease = guestRow.querySelector('[data-action="decrement"]');
const guestIncrease = guestRow.querySelector('[data-action="increment"]');

// Infant elements
const infantValue = infantRow.querySelector('.checkout-quests-stepper__value');
const infantDecrease = infantRow.querySelector('[data-action="decrement"]');
const infantIncrease = infantRow.querySelector('[data-action="increment"]');

// Pet elements
const petValue = petRow.querySelector('.checkout-quests-stepper__value');
const petDecrease = petRow.querySelector('[data-action="decrement"]');
const petIncrease = petRow.querySelector('[data-action="increment"]');

guestIncrease.addEventListener('click', function () {
  guests = guests + 1;

  guestValue.textContent = guests;

  updateSummary();
});

guestDecrease.addEventListener('click', function () {
  if (guests > 1) {
    guests = guests - 1;
  }

  guestValue.textContent = guests;

  updateSummary();
});

infantIncrease.addEventListener('click', function () {
  infants = infants + 1;

  infantValue.textContent = infants;

  updateSummary();
});

infantDecrease.addEventListener('click', function () {
  if (infants > 0) {
    infants = infants - 1;
  }

  infantValue.textContent = infants;

  updateSummary();
});

petIncrease.addEventListener('click', function () {
  pets = pets + 1;

  petValue.textContent = pets;

  updateSummary();
});

petDecrease.addEventListener('click', function () {
  if (pets > 0) {
    pets = pets - 1;
  }

  petValue.textContent = pets;

  updateSummary();
});

function updateSummary() {
  let summary = '';

  if (guests > 0) {
    if (guests === 1) {
      summary = guests + ' GUEST';
    } else {
      summary = guests + ' GUESTS';
    }
  }

  if (infants > 0) {
    if (summary !== '') {
      summary = summary + ', ';
    }

    if (infants === 1) {
      summary = summary + infants + ' INFANT';
    } else {
      summary = summary + infants + ' INFANTS';
    }
  }

  if (pets > 0) {
    if (summary !== '') {
      summary = summary + ', ';
    }

    if (pets === 1) {
      summary = summary + pets + ' PET';
    } else {
      summary = summary + pets + ' PETS';
    }
  }

  if (summary === '') {
    summary = 'ADD GUESTS';
  }

  questsSummaryText.textContent = summary;
}

guestValue.textContent = guests;
infantValue.textContent = infants;
petValue.textContent = pets;

updateSummary();



// requirement : 4 (nearby properties)

let PROPERTIES = [];
let FVOURITES = JSON.parse(localStorage.getItem("favourite-properties")) || [];

async function getProperty (filter = "most-popular") {
   const platform = getDeviceType();
   let limit = 6 ;  //default for desktop 
   if(platform!=='desktop'){
    limit = 4;
   }

   const response = await fetch(`http://localhost:3000/get-property?${filter}=true&limit=${limit}`)
   const properties = await response.json();
   PROPERTIES = properties.data;

   renderPropertyCards(PROPERTIES);
  //  console.log("properties : ", properties?.data);
}

getProperty();


function renderPropertyCards(properties) {
  let allPropertyCards = "";
  const propertyCardContainer = document.getElementById("recommendation-cards-container-id");
  properties.forEach((property)=>{
    allPropertyCards+=createRecommendationCard(property);
  })
  propertyCardContainer.innerHTML=allPropertyCards;

  currentMobileCard = 0;
  propertyCardContainer.scrollLeft = 0;
}

function isFavourite(id) {
  const isfav = FVOURITES?.find((item)=>item===id);
  if(isfav) return true;
  return false;
}

function createRecommendationCard(property) {
    return `<section class="recommendation-single-card-container">
        <section class="recommendation-single-card-image-section">
            <img class="recommendation-single-card-image" src="${"https://beta.imgservice.rentbyowner.com/640x300/"}${property?.Property?.FeatureImage || ""}" alt="${property?.Property?.PropertyName || "No name"}">
            <div class="recommendation-single-card-image-overlay">
                <div class="recommendation-single-card-overlay-content-box">
                    <div class="recommendation-single-card-overlay-left-content">
                        <p class="recommendation-single-card-overlay-left-content-text">${property?.Property?.TopAmenities?.[0]?.Name || "No amenity"}</p>
                    </div>
                    <div class="recommendation-single-card-overlay-right-content">
                        <div class="recommendation-single-card-overlay-right-content-icon-box">
                            <svg class="recommendation-single-card-overlay-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M471.3 6.7C477.7 .6 487-1.6 495.6 1.2 505.4 4.5 512 13.7 512 24l0 186.9c0 131.2-108.1 237.1-238.8 237.1-77 0-143.4-49.5-167.5-118.7-35.4 30.8-57.7 76.1-57.7 126.7 0 13.3-10.7 24-24 24S0 469.3 0 456C0 381.1 38.2 315.1 96.1 276.3 131.4 252.7 173.5 240 216 240l80 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-80 0c-39.7 0-77.3 8.8-111 24.5 23.3-70 89.2-120.5 167-120.5 66.4 0 115.8-22.1 148.7-44 19.2-12.8 35.5-28.1 50.7-45.3z"/></svg>
                        </div>
                    </div>
                    <div class="recommendation-single-card-overlay-right-content">
                        <div class="recommendation-single-card-overlay-right-content-icon-box">
                            <svg class="recommendation-single-card-overlay-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 188.6C0 84.4 86 0 192 0S384 84.4 384 188.6c0 119.3-120.2 262.3-170.4 316.8-11.8 12.8-31.5 12.8-43.3 0C120.2 450.9 0 307.9 0 188.6zM192 256a64 64 0 1 0 0-128 64 64 0 0 0 0 128z"/></svg>
                        </div>
                    </div>
                    <button style="background-color:transparent; border: none;" onclick="toggleFavouriteProperty('${property?.ID || ""}')" class="recommendation-single-card-overlay-right-content">
                        <div class="recommendation-single-card-overlay-right-content-icon-box">
                            <svg class="recommendation-single-card-overlay-icon ${isFavourite(`${property?.ID || ""}`) ? "reccommendation-favourites-special-class-on" : ""}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M241 87.1l15 20.7 15-20.7C296 52.5 336.2 32 378.9 32 452.4 32 512 91.6 512 165.1l0 2.6c0 112.2-139.9 242.5-212.9 298.2-12.4 9.4-27.6 14.1-43.1 14.1s-30.8-4.6-43.1-14.1C139.9 410.2 0 279.9 0 167.7l0-2.6C0 91.6 59.6 32 133.1 32 175.8 32 216 52.5 241 87.1z"/></svg>
                        </div>
                    </button>
                </div>
            </div>
        </section>
        <section class="recommendation-single-card-details-section">
            <div style="gap: 4px; font-weight: 700;" class="items-start recommendation-single-card-details-section-first">
                <div class="recommendation-single-card-rating-icon-box">
                    <svg class="recommendation-single-card-rating-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2-9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"/></svg>
                </div>
                <p class="recommendation-single-card-rating-text">${property?.Property?.ReviewScore || 0} Exceptional</p>
                <span class="recommendation-single-card-rating-separator">|</span>
                <p class="recommendation-single-card-review-text">${property?.Property?.Counts?.Reviews || 0} Reviews</p>
            </div>
            <h5 class="recommendation-single-card-title">${property?.Property?.PropertyName || "No name"}</h5>
            <p class="recommendation-single-card-booking-source">Booking.com</p>
            <h5 class="recommendation-single-card-price">From $${property?.Property?.Price || 0}<span><svg class="recommendation-single-card-info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512a256 256 0 1 0 0-512 256 256 0 0 0 0 512zM224 160a32 32 0 1 1 64 0 32 32 0 0 1-64 0zm-8 64l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/></svg></span></h5>
            <p class="recommendation-single-card-description">${property?.Property?.PropertyAttribute || "No property type"} . ${property?.Property?.Counts?.Bedroom || 0} Bedrooms . ${property?.Property?.Counts?.Bathroom || 0} Bathrooms . Sleeps ${property?.Property?.Counts?.Occupancy || 0}</p>
            <p class="recommendation-single-card-location">${property?.GeoInfo?.City || "Unknown city"}, ${property?.GeoInfo?.Country || "Unknown country"}</p>
            <div class="recommendation-single-card-action-container">
                <button class="recommendation-single-card-action-button recommendation-single-card-action-button-primary">LEARN MORE</button>
                <button class="recommendation-single-card-action-button recommendation-single-card-action-button-secondary">BOOK NOW</button>
            </div>
        </section>
    </section>`;
}


function toggleFavouriteProperty(id) {
    const key = "favourite-properties";

    let favourites = JSON.parse(localStorage.getItem(key)) || [];

    const isPresent = favourites.find((item) => item === id);

    if (!isPresent) {
        favourites = [...favourites, id];
    } else {
        favourites = favourites.filter((item) => item !== id);
    }

    localStorage.setItem(key, JSON.stringify(favourites));

    FVOURITES = favourites;

    renderPropertyCards(PROPERTIES);
}


// favourites section for mobile view port 

let currentMobileCard = 0;

function showMobileCard(index) {
    const container = document.getElementById(
        "recommendation-cards-container-id"
    );

    const cards = container.querySelectorAll(
        ".recommendation-single-card-container"
    );

    if (!cards.length) {
        return;
    }

    if (index < 0) {
        index = 0;
    }

    if (index >= cards.length) {
        index = cards.length - 1;
    }

    currentMobileCard = index;

    container.scrollTo({
        left: currentMobileCard * container.clientWidth,
        behavior: "smooth"
    });
}

let mobileTouchStartX = 0;
let mobileTouchEndX = 0;

const recommendationContainer = document.getElementById(
    "recommendation-cards-container-id"
);

recommendationContainer.addEventListener("touchstart", function(event) {
    mobileTouchStartX = event.touches[0].clientX;
});

recommendationContainer.addEventListener("touchend", function(event) {
    mobileTouchEndX = event.changedTouches[0].clientX;

    const difference = mobileTouchStartX - mobileTouchEndX;

    if (Math.abs(difference) < 50) {
        return;
    }

    if (difference > 0) {
        // swipe left
        showMobileCard(currentMobileCard + 1);
    } else {
        // swipe right
        showMobileCard(currentMobileCard - 1);
    }
});