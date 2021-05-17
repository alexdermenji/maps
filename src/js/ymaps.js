function mapInit() {
  ymaps.ready(() => {
    //create localStorage
    let placemarksData;
    let storage = localStorage;
    if (!storage.placemarks) {
      placemarksData = [];
    } else {
      placemarksData = JSON.parse(storage.placemarks);
    }

    //create map
    let myMap = new ymaps.Map("map", {
      center: [51.51, -0.12],
      zoom: 14,
      controls: ["zoomControl"],
      behaviors: ["drag"],
    });

    //Transform array of data into array of Geoobjects
    function getPlacemarks(arrayOfPlacemarks) {
      let geoObjects = [];
      for (let i = 0; i < arrayOfPlacemarks.length; i++) {
        geoObjects[i] = createPlacemark(
          arrayOfPlacemarks[i].coords,
          arrayOfPlacemarks[i].reviews
        );
      }

      let myClusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: false,
      });
      myClusterer.add(geoObjects);
      myMap.geoObjects.add(myClusterer);
    }

    function showBaloon(coords) {
      return myMap.balloon.open(coords, {
        contentBody:
          "<h2>Отзыв</h2>" +
          "<form id='form'>" +
          "<p><input type='text' id='input__name' placeholder='Укажите ваше имя' name='name'></p>" +
          "<input type='text' id='input__place' placeholder = 'Укажите место' name='place'>" +
          "<p><textarea id='input__review' placeholder ='Оставьте отзыв' name='review'></textarea></p> " +
          "<p><button id='btn'>Добавить</button></p> " +
          "</form>",
      });
    }

    function createPlacemark(coords, reviews = "нет отзывов") {
      let result = "";
      if (Array.isArray(reviews)) {
        for (const review of reviews) {
          result += `<p>${review}</p>`;
        }
      }
      console.log(result);
      let placemark = new ymaps.Placemark(coords, {
        balloonContent:
          result +
          "<h2>Отзыв</h2>" +
          "<form id='form'>" +
          "<p><input type='text' id='input__name' placeholder='Укажите ваше имя' name='name'></p>" +
          "<input type='text' id='input__place' placeholder = 'Укажите место' name='place'>" +
          "<p><textarea id='input__review' placeholder ='Оставьте отзыв' name='review'></textarea></p> " +
          "<p><button id='btn'>Добавить</button></p> " +
          "</form>",
      });

      myMap.geoObjects.add(placemark);
      return placemark;
    }

    //click event on map
    myMap.events.add("click", function (e) {
      if (!myMap.balloon.isOpen()) {
        //If balloon is not opened
        let coords = e.get("coords"); //получаем координаты клика

        showBaloon(coords).then(function () {
          //после открытия балуна получаем eго элементы
          const form = document.getElementById("form");
          const btn = document.getElementById("btn");

          btn.addEventListener("click", function (e) {
            //обрабатываем клик по кнопке "Добавить"
            e.preventDefault();
            placemarksData.push({
              //добавляем метку в localStorage
              id: placemarksData.length,
              name: form.elements.name.value,
              place: form.elements.place.value,
              reviews: [form.elements.review.value],
              coords: coords,
            });

            storage.placemarks = JSON.stringify(placemarksData); //обрабатываем массив меток в строку

            //добавляем нвоую метку на карту
            createPlacemark(coords);

            myMap.balloon.close(); //close Balloon
          });
        });
      } else {
        //if balloon is opened -> close it
        myMap.balloon.close();
      }
    });

    getPlacemarks(placemarksData);
  });
}

export { mapInit };
