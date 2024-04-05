// Выпадающий список городов
const selectCities = document.getElementById('select-cities'),
      selectCountries = document.getElementById("select-countries"),
      selectStates = document.getElementById("select-states"),
      selectLanguage = document.getElementById("select-language"),
      optionCountries = document.querySelectorAll("#select-countries option"),
      optionStates = document.querySelectorAll("#select-states option"),
      optionCities = document.querySelectorAll('#select-cities option');

// Элементы времени намаза
const bamdatTd = document.getElementById('bamdat'),
      kunTd = document.getElementById('kun'),
      besinTd = document.getElementById('besin'),
      ekintiTd = document.getElementById('ekinti'),
      aqshamTd = document.getElementById('aqsham'),
      quptanTd = document.getElementById('quptan'),
      tableCaptions = document.querySelectorAll("#captions td");

    // Элемент с именем города
const citynameDiv = document.getElementById('cityname');
const time_span = document.getElementById("time");
const for_tableCaptions = { 'rus': ['Фаджр', 'Восход', 'Духа', 'Аср', 'Магриб ', 'Иша'], 'kaz': ['Таң', 'Күн шығуы', 'Бесін', 'Екінті', 'Ақшам', "Құптан"] };

// Элемент с номером
const countTd = document.getElementById('count');
//  "https://translate.googleapis.com/translate_a/single?client=gtx&sl="+ sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(text)
// Ссылки и API адресы для получения данных по API
const get_country_urls = { 'rus': 'https://namaztimes.kz/ru/api/country?type=json', 'kaz': 'https://namaztimes.kz/api/country?type=json' }; //дает сразу список всех стран мира в формате json                           --- URL-1 ---
const get_states_urls = { 'rus': 'https://namaztimes.kz/ru/api/states?id=', 'kaz': 'https://namaztimes.kz/api/states?id=' }; //id=99 - KAzakhstan\ дает список областей/штатов по id стрраны                             --- URL-2 ---
const get_cities_urls = { 'rus': 'https://namaztimes.kz/ru/api/cities?id=', 'kaz': 'https://namaztimes.kz/api/cities?id=' }; //karaganda&type=json'-городы по штат-id (например Караганда)                               --- URL-3 ---
const translate_urls = { 'rus': "https://translate.googleapis.com/translate_a/single?client=gtx&sl=kk&tl=ru&dt=t&q=", 'kaz': "https://translate.googleapis.com/translate_a/single?client=gtx&sl=ru&tl=kk&dt=t&q=" };//  --- URL-0 ---

// API-адрес для получения время молитвы по id-города
const get_prayer_time_url = "https://namaztimes.kz/api/praytimes?id=";  //id={city_id}&type={format}- дает время молитвы в формате json/xml     --- URL-4 ---

