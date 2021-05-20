(()=>{"use strict";var e={};function t(){ymaps.ready(()=>{let a=new ymaps.Map("map",{center:[55.751574,37.573856],zoom:13,controls:["zoomControl"],behaviors:["drag"]});let n=new ymaps.Clusterer({groupByCoordinates:true,clusterDisableClickZoom:true,clusterBalloonContentLayoutWidth:200,clusterBalloonContentLayoutHeight:330,hasBalloon:false});a.geoObjects.add(n);let o;let l;let r=localStorage;if(!r.placemarks){l=[]}else{l=JSON.parse(r.placemarks)}const i=Handlebars.compile(`
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
  </form>`);function t(e,t){let a=[];e.forEach(e=>{if(t.toString()===e.coords.toString()){a.push({name:e.name,place:e.place,review:e.review})}});return a}n.events.add("click",e=>{o=e.get("target").geometry.getCoordinates();a.balloon.open(o,i({items:t(l,o)}))});function s(e,t){let a=new ymaps.Placemark(e,{balloonContentBody:i({items:[{name:t.name,place:t.place,review:t.review}]})});n.add(a);return a}function e(t){for(let e=0;e<t.length;e++){s(t[e].coords,t[e])}}function c(e,t,a){e.push({name:t.elements.name.value,place:t.elements.place.value,review:t.elements.review.value,coords:a});r.placemarks=JSON.stringify(e)}e(l);const p=function(e){a.balloon.open(e,{contentBody:i({items:t(l,e)})})};a.events.add("click",e=>{o=e.get("coords");p(o)});document.addEventListener("click",e=>{if(e.target.id==="btn"){const t=document.getElementById("form");e.preventDefault();c(l,t,o);s(o,l[l.length-1]);a.balloon.close()}})})}window.onload=t()})();
//# sourceMappingURL=index.6aff80ea89943e264ecf.js.map