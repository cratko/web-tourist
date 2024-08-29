function getLocationFromUser (){
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          resolve(position.coords);
        }, reject);
      } else {
        reject('Geolocation not supported');
      }
    });
  }

export default getLocationFromUser;