// call functions
    selectLanguage.onchange = translate;

    function translate() {
        if (selectLanguage.value == 'rus') {
            getLocationRus();
            optionCountries[0].textContent = 'Выберите страну';
            optionStates[0].textContent = 'Выберите штат/обл';
            optionCities[0].textContent = 'Выберите город';
            selectCountries.onchange = addSataeRus;
            selectStates.onchange = addCityRus;
            selectCities.onchange = times;
            for (let i = 1; i < tableCaptions.length; i++) {
                tableCaptions[i].innerText = for_tableCaptions.rus[i - 1];
            }
        }
        else {
            getLocationKaz();
            optionCountries[0].textContent = 'Елді таңдаңыз';
            optionStates[0].textContent = 'Штат/обл таңдаңыз';
            optionCities[0].textContent = 'Қалаңызды таңдаңыз';
            selectCountries.onchange = addSataeKaz;
            selectStates.onchange = addCityKaz;
            selectCities.onchange = times;
            for (let i = 1; i < tableCaptions.length; i++) {
                tableCaptions[i].innerText = for_tableCaptions.kaz[i - 1];
            }
        }
    }
    translate();



    function getLocationRus() {
        //get country
        fetch(get_country_urls.rus).
            then((response) => response.json()).
            then((data_rus) => {
                const country_keys_rus = Object.keys(data_rus);
                for (let i = 0; i < country_keys_rus.length; i++) {
                    let newOptionCountry = document.createElement('option');
                    newOptionCountry.text = data_rus[country_keys_rus[i]];
                    newOptionCountry.value = country_keys_rus[i];
                    selectCountries.append(newOptionCountry);
                }
            });
    }
    function addSataeRus() {
        //get states
        fetch(get_states_urls.rus + selectCountries.value).
            then((response) => response.json()).
            then((states_rus) => {
                const state_keys_rus = Object.keys(states_rus);
                selectStates.innerHTML = `<option value="default" disabled selected>Выберите штат/обл</option>`;
                selectCities.innerHTML = `<option value="default" disabled selected>Выберите город</option>`;
                for (let j = 0; j < state_keys_rus.length; j++) {
                    let newOptionState = document.createElement('option');
                    newOptionState.text = states_rus[state_keys_rus[j]];
                    newOptionState.value = state_keys_rus[j];
                    selectStates.appendChild(newOptionState);
                }
            });
    }
    function addCityRus() {
        //get cities
        fetch(get_cities_urls.rus + selectStates.value + "&type=json").
            then((response) => response.json()).
            then((cities_rus) => {
                console.log(cities_rus);
                const city_keys_rus = Object.keys(cities_rus);
                selectCities.innerHTML = `<option value="default" disabled selected>Выберите город</option>`;
                for (let k = 0; k < city_keys_rus.length; k++) {
                    let newOptionCity = document.createElement('option');
                    newOptionCity.text = cities_rus[city_keys_rus[k]];
                    newOptionCity.value = city_keys_rus[k];
                    selectCities.append(newOptionCity);
                }
            });
            times();
    }
    function times() {
        fetch(get_prayer_time_url + selectCities.value + "&type=json").
            then(response => response.json()).
            then(data => {
                console.log(data);
                bamdatTd.textContent = data.praytimes.bamdat;
                kunTd.textContent = data.praytimes.kun;
                besinTd.textContent = data.praytimes.besin;
                ekintiTd.textContent = data.praytimes.ekindi;
                aqshamTd.textContent = data.praytimes.aqsham;
                quptanTd.textContent = data.praytimes.quptan;
                if(data.attributes.CityName == null || data.attributes.CityName == ''){
                    citynameDiv.textContent = selectCities[1].textContent;
                }
                else{
                    citynameDiv.textContent = data.attributes.CityName;
                }
            });
    }


    //kaz
    function getLocationKaz() {
        //get country
        fetch(get_country_urls.kaz).
            then((response) => response.json()).
            then((data_kaz) => {
                const country_keys_kaz = Object.keys(data_kaz);
                for (let i = 0; i < country_keys_kaz.length; i++) {
                    let newOptionCountry = document.createElement('option');
                    newOptionCountry.text = data_kaz[country_keys_kaz[i]];
                    newOptionCountry.value = country_keys_kaz[i];
                    selectCountries.append(newOptionCountry);
                }
            });
    }
    function addSataeKaz() {
        //get states
        fetch(get_states_urls.kaz + selectCountries.value).
            then((response) => response.json()).
            then((states_kaz) => {
                const state_keys_kaz = Object.keys(states_kaz);
                console.table(states_kaz);
                selectStates.innerHTML = `<option value="default" disabled selected>Штат/обл таңдаңыз</option>`;
                selectCities.innerHTML = `<option value="default" disabled selected>Қалаңызды таңдаңыз</option>`;
                for (let j = 0; j < state_keys_kaz.length; j++) {
                    let newOptionStateKaz = document.createElement('option');
                    newOptionStateKaz.text = states_kaz[state_keys_kaz[j]];
                    newOptionStateKaz.value = state_keys_kaz[j];
                    selectStates.appendChild(newOptionStateKaz);
                }
            });
    }
    function addCityKaz() {
        //get cities
        fetch(get_cities_urls.kaz + selectStates.value + "&type=json").
            then((response) => response.json()).
            then((cities_kaz) => {
                console.log(cities_kaz);
                const city_keys_kaz = Object.keys(cities_kaz);
                selectCities.innerHTML = `<option value="default" disabled selected>Қалаңызды таңдаңыз</option>`;
                for (let k = 0; k < city_keys_kaz.length; k++) {
                    let newOptionCityKaz = document.createElement('option');
                    newOptionCityKaz.text = cities_kaz[city_keys_kaz[k]];
                    newOptionCityKaz.value = city_keys_kaz[k];
                    selectCities.append(newOptionCityKaz);
                }
            });
            times();
    }

    function time_(){
        var date = new Date();
        var hours = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        time_span.innerHTML = `${("0"+hours).substr(-2)}:${("0"+min).substr(-2)}:${("0"+sec).substr(-2)}`;
    }
    setInterval(time_,1000);

    var x = /abc/;
    console.log(x);
