import 'whatwg-fetch';

export default {
  getGeolocation(cb) {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        cb(location)
      })
    } else {
      return null
    }
  }
}


//this page is done
