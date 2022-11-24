import '../style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';


getAllUsers(true);

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

async function getAllUsers(activ){
  return fetch('https://localhost:7265/api/Houses', { 
    method: "GET"
  })
  .then(response => response.json())
  .then(data => {
    data.forEach(element => {    
      var boxElem = document.querySelector(".getusers");
      var bType;
      switch(element['Building_Type']){
        case 0:
          bType = `Other`;
          break;
        case 1:
          bType = `Panel`;
          break;
        case 2:
          bType = `Monolithic`;
          break;
        case 3:
          bType = `Brick`;
          break;
        case 4:
          bType = `Blocky`;
          break;
        case 5:
          bType = `Wooden`;
          break;
      }
      var objType;
      switch(element['Object_Type']){
        default:
          objType = `Secondary Housing`;
          break;
        case 2:
          objType = `Primary Housing`;
          break;
      }
      var romm = element['Rooms'];
      if (romm === -1){
        romm = `Studio Apartment`;
      }
      boxElem.innerHTML += `<tr>
                              <td>${element['Price']}</td>
                              <td>${element['PublicationDate']}</td>
                              <td>${element['Geo_Lat']}</td>
                              <td>${element['Geo_Lon']}</td>
                              <td>${element['Region']}</td>
                              <td>${bType}</td>
                              <td>${element['FloorNum']}</td>
                              <td>${element['TotalFloor']}</td>
                              <td>${romm}</td>
                              <td>${element['Area']}m<sup>2</sup></td>
                              <td>${objType}</td>
                              <td>${element['Id']}</td>
                              <td>${element['Photopath']}</td>
                              <td><a class="btn btn-add" href="http://localhost:5173/edit.html?id=${element['Id']}">Edit</a>
                              <a class="btn btn-delete" onclick="dropUser(${element['Id']})" id="removeUser">Delete</a></td>
                              
                            </tr>`;
      
    });
  })
  
  .catch(error => console.log(error));
}







document.getElementById('statistika').onclick = function (){
  return fetch('https://localhost:7265/api/Houses/Stats',{
    method: "GET"
  }).then(response => response.json())
  .then(data =>{
    console.log(data);
      data.forEach(element => {    
        var boxDat = document.getElementById('stats');

        boxDat +=`<tr>
                    <td>${element['allEntries']}</td>
                    <td>${element['avgPrice']}</td>
                    <td>${element['topPrice']}</td>
                    <td>${element['lowPrice']}</td>
                    <td>${element['uniqueRegions']}</td>
                    <td>${element['earliestFrame']}</td>
                  </tr>`;
      });
    })
};

