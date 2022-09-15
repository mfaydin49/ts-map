import axios from "axios";

declare var google: any;
type GoogleGeocodingResponse = { results: { geometry: { location: { lat: number; lng: number } } }[]; status: "OK" | "ZERO_RESULTS" };

const form = document.querySelector("form")!;
const addresInput = document.getElementById("address")! as HTMLInputElement;

const API_KEY = process.env.GOOGLEMAP_API_KEY;
const script = document.createElement("script")! as HTMLScriptElement;
script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
document.head.append(script);

const searchAddressHandler = (event: Event) => {
  event.preventDefault();
  const enteredAddress = addresInput.value;

  axios
    .get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${API_KEY}`)
    .then((res) => {
      if (res.data.status !== "OK") {
        throw new Error("Could not fetch location");
      }
      const coordinates = res.data.results[0].geometry.location;
      const map = new google.maps.Map(document.getElementById("map"), {
        center: coordinates,
        zoom: 12,
      });

      new google.maps.Marker({
        position: coordinates,
        map: map,
      });
    })
    .catch((err) => {
      alert(err.message);
      console.log(err);
    });
};

form.addEventListener("submit", searchAddressHandler);
