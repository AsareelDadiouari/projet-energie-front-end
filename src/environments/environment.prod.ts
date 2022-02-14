const openChargeMaptoken = '72341d83-3f03-42ab-b3f3-6b0a46f17f05';
const openMapServiceToken = "5b3ce3597851110001cf6248689d473c044c43afb6cec015efc2fcc1";

export const environment = {
  production: true,
  mapbox: {
    accessToken: 'pk.eyJ1IjoiYmxpbmcxNzc3Nzc3Nzc3NzciLCJhIjoiY2t5bG5saXFlMmQ2NzJ1cXA3azdsMHFnNiJ9.Sfhu_LnR_vx9HPVJVHodbQ'
  },
  openChargeMap: {
    token: openChargeMaptoken,
    apiKey: 'https://api.openchargemap.io/v3/poi/?key=' + openChargeMaptoken + "&output=json&=&verbose=true",
  },
  server: {
    url: 'http://localhost:3000'
  },
  openMapService: {
    token: openMapServiceToken,
    apikeyGeoCode: 'https://api.openrouteservice.org/geocode/search?api_key=' + openMapServiceToken + "&size=1",
    apikeyDirections: 'https://api.openrouteservice.org/v2/directions/driving-car?api_key=' + openMapServiceToken,
    apikeyMatrix: 'https://api.openrouteservice.org/v2/matrix/driving-car'
  }
};
