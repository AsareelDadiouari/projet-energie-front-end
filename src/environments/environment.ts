// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const openChargeMaptoken = '72341d83-3f03-42ab-b3f3-6b0a46f17f05'

export const environment = {
  production: false,
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
    token: "5b3ce3597851110001cf6248689d473c044c43afb6cec015efc2fcc1"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
