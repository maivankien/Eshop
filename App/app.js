// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCsl0Uv9y0HjDM4ns5jZ6NYGk9gP7KXgG8",
    authDomain: "eshop-15508.firebaseapp.com",
    databaseURL: "https://eshop-15508-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "eshop-15508",
    storageBucket: "eshop-15508.appspot.com",
    messagingSenderId: "358511153691",
    appId: "1:358511153691:web:dc7675a80bb4fdd5c2debe",
    measurementId: "G-TNYKGTWBJN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
import { getDatabase, ref, get, set, child, update, remove }
    from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";

const db = getDatabase();

let count = 0;
const cartLists = document.querySelector('.header__shoping-list')
const cartAmout = document.querySelector('.header__middle-shop-amount')
const cartTotal = document.querySelector('.header__shoping-footer-total')
const noCart = document.querySelector('.header__shoping-no-cart')

for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i) !== 'firebase:host:eshop-15508-default-rtdb.asia-southeast1.firebasedatabase.app'
        && localStorage.key(i) !== 'firebase:previous_websocket_failure'
    ) {
        count++;
    }
}



const countItem = () => {
    const countItems = document.querySelector('.header__middle-shop-amount');
    countItems.innerHTML = `${count} ITEM`;
    document.querySelector('.header__middle-cart-notice').innerHTML = `${count}`;
}

const convert = (string) => {
    const newString = string.replace('$', '');
    const newNum = parseInt(newString)
    return newNum;
}


let sumTotal = 0;
const total = (sum) => {
    const stringTotal = document.querySelector('.header__shoping-footer-total')
    sumTotal = sumTotal + sum;
    stringTotal.innerHTML = `$${sumTotal}.00`
}




countItem();



const addCart = (img, name, price) => {

    let html = ''
    html =
        `
                    <li class="header__shoping-item">
                        <div class="shoping__item-content">
                            <a class="shoping__item-link" href="#">
                                <h4 class="shoping__item-name">${name}</h4>
                            </a>
                            <div class="shoping__item-price">
                                <span class="shoping__item-count">1 x</span>
                                ${price}
                            </div>
                            <button class="shoping__item-delete">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div class="shoping__item-img">
                            <img src="${img}">
                        </div>
                    </li>
                `
    cartLists.innerHTML = cartLists.innerHTML + html;

    const removeBtn = document.querySelectorAll('.shoping__item-delete');
    removeBtn.forEach((event) => {
        event.onclick = (e) => {
            console.log(event)
            console.log(getFarent(event))
            getFarent(event).parentNode.removeChild(getFarent(event));

            count--;
            cartLists.innerHTML = '';
            if (count === 0) {
                noCart.style.display = 'block'
            }
            let local = localStorage.getItem(count)

            countItem();
            let price = getFarent(event).querySelector('.shoping__item-price').textContent.replace('1 x', '').replace('$', '')
            let newPrice = parseInt(price)
            console.log(newPrice)

            let a = parseInt(document.querySelector('.header__shoping-footer-total').innerHTML.replace('$', ''))

            document.querySelector('.header__shoping-footer-total').innerHTML = `$${a - newPrice}`

            console.log(a - newPrice)

            for (let i = 1; i <= count; i++) {
                if (count !== 0) {
                    noCart.style.display = 'none';
                }
                let local = localStorage.getItem(i)
                if (count !== 0) {
                    addCart(JSON.parse(local).img, JSON.parse(local).name, JSON.parse(local).price)
                }
            }
        }
    })

}


const getFarent = (event) => {
    return event.parentElement.parentElement;
}

