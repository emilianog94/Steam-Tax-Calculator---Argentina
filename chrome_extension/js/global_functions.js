const attributeName = "data-original-price";
const walletBalance = getBalance();
const totalTaxes = 1.64;
const taxes = {
    tax1 : {
        name : "IVA Servicios Digitales",
        percentage : 0.21,
        moreInfo: "https://www.afip.gob.ar/iva/servicios-digitales/obligados.asp"
    },
    tax2 : {
        name : "Impuesto PAIS",
        percentage : 0.8,
        moreInfo: "https://www.afip.gob.ar/impuesto-pais/caracteristicas/definicion.asp"
    },
    tax3 : {
        name : "Retención de Impuesto a las ganancias",
        percentage : 0.35,
        moreInfo: "https://www.afip.gob.ar/impuesto-pais/caracteristicas/definicion.asp"
    }
};

function getBalance(){
    let walletBalanceContainer = document.querySelector("#header_wallet_balance");
    if(walletBalanceContainer){
        walletBalanceContainer.style.color="#a4d007";
        return convertStringToNumber(walletBalanceContainer,5)
    } else{
        return 0;
    }

}

function getAppPrices(){
    // Get all current non-converted prices
    let prices = document.querySelectorAll(`.discount_final_price:not([${attributeName}]), .game_area_dlc_price:not([${attributeName}]), .game_purchase_price:not([${attributeName}]), [class*=salepreviewwidgets_StoreSalePriceBox]:not([${attributeName}]), .search_price:not([${attributeName}]), .regular_price:not([${attributeName}]), .match_price:not([${attributeName}])`);
    prices.forEach(price => setArgentinaPrice(price));
}

function setArgentinaPrice(price){
    // Verificar si el producto realmente tiene un precio.
    if(price.innerText.includes("ARS$")){
        let positionArs = price.innerText.lastIndexOf("ARS$ ") + 5;
        let baseNumericPrice = convertStringToNumber(price,positionArs);
        price.dataset.originalPrice = baseNumericPrice;
        price.dataset.argentinaPrice = (baseNumericPrice * totalTaxes).toFixed(2);

        // Verifico si alcanza con el saldo actual de la wallet
        price.dataset.originalPrice <= walletBalance ? price.classList.add("wallet-available") : "";

        displayAppPrices(price);
    }
    else{
        price.dataset.originalPrice = "none";
    }
}

function convertStringToNumber(price,positionArs){
    return parseFloat(price.innerText.slice(positionArs).replace(".","").replace(",","."));
}

function convertNumberToString(price){
    return `ARS$ ${price}`.replace('.',',');
}

function displayAppPrices(price){
    let argentinaPrice = convertNumberToString(price.dataset.argentinaPrice);
    let originalPrice = convertNumberToString(price.dataset.originalPrice);

    if(price.classList.contains('game_purchase_price')){
        let newElement = `<div class="game_purchase_price price" data-original-price="none">${argentinaPrice}</div>`;
        price.insertAdjacentHTML('afterend',newElement);
    } else if(price.classList.contains('discount_final_price')){
        let newElement = `<div class="discount_final_price price" data-original-price="none">${argentinaPrice}</div>`;
        price.insertAdjacentHTML('afterend',newElement);    
    } else if(price.classList.contains('game_area_dlc_price')){
        price.innerHTML = `<span class="oldprice">${originalPrice}</span> <span class="finalprice">${argentinaPrice}</span>`;
    } else if(price.classList.contains('search_price')){
        let newElement = `<div class="search_price price" data-original-price="none">${argentinaPrice}</div>`;
        price.insertAdjacentHTML('afterend',newElement);   
    }  else if(price.classList.contains('regular_price')){
        let newElement = `<div class="regular_price price" data-original-price="none">${argentinaPrice}</div>`;
        price.insertAdjacentHTML('afterend',newElement);   
    }  else if(price.classList.contains('match_price')){
        let newElement = `<div class="match_price price" data-original-price="none">${argentinaPrice}</div>`;
        price.insertAdjacentHTML('afterend',newElement);   
    }
}

