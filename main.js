let allCountries = "https://restcountries.com/v2/all";

const mainContent = document.querySelector(".main-content");
const mainContainer = document.querySelector(".main");

const detailedPageContainer = document.querySelector(".detailedPage");
const backBtn = document.querySelector(".detailedPage-header");

let searchBar = document.getElementById("search-bar");
let searchResults = document.querySelector(".search-results");

let filterResults = document.querySelector(".filter-results");
let filterMenu = document.querySelector(".filter-header");

let regions = document.querySelectorAll(".filter-results p");
let icon = document.querySelector(".filter-header i");

backBtn.addEventListener("click", () => {
  mainContainer.style.display = "flex";
  backBtn.remove();
  resetContent();
});

async function getCountries() {
  let res = await fetch(allCountries);
  let data = await res.json();
  appendToDOM();

  function appendToDOM() {
    data.forEach((country) => {
      const card = document.createElement("div");
      card.className = "card";
      const imageContainer = document.createElement("div");
      imageContainer.className = "image";
      const infoContainer = document.createElement("div");
      infoContainer.className = "info";

      let img = document.createElement("img");
      img.src = country.flag;
      img.alt = `${country.name}-flag`;

      imageContainer.append(img);

      let countryName = document.createElement("h3");
      countryName.innerHTML = country.name;

      let countryPop = document.createElement("p");
      countryPop.innerHTML = `<span>Population</span>: ${country.population}`;

      let countryRegion = document.createElement("p");
      countryRegion.innerHTML = `<span>Region</span>: ${country.region}`;

      let countryCapital = document.createElement("p");
      countryCapital.innerHTML = `<span>Capital</span>: ${
        country.capital == undefined ? "Unknown" : country.capital
      }`;

      infoContainer.append(
        countryName,
        countryPop,
        countryRegion,
        countryCapital
      );

      card.append(imageContainer, infoContainer);
      mainContent.append(card);

      card.addEventListener("click", () => {
        detailedPage(country.name);
      });

      searchBar.addEventListener("input", () => {
        searching();
      });
      function searching() {
        if (searchBar.value !== "") {
          searchResults.style.display = "flex";
          searchResults.style.animation = "search ease 0.5s forwards";
          if (
            country.name.startsWith(
              `${
                searchBar.value.toUpperCase() || searchBar.value.toLowerCase()
              }`
            )
          ) {
            searchResults.style.display = "flex";
            searchResults.style.animation = "search ease 0.5s forwards";
            let p = document.createElement("p");
            p.innerHTML = country.name;
            searchResults.append(p);
            p.addEventListener("click", () => {
              detailedPage(p.innerHTML);
              searchBar.value = "";
              searchBar.focus();
              searchResults.style.animation = "unset";
              searchResults.style.display = "none";
            });
          }
        } else {
          searchResults.style.animation = "unset";
          searchResults.style.display = "none";
          searchResults.innerHTML = "";
        }
      }
    });
  }
}

