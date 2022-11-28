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
        var boxElem = document.querySelector(".getusers");

        const byteCharacters = atob(element['file']);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const blobb = new Blob([byteArray], {type: "application/json"});
        var url = window.URL.createObjectURL(blobb);

        //date
        const date = new Date(element['publicationDate']);
        var date1 = moment(date).format('yyy-MM-DD');
        //<td><a href="${url}" download="${Math.floor(Math.random() * 1000)}">Скачать</a></td>
        
        boxElem.innerHTML += `<tr>
                                <td>${element['id']}</td>
                                <td>${element['title']}</td>
                                <td>${element['price']}</td>
                                <td>${date1}</td>
                                <td>${element['geo_Lat']}</td>
                                <td>${element['geo_Lon']}</td>
                                <td><a href="${url}" download="${Math.floor(Math.random() * 1000)}">Скачать</a></td>
                                <td><a class="btn btn-add" href="http://localhost:5173/edit.html?id=${element['id']}">Edit</a>
                                <a class="btn btn-delete" onclick="dropUser(${element['id']})" id="removeUser">Delete</a></td>
                                
                              </tr>`;
      });
    })

    .catch(error => console.log(error));
}

document.getElementById('statistika').onclick = function () {
  return fetch('http://localhost:5195/api/House/GetStats', {
    method: "GET"
  }).then(response => response.json())
    .then(data => {
      const countHouses = data['countHouses'];
      const adAgeStats = data['adAgeStats'];
      const minAge = moment(adAgeStats['min']).format('yyy-MM-DD');
      const maxAge = moment(adAgeStats['max']).format('yyy-MM-DD');
      const priceStats = data['priceStats'];
      const numberOfActiveUses = data['numberOfActiveHouses'];
      const numberOfInactiveUses = data['numberOfInactiveHouses'];
      

       // Вывод дополнительной статистики 
       document.getElementById('stats').innerHTML += `<td>${countHouses}</td><td>${priceStats['ave']}</td><td>${priceStats['max']}</td><td>${priceStats['min']}</td><td>${numberOfActiveUses}</td><td>${numberOfInactiveUses}</td><td>${minAge}</td><td>${maxAge}</td>`;
        
       // Вывод статистики возраста
       //document.getElementById('stats').innerHTML += `<td>${adAgeStats['min']}</td><td>${adAgeStats['max']}</td><td>${adAgeStats['ave']}</td>`;

      
    })
};