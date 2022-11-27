import '../style.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import moment from 'moment';



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

async function getAllUsers(activ) {
  return fetch('http://localhost:5195/api/House/GetAll', {
    method: "GET"
  })
    .then(response => response.json())
    .then(data => {
      data.forEach(element => {
        console.log(element['status']);
        var boxElem = document.querySelector(".getusers");

        const date = new Date(element['publicationDate']);
        var date1 = moment(date).format('yyy-MM-DD');

        boxElem.innerHTML += `<tr>
                                <td>${element['id']}</td>
                                <td>${element['title']}</td>
                                <td>${element['price']}</td>
                                <td>${date1}</td>
                                <td>${element['geo_Lat']}</td>
                                <td>${element['geo_Lon']}</td>
                                <td>${element['file']}</td>
                                <td><a class="btn btn-add" href="http://localhost:5173/edit.html?id=${element['id']}">Edit</a>
                                <a class="btn btn-delete" onclick="dropUser(${element['id']})" id="removeUser">Delete</a></td>
                                
                              </tr>`;
      });
    })

    .catch(error => console.log(error));
}

document.getElementById('statistika').onclick = function () {
  return fetch('https://localhost:7265/api/Houses/Stats', {
    method: "GET"
  }).then(response => response.json())
    .then(data => {
      console.log(data);
      data.forEach(element => {
        var boxDat = document.getElementById('stats');

        boxDat += `<tr>
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

