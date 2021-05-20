function mapInit() {
  ymaps.ready(() => {
    //     create map
    let myMap = new ymaps.Map("map", {
      center: [55.751574, 37.573856],
      zoom: 13,
      controls: ["zoomControl"],
      behaviors: ["drag"],
    });

    //create cluster

    let clusterer = new ymaps.Clusterer({
      groupByCoordinates: true,
      clusterDisableClickZoom: true,
      clusterBalloonContentLayoutWidth: 200,
      clusterBalloonContentLayoutHeight: 330,
      hasBalloon: false,
    });
    myMap.geoObjects.add(clusterer);

    let coords;

    //      create localStorage
    let placemarksData;
    let storage = localStorage;
    if (!storage.placemarks) {
      placemarksData = [];
    } else {
      placemarksData = JSON.parse(storage.placemarks);
    }

    //      createPlacemark

    const template2 = Handlebars.compile(`
    <ul class="reviews">
    {{#each items}}
        <li class="reviews__item review">
            <div class="review__header">
                <span class="review__name">{{name}}</span>
                <span class="review__location">[{{place}}]</span>
            </div>
            <p class="review__text">{{review}}</p>
        </li>
    {{/each}} 
</ul>
    <h2>Отзыв</h2> 
  <form id='form'>
  <p><input type='text' id='input__name' placeholder='Укажите ваше имя' name='name'></p> 
  <input type='text' id='input__place' placeholder = 'Укажите место' name='place'>
  <p><textarea id='input__review' placeholder ='Оставьте отзыв' name='review'></textarea></p> 
  <p><button type='button' id='btn'>Добавить</button></p>  
  </form>`);

    function transformArray(placemarks, coordinates) {
      let newArr = [];
      placemarks.forEach((data) => {
        if (coordinates.toString() === data.coords.toString()) {
          newArr.push({
            name: data.name,
            place: data.place,
            review: data.review,
          });
        }
      });
      return newArr;
    }

    //add click to clusterer

    clusterer.events.add("click", (e) => {
      coords = e.get("target").geometry.getCoordinates();
      myMap.balloon.open(
        coords,
        template2({
          items: transformArray(placemarksData, coords),
        })
      );
    });

    //create placemark

    function createPlaceMark(ourCoords, data) {
      let placemark = new ymaps.Placemark(ourCoords, {
        balloonContentBody: template2({
          items: [
            {
              name: data.name,
              place: data.place,
              review: data.review,
            },
          ],
        }),
      });

      clusterer.add(placemark);

      return placemark;
    }

    //      show placemarks on the map
    function showPlaceMarks(data) {
      for (let i = 0; i < data.length; i++) {
        createPlaceMark(data[i].coords, data[i]);
      }
    }

    //      save to localStorage
    function saveToStorage(data, form, coords) {
      data.push({
        //добавляем метку в localStorage
        name: form.elements.name.value,
        place: form.elements.place.value,
        review: form.elements.review.value,
        coords: coords,
      });

      storage.placemarks = JSON.stringify(data);
    }

    //show placemarks on the map
    showPlaceMarks(placemarksData);

    //show balloon
    const showBalloon = function (coords) {
      myMap.balloon.open(coords, {
        contentBody: template2({
          items: transformArray(placemarksData, coords),
        }),
      });
    };

    myMap.events.add("click", (e) => {
      coords = e.get("coords");
      showBalloon(coords);
    });

    document.addEventListener("click", (e) => {
      if (e.target.id === "btn") {
        const form = document.getElementById("form");
        e.preventDefault();
        saveToStorage(placemarksData, form, coords);
        createPlaceMark(coords, placemarksData[placemarksData.length - 1]);

        myMap.balloon.close();
      }
    });
  });
}

export { mapInit };
