/* 
Оживите форму:
 - после заполнения формы и нажатия на кнопку "Добавить", балун с формой должен быть закрыт, а на карту добавлен плейсмарк по тем координатам, по которым был открыт балун;
 - отзывы поблизости группируются в одну метку. У сгруппированных меток выводится их количество;
 - при масштабировании карты, происходит группировка меток;
 - после нажатия на плейсмарк, должа открываться форма для составления нового отзыва об этих кординатах;
 - на форме должны присутствовать все ранее оставленные для этих кординат отзывы;
 - при перезагрузке страницы, все отзывы и плейсмарки должны быть восстановлены (в базовом варианте для этого можно использовать localStorage, но вы можете создать свой сервер на node.js);
  - при нажатии на сгруппированный объект открывается карусель отзывов. При нажатии на адрес в карусели откроется окно с отзывами по данному адресу.
*/

function mapInit() {
  ymaps.ready(() => {
    //     create map
    let myMap = new ymaps.Map("map", {
      center: [55.751574, 37.573856],
      zoom: 13,
      controls: ["zoomControl"],
      behaviors: ["drag"],
    });

    //      create localStorage
    let placemarksData;
    let storage = localStorage;
    if (!storage.placemarks) {
      placemarksData = [];
    } else {
      placemarksData = JSON.parse(storage.placemarks);
    }

    function createPlaceMark(coords, reviews = "") {
      let placemark = new ymaps.Placemark(coords, {
        balloonContent:
          reviews +
          "<h2>Отзыв</h2>" +
          "<form id='form2'>" +
          "<p><input type='text' id='input__name2' placeholder='Укажите ваше имя' name='name'></p>" +
          "<input type='text' id='input__place2' placeholder='Укажите место' name='place'>" +
          "<p><textarea id='input__review2' placeholder ='Оставьте отзыв' name='review'></textarea></p> " +
          "<p><button type='button' id='btn2'>Добавить</button></p> " +
          "</form>",
      });

      placemark.events.add("balloonopen", (e) => {
        const form = document.getElementById("form2");
        const btn = document.getElementById("btn2");
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          saveToStorage(placemarksData, form, coords);

          placemark.balloon.close();
        });
      });

      myMap.geoObjects.add(placemark);
      return placemark;
    }
    function showPlaceMarks(data) {
      let geoObjects = [];
      for (let i = 0; i < data.length; i++) {
        geoObjects[i] = createPlaceMark(data[i].coords, data[i].reviews);
      }
    }
    function showBalloon(coords, reviews = "") {
      return myMap.balloon.open(coords, {
        contentBody:
          reviews +
          "<h2>Отзыв</h2>" +
          "<form id='form'>" +
          "<p><input type='text' id='input__name' placeholder='Укажите ваше имя' name='name'></p>" +
          "<input type='text' id='input__place' placeholder = 'Укажите место' name='place'>" +
          "<p><textarea id='input__review' placeholder ='Оставьте отзыв' name='review'></textarea></p> " +
          "<p><button type='button' id='btn'>Добавить</button></p> " +
          "</form>",
      });
    }
    function saveToStorage(data, form, coords) {
      data.push({
        //добавляем метку в localStorage
        id: data.length,
        name: form.elements.name.value,
        place: form.elements.place.value,
        reviews: [form.elements.review.value],
        coords: coords,
      });

      storage.placemarks = JSON.stringify(data);
    }

    showPlaceMarks(placemarksData);

    //open balloon on Click

    myMap.events.add("click", (e) => {
      if (!myMap.balloon.isOpen()) {
        let coords = e.get("coords");
        showBalloon(coords).then(() => {
          const form = document.getElementById("form");
          const btn = document.getElementById("btn");
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            createPlaceMark(coords);
            saveToStorage(placemarksData, form, coords);

            myMap.balloon.close();
          });
        });
      } else {
        myMap.balloon.close();
      }
    });
  });
}

export { mapInit };

// function mapInit() {
//   ymaps.ready(() => {
//     //      create localStorage
//     let placemarksData;
//     let storage = localStorage;
//     if (!storage.placemarks) {
//       placemarksData = [];
//     } else {
//       placemarksData = JSON.parse(storage.placemarks);
//     }

