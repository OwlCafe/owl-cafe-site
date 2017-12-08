var GoogleMapsLoader = require("google-maps");

GoogleMapsLoader.KEY = "AIzaSyBguCT2SHA9nG_1HwjLNVz58Mly36yEv4M";

GoogleMapsLoader.load(function(google) {
    const map = document.querySelector("#map"),
        place = { lat: 45.5975812, lng: 9.8829403 },
        gMap = new google.maps.Map(map, {
            center: place,
            zoom: 17,
            styles: [
                {
                    elementType: "geometry",
                    stylers: [
                        {
                            color: "#ebe3cd"
                        }
                    ]
                },
                {
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            color: "#523735"
                        }
                    ]
                },
                {
                    elementType: "labels.text.stroke",
                    stylers: [
                        {
                            color: "#f5f1e6"
                        }
                    ]
                },
                {
                    featureType: "administrative",
                    elementType: "geometry.stroke",
                    stylers: [
                        {
                            color: "#c9b2a6"
                        }
                    ]
                },
                {
                    featureType: "administrative.land_parcel",
                    elementType: "geometry.stroke",
                    stylers: [
                        {
                            color: "#dcd2be"
                        }
                    ]
                },
                {
                    featureType: "administrative.land_parcel",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            color: "#ae9e90"
                        }
                    ]
                },
                {
                    featureType: "landscape.natural",
                    elementType: "geometry",
                    stylers: [
                        {
                            color: "#dfd2ae"
                        }
                    ]
                },
                {
                    featureType: "poi",
                    elementType: "geometry",
                    stylers: [
                        {
                            color: "#dfd2ae"
                        }
                    ]
                },
                {
                    featureType: "poi",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            color: "#93817c"
                        }
                    ]
                },
                {
                    featureType: "poi.park",
                    elementType: "geometry.fill",
                    stylers: [
                        {
                            color: "#a5b076"
                        }
                    ]
                },
                {
                    featureType: "poi.park",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            color: "#447530"
                        }
                    ]
                },
                {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [
                        {
                            color: "#f5f1e6"
                        }
                    ]
                },
                {
                    featureType: "road.arterial",
                    elementType: "geometry",
                    stylers: [
                        {
                            color: "#fdfcf8"
                        }
                    ]
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry",
                    stylers: [
                        {
                            color: "#f8c967"
                        }
                    ]
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry.stroke",
                    stylers: [
                        {
                            color: "#e9bc62"
                        }
                    ]
                },
                {
                    featureType: "road.highway.controlled_access",
                    elementType: "geometry",
                    stylers: [
                        {
                            color: "#e98d58"
                        }
                    ]
                },
                {
                    featureType: "road.highway.controlled_access",
                    elementType: "geometry.stroke",
                    stylers: [
                        {
                            color: "#db8555"
                        }
                    ]
                },
                {
                    featureType: "road.local",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            color: "#806b63"
                        }
                    ]
                },
                {
                    featureType: "transit.line",
                    elementType: "geometry",
                    stylers: [
                        {
                            color: "#dfd2ae"
                        }
                    ]
                },
                {
                    featureType: "transit.line",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            color: "#8f7d77"
                        }
                    ]
                },
                {
                    featureType: "transit.line",
                    elementType: "labels.text.stroke",
                    stylers: [
                        {
                            color: "#ebe3cd"
                        }
                    ]
                },
                {
                    featureType: "transit.station",
                    elementType: "geometry",
                    stylers: [
                        {
                            color: "#dfd2ae"
                        }
                    ]
                },
                {
                    featureType: "water",
                    elementType: "geometry.fill",
                    stylers: [
                        {
                            color: "#b9d3c2"
                        }
                    ]
                },
                {
                    featureType: "water",
                    elementType: "labels.text.fill",
                    stylers: [
                        {
                            color: "#92998d"
                        }
                    ]
                }
            ]
        }),
        infowindow = new google.maps.InfoWindow({
            content: "Crazy Owl Café"
        }),
        marker = new google.maps.Marker({
            position: place,
            map: gMap,
            title: infowindow.content
        });

    marker.addListener("click", function() {
        infowindow.open(gMap, marker);
    });
});

(() => {
    "use-strict";

    document.addEventListener("DOMContentLoaded", () => {
        const slider = document.querySelector("#slider");

        if (slider) {
            const selected =
                slider.querySelector(".selected") || slider.firstElementChild;
            selected.classList.add("selected");

            window.setInterval(() => {
                const selected = slider.querySelector(".selected");

                selected.classList.remove("selected");
                const next =
                    selected.nextElementSibling ||
                    selected.parentElement.firstElementChild;
                window.setTimeout(() => {
                    next.classList.add("selected");
                }, 950);
            }, 6 * 1000);
        }
    });

    document.addEventListener("DOMContentLoaded", () => {
        const slider = document.querySelector("#rapaci-slider");

        if (slider) {
            const next = slider.querySelector(".next"),
                previous = slider.querySelector(".previous");

            const slides = slider.querySelectorAll(".slide"),
                alignPosition = () => {
                    const visible = Math.floor(
                        100 / parseInt(getComputedStyle(slides[0]).flexBasis)
                    );

                    if (position + visible >= slides.length) {
                        previous.classList.remove("hidden");
                        next.classList.add("hidden");
                    } else if (position <= 0) {
                        next.classList.remove("hidden");
                        previous.classList.add("hidden");
                        position = 0;
                    } else {
                        next.classList.remove("hidden");
                        previous.classList.remove("hidden");
                    }
                },
                moveSlides = () => {
                    alignPosition();

                    slides.forEach(slide => {
                        slide.style.transform = `translateX(-${position *
                            100}%)`;
                    });
                };
            let position = 0;
            alignPosition();

            next.addEventListener("click", () => {
                position += 1;
                moveSlides();
            });

            previous.addEventListener("click", () => {
                position -= 1;
                moveSlides();
            });
        }
    });
})();
