import 'whatwg-fetch';

export default {
  getGeolocation(cb) {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        
        fetch('/room', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(location)
        })
        cb(location)
      })

    } else {
      return null
    }
  }
}
