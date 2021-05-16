function mapInit() {
  ymaps.ready(() => {
    let storage = localStorage;
    storage.placemarks = [];
    let moscow = new ymaps.Map("map", {
      center: [51.51, -0.12],
      zoom: 14,
      controls: ["zoomControl"],
      behaviors: ["drag"],
    });

    moscow.events.add("click", function (e) {
      if (!moscow.balloon.isOpen()) {
        let coords = e.get("coords");

        moscow.balloon
          .open(coords, {
            contentHeader: "<h1 class='header'>Отзыв</h1>",
            contentBody:
              "<form id='form'>" +
              "<p><input type='text' id='input__name' placeholder='Укажите ваше имя' name='name'></p>" +
              "<input type='text' id='input__place' placeholder = 'Укажите место' name='place'>" +
              "<p><textarea id='input__review' placeholder ='Оставьте отзыв' name='review'></textarea></p> " +
              "<p><button id='btn'>Добавить</button></p> " +
              "</form>",
            // [coords[0].toPrecision(6), coords[1].toPrecision(6)].join(", "),
            contentFooter: "<sup>Щелкните еще раз</sup>",
          })
          .then(function () {
            const form = document.getElementById("form");
            const btn = document.getElementById("btn");

            btn.addEventListener("click", function (e) {
              e.preventDefault();
              storage.placemarks.push(
                JSON.stringify({
                  name: form.elements.name.value,
                  place: form.elements.place.value,
                  review: form.elements.review.value,
                  coords: coords,
                })
              );

              let placemark = new ymaps.Placemark(coords, {});

              moscow.geoObjects.add(placemark);
              moscow.balloon.close();
            });
          });

        moscow.balloon.close();
      }
    });
  });
}

export { mapInit };