function detailedPage(countryName) {
  mainContainer.style.display = "none";
  detailedPageContainer.style.display = "flex";
  specificCountry = `
    https://restcountries.com/v2/name/${countryName}`;
  async function getDetailedPage() {
    let res = await fetch(specificCountry);
    let data = await res.json();
    let cImgSrc = data[0].flag;
    let cImgAlt = `${data[0].name}-flag`;
    let cName = data[0].name;
    let cNativeName = data[0].nativeName;
    let cPop = data[0].population;
    let cRegion = data[0].region;
    let cSubRegion = data[0].subregion;
    let cCapital = data[0].capital;
    let cTopLevelDomain = data[0].topLevelDomain;
    let cCurrencies = data[0].currencies[0].name;
    let cLanguages = data[0].languages;
    let borderCountries = data[0].borders;

    let borderCountriesContainer = document.createElement("div");

    async function getCountryName(bCountry) {
      let countryName = `https://restcountries.com/v3.1/alpha/${bCountry}`;
      let res = await fetch(countryName);
      let data = await res.json();
      let countries = data[0].name.common;

      borderCountriesContainer.className = "border-countries-container";
      let country = document.createElement("div");
      country.className = "b-countries";
      country.innerHTML = countries;
      borderCountriesContainer.append(country);

      country.addEventListener("click", () => {
        resetContent();
        detailedPage(country.innerHTML);
      });
    }

    addDetailedPage();

    function addDetailedPage() {
      let detailedPage = document.createElement("div");
      detailedPage.className = "detailedPage-content";
      let imgContainer = document.createElement("div");
      imgContainer.className = "detailedPage-image";

      let img = document.createElement("img");
      img.src = cImgSrc;
      img.alt = cImgAlt;
      imgContainer.append(img);

      let detailedPageInfo = document.createElement("div");
      detailedPageInfo.className = "detailedPage-info";
      let name = document.createElement("h3");
      name.innerHTML = cName;
      let details = document.createElement("div");
      details.className = "details";

      let leftSide = document.createElement("div");
      leftSide.className = "left-side";

      leftSide.innerHTML = `<p><span>Native Name</span>: ${cNativeName} </p>
        <p><span>Population</span>: ${cPop} </p>
        <p><span>Region</span>: ${cRegion} </p>
        <p><span>Sub Region</span>: ${cSubRegion} </p>
        <p><span>Capital</span>: ${cCapital} </p>`;

      let rightSide = document.createElement("div");
      rightSide.className = "right-side";

      cTopLevelDomain.forEach((domain) => {
        let Domains = document.createElement("p");
        Domains.innerHTML = `<span>Top Level Domain</span>: ${domain}`;
        rightSide.append(Domains);
      });

      let langs = document.createElement("p");
      let langsArr = [];
      cLanguages.forEach((lang) => {
        langsArr.push(lang.name);
        langs.innerHTML = `<span>Languages</span>: ${langsArr}`;
        rightSide.append(langs);
      });

      let currencies = document.createElement("p");
      currencies.innerHTML = `<span>Currencies</span>: ${cCurrencies}`;

      rightSide.append(currencies);

      if (borderCountries !== undefined) {
        borderCountries.forEach((bCountry) => {
          getCountryName(bCountry);
        });
      }

      details.append(leftSide, rightSide);

      detailedPageInfo.append(name, details, borderCountriesContainer);

      detailedPage.append(imgContainer, detailedPageInfo);
      detailedPageContainer.append(detailedPage);
    }
  }

  getDetailedPage();
}

searchBar.addEventListener("input", () => {
  searchResults.innerHTML = "";
});

filterMenu.addEventListener("click", () => {
  showFilterMenu();
});

regions.forEach((region) => {
  region.addEventListener("click", () => {
    filterResults.style.display = "none";
    filterResults.style.animation = "unset";
    icon.className = "fas fa-caret-up arrow";
    if (region.innerHTML !== "All") {
      mainContent.innerHTML = "";
      sortByRegion(region.innerHTML);
      filterMenu.firstElementChild.innerHTML = region.innerHTML;
    } else {
      mainContent.innerHTML = "";
      filterMenu.firstElementChild.innerHTML = "Filter by Region";
      getCountries();
    }
  });
});

async function sortByRegion(region) {
  let specificCountry = `https://restcountries.com/v3.1/region/${region}`;
  let res = await fetch(specificCountry);
  let data = await res.json();

  data.forEach((country) => {
    const card = document.createElement("div");
    card.className = "card";
    const imageContainer = document.createElement("div");
    imageContainer.className = "image";
    const infoContainer = document.createElement("div");
    infoContainer.className = "info";

    let img = document.createElement("img");
    img.src = country.flags.png;
    img.alt = `${country.name}-flag`;

    imageContainer.append(img);

    let countryName = document.createElement("h3");
    countryName.innerHTML = country.name.common;

    let countryPop = document.createElement("p");
    countryPop.innerHTML = `<span>Population</span>: ${country.population}`;

    let countryRegion = document.createElement("p");
    countryRegion.innerHTML = `<span>Region</span>: ${country.region}`;

    let countryCapital = document.createElement("p");
    countryCapital.innerHTML = `<span>Capital</span>: ${
      country.capital == undefined ? "Unknown" : country.capital
    }`;

    infoContainer.append(
      countryName,
      countryPop,
      countryRegion,
      countryCapital
    );

    card.append(imageContainer, infoContainer);
    mainContent.append(card);

    card.addEventListener("click", () => {
      detailedPage(countryName.innerHTML);
    });
  });
}

function showFilterMenu() {
  if (icon.className === "fas fa-caret-up arrow") {
    filterResults.style.display = "flex";
    filterResults.style.animation = "search 0.3s ease forwards";
    icon.className = "fas fa-caret-down arrow";
  } else {
    filterResults.style.display = "none";
    filterResults.style.animation = "unset";
    icon.className = "fas fa-caret-up arrow";
  }
}

function resetContent() {
  let allContent = document.querySelectorAll(".detailedPage-content");
  allContent.forEach((content) => {
    content.remove();
  });
}
getCountries();
