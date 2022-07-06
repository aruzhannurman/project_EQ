import React, { useState } from "react";
import { useGeolocated } from "react-geolocated";
import data from "./data.json";

const Demo = () => {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

    const [closestLocation, setClosestLocation] = useState({});

    
    function distance(lat1, lon1, lat2, lon2) {
      let radlat1 = Math.PI * lat1/180
      let radlat2 = Math.PI * lat2/180
      let theta = lon1-lon2
      let radtheta = Math.PI * theta/180
      let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
          dist = 1;
      }
      dist = Math.acos(dist)
      dist = dist * 180/Math.PI
      dist = dist * 60 * 1.1515
      dist = dist * 1.609344 
      return dist
    }

    const closestMetro = () => {
      const dataWithDistance = data.map(item => {
        return {
          ...item,
          distanceFromHere: distance(coords.latitude, coords.longitude, item.lat, item.lng)
        }
      });

      setClosestLocation(
        dataWithDistance.sort((a, b) => a.distanceFromHere - b.distanceFromHere)[0]
      )
    }


  return !isGeolocationAvailable ? (
    <div>Your browser does not support Geolocation</div>
  ) : !isGeolocationEnabled ? (
    <div>Geolocation is not enabled</div>
  ) : coords ? (
    <>
      <table>
        <tbody>
          <tr>
            <td>latitude</td>
            <td>{coords.latitude}</td>
          </tr>
          <tr>
            <td>longitude</td>
            <td>{coords.longitude}</td>
          </tr>
        </tbody>
      </table>

      <div>
        {data.map((item)=>(
          <div>{item.name}  :{distance(coords.latitude, coords.longitude, item.lat, item.lng)} </div>
        ))}
      </div>

      <div>
      <button onClick={ closestMetro}>Get closest location</button>
      {closestLocation && (<div>{closestLocation.name}</div>)}
      </div>
      
    </>
  ) : (
    <div>Getting the location data </div>
  );
};

export default Demo;