//     //     create map
//     let myMap = new ymaps.Map("map", {
//       center: [51.51, -0.12],
//       zoom: 14,
//       controls: ["zoomControl"],
//       behaviors: ["drag"],
//     });

//     //      create placeMarks from localStorage data
//     const getPlacemarks = function (arrayOfPlacemarks) {
//       let geoObjects = [];
//       for (let i = 0; i < arrayOfPlacemarks.length; i++) {
//         geoObjects[i] = createPlacemark(
//           arrayOfPlacemarks[i].coords,
//           arrayOfPlacemarks[i].reviews
//         );
//       }
//       return geoObjects;
//     };

//     //      show placeMarks on the map
//     function showPlacemarks(placemarksObj) {
//       let myClusterer = new ymaps.Clusterer({
//         clusterDisableClickZoom: false,
//       });
//       myClusterer.add(placemarksObj);
//       myMap.geoObjects.add(myClusterer);
//     }

//     //      create placeMark
//     function createPlacemark(coords, reviews = "нет отзывов") {
//       let allReviews = "";
//       if (Array.isArray(reviews)) {
//         for (const review of reviews) {
//           allReviews += `<p>${review}</p>`;
//         }
//       }
//       let placemark = new ymaps.Placemark(coords, {
//         // balloonContent:
//         //   allReviews +
//         //   "<h2>Отзыв</h2>" +
//         //   "<form id='form2'>" +
//         //   "<p><input type='text' id='input__name2' placeholder='Укажите ваше имя' name='name'></p>" +
//         //   "<input type='text' id='input__place2' placeholder='Укажите место' name='place'>" +
//         //   "<p><textarea id='input__review2' placeholder ='Оставьте отзыв' name='review'></textarea></p> " +
//         //   "<p><button type='button' id='btn2'>Добавить</button></p> " +
//         //   "</form>",
//       });

//       placemark.events.add("click", () => {
//         showBalloon(coords, reviews).then(() => {
//           const form = document.getElementById("form");
//           const btn = document.getElementById("btn");
//           btn.addEventListener("click", function (e) {
//             console.log("click");
//             placemarksData.push({
//               //добавляем метку в localStorage
//               id: placemarksData.length,
//               name: form.elements.name.value,
//               place: form.elements.place.value,
//               reviews: [form.elements.review.value],
//               coords: coords,
//             });

//             storage.placemarks = JSON.stringify(placemarksData); //обрабатываем массив меток в строку
//             createPlacemark(coords);
//             myMap.balloon.close();
//           });
//         });
//       });

//       myMap.geoObjects.add(placemark);
//       return placemark;
//     }

//     showPlacemarks(getPlacemarks(placemarksData));

//     const showBalloon = (coords, reviews) => {
//       return myMap.balloon.open(coords, {
//         contentBody:
//           reviews +
//           "<h2>Отзыв</h2>" +
//           "<form id='form'>" +
//           "<p><input type='text' id='input__name' placeholder='Укажите ваше имя' name='name'></p>" +
//           "<input type='text' id='input__place' placeholder = 'Укажите место' name='place'>" +
//           "<p><textarea id='input__review' placeholder ='Оставьте отзыв' name='review'></textarea></p> " +
//           "<p><button type='button' id='btn'>Добавить</button></p> " +
//           "</form>",
//       });
//     };

//     myMap.events.add("click", (e) => {
//       if (!myMap.balloon.isOpen()) {
//         //If balloon is not opened
//         let coords = e.get("coords"); //получаем координаты клика

//         showBalloon(coords).then(() => {
//           const form = document.getElementById("form");
//           const btn = document.getElementById("btn");

//           btn.addEventListener("click", function (e) {
//             //обрабатываем клик по кнопке "Добавить"
//             e.preventDefault();
//             placemarksData.push({
//               //добавляем метку в localStorage
//               id: placemarksData.length,
//               name: form.elements.name.value,
//               place: form.elements.place.value,
//               reviews: [form.elements.review.value],
//               coords: coords,
//             });

//             storage.placemarks = JSON.stringify(placemarksData); //обрабатываем массив меток в строку
//             myMap.balloon.close();

//             createPlacemark(coords);
//           });
//         });
//       } else {
//         //if balloon is opened -> close it
//         myMap.balloon.close();
//       }
//     });
//   });
// }

// export { mapInit };