const getlength = async (tabName, element) => {
    let html = '';
    let response = await get(child(ref(db), tabName))
    let data = await response.size
    for (let i = 1; i <= data; i++) {
        get(child(ref(db), tabName + "/" + i))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    html =
                        `
                                <div class="trending__contain l-3 m-4 ">
                                <div class="trending__tab-item ">
                                    <a class="trending__tab-link" href="#">
                                        <img class="trending__tab-img" src="${snapshot.val().img}"></img>
                                    </a>
                                    <a class="trending__tab-link" href="#">
                                        <span class="trending__tab-name">${snapshot.val().name}</span>
                                    </a>
                                    <div class="trending__tab-price">$${snapshot.val().price}</div>
                                    <div class="trending__tab-add">
                                        <button class="trending__tab-addcart">ADD TO CART</button>
                                        <div class="trending__tab-moreAdd">
                                            <i class="fa-regular fa-eye">
                                                <div class="trending__more-icon">Quick Shop</div>
                                            </i>
                                            <i class="fa-regular fa-heart">
                                                <div class="trending__more-icon">Add to Wishlist</div>
                                            </i>
                                            <i class="fa-sharp fa-solid fa-chart-column">
                                                <div class="trending__more-icon">Add to Compare</div>
                                            </i>
                                        </div>
                                    </div>
                                </div>
                                
                                </div>
                                `
                    element.innerHTML = element.innerHTML + html
                }


                document.querySelectorAll('.trending__tab-addcart').forEach((event) => {
                    event.onclick = (e) => {

                        count++;

                        let imgs = getFarent(event).querySelector('.trending__tab-img').src
                        let names = getFarent(event).querySelector('.trending__tab-name').innerHTML
                        let prices = getFarent(event).querySelector('.trending__tab-price').innerHTML

                        localStorage.setItem(count, JSON.stringify(
                            {
                                img: imgs,
                                name: names,
                                price: prices
                            }))

                        let local = localStorage.getItem(count)

                        countItem();
                        total(convert(JSON.parse(local).price));

                        addCart(JSON.parse(local).img, JSON.parse(local).name, JSON.parse(local).price)
                        cartLists.innerHTML = '';
                        for (let i = 1; i <= count; i++) {
                            if (count !== 0) {
                                noCart.style.display = 'none';
                            }
                            let local = localStorage.getItem(i)
                            if (count !== 0) {
                                addCart(JSON.parse(local).img, JSON.parse(local).name, JSON.parse(local).price)
                            }
                        }
                    }
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }
}


const listItem = ["man", "woman", "kids", "accessories", "esstentital", "prices"];

const dataTrendingTabs = document.querySelectorAll('.trending__tab-list');
const dataNavItem = document.querySelectorAll('.trending__navitem');



dataNavItem.forEach((e, index) => {
    e.onclick = () => {

        if (e.classList.contains('active-color')) {
            return
        }

        dataNavItem.forEach((e) => {
            e.classList.remove('active-color')
        })
        dataTrendingTabs.forEach((e) => {
            e.classList.remove('active')
        })
        dataTrendingTabs[index].classList.add('active')
        e.classList.add('active-color');
    }
    getlength(listItem[index], dataTrendingTabs[index])
})


for (let i = 1; i <= count; i++) {
    if (count !== 0) {
        noCart.style.display = 'none';
    }
    let local = localStorage.getItem(i)
    total(convert(JSON.parse(local).price))
    if (count !== 0) {
        addCart(JSON.parse(local).img, JSON.parse(local).name, JSON.parse(local).price)
    }
}

//    localStorage.clear()


const headerNavbar = document.querySelector('.navbar__Fadein')
const setNavbar = headerNavbar.style
const backTop = document.querySelector('.back__top').style
const mobileNavbar = document.querySelector('.header__middle-mobile-fixed')

setNavbar.position = 'fixed'
setNavbar.top = '0'
setNavbar.zIndex = '10'

const scrollTop = window.scrollY || document.documentElement.scrollTop
if (scrollTop > 225) {
    backTop.display = 'block'
    setNavbar.display = 'block'
    mobileNavbar.style.display = 'block'
    document.querySelector('.hidden-category').style.visibility = 'hidden'
}
else {
    backTop.display = 'none'
    setNavbar.display = 'none'
    mobileNavbar.style.display = 'none'
    document.querySelector('.hidden-category').style.visibility = 'visible'
}

document.onscroll = (e) => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    if (scrollTop > 225) {
        backTop.display = 'block'
        setNavbar.display = 'block'
        mobileNavbar.style.display = 'block'
        document.querySelector('.hidden-category').style.visibility = 'hidden'
    }
    else {
        backTop.display = 'none'
        setNavbar.display = 'none'
        mobileNavbar.style.display = 'none'
        document.querySelector('.hidden-category').style.visibility = 'visible'
    }
}

// mobile search 
const mobileSearch = document.querySelector('.mobile__menu-search-icon')
const mobileInput = document.querySelector('.input__search')

mobileSearch.onclick = () => {
    if (mobileInput.style.display === 'block') {
        mobileInput.style.display = 'none'
    }
    else {
        mobileInput.style.display = 'block'
    }
}




