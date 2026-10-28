/* ---------- Mobile menu ---------- */
const nav = document.querySelector("nav");
const menuBtn = document.querySelector(".menu-btn");
const closeBtn = document.querySelector(".close-btn");
const navLinks = document.querySelectorAll("nav ul li a");

menuBtn.addEventListener("click", () => nav.classList.add("active"));
closeBtn.addEventListener("click", () => nav.classList.remove("active"));
navLinks.forEach(link => link.addEventListener("click", () => nav.classList.remove("active")));

/* ---------- Sticky navbar, back to top, active link, parallax ---------- */
const header = document.getElementById("header");
const toTop = document.getElementById("toTop");
const heroContent = document.querySelector("#showcase .content");
const sections = document.querySelectorAll("section[id], main, div#reservation");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("sticky", y > 80);
    toTop.classList.toggle("show", y > 600);

    // Hero text drifts slower than the page
    if (!reduceMotion && y < window.innerHeight) {
        heroContent.style.transform = "translateY(" + y * 0.25 + "px)";
    }

    // Highlight the link of the section in view
    let current = "home";
    sections.forEach(sec => {
        const id = sec.id === "showcase" ? "home" : sec.id;
        if (y >= sec.offsetTop - 160) current = id;
    });
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Swiper ---------- */
new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: { delay: 3500, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", clickable: true },
    breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        968: { slidesPerView: 3 }
    }
});

/* ---------- Menu data and filtering ---------- */
const menu = [
    { id: 1,  title: "BEEF SAUSAGE WITH NSHIMA",     category: "Dinner", price: 31, img: "./images/MENU/BEEF SAUSAGE WITH NSHIMA.png" },
    { id: 2,  title: "CHICKEN AND BEANS WITH NSHIMA", category: "Lunch",  price: 41, img: "./images/MENU/CHICKEN WITH NSHIMA.png" },
    { id: 3,  title: "FRIED FISH WITH NSHIMA",        category: "Lunch",  price: 27, img: "./images/MENU/FRIED FISH WITH NSHIMA.png" },
    { id: 4,  title: "OFFALS WITH NSHIMA",            category: "Dinner", price: 33, img: "./images/MENU/Nshima with Offal.png" },
    { id: 5,  title: "TROTTERS WITH NSHIMA",          category: "Dinner", price: 37, img: "./images/MENU/Trotter  with Nshima.png" },
    { id: 6,  title: "BEEF STEW WITH NSHIMA",         category: "Lunch",  price: 29, img: "./images/MENU/BEEF STEW WITH NSHIMA.jfif" },
    { id: 7,  title: "CHICKEN WITH NSHIMA",           category: "Lunch",  price: 35, img: "./images/MENU/CHICKEN WITH NSHIMA.jfif" },
    { id: 8,  title: "FISH CURRY WITH NSHIMA",        category: "Dinner", price: 41, img: "./images/MENU/FISH CURRY WITH NSHIMA.jfif" },
    { id: 9,  title: "KAPENTA WITH NSHIMA",           category: "Lunch",  price: 18, img: "./images/MENU/KAPENTA WITH NSHIMA.jfif" },
    { id: 10, title: "NSHIMA WITH TBONE",             category: "Dinner", price: 31, img: "./images/MENU/NSHIMA WITH TBONE.jfif" },
    { id: 11, title: "ROASTED CHICKEN WITH NSHIMA",   category: "Dinner", price: 31, img: "./images/MENU/ROASTED CHICKEN.jfif" }
    // Add drinks like this: { id: 12, title: "FRESH JUICE", category: "Drinks", price: 10, img: "./images/MENU/juice.jpg" }
];

const sectionCenter = document.getElementById("menuContainer");
const filterBtns = document.querySelectorAll(".btn-cat");

function displayMenuItems(items) {
    if (!items.length) {
        sectionCenter.innerHTML = '<p class="empty_msg">Nothing in this category yet. Check back soon.</p>';
        return;
    }
    sectionCenter.innerHTML = items.map(item => `
        <div class="img_cards">
            <img src="${item.img}" alt="${item.title.toLowerCase()}" loading="lazy">
            <p>${item.title}</p>
            <p class="price">only K${item.price}</p>
        </div>`).join("");
}

filterBtns.forEach(btn => {
    btn.addEventListener("click", e => {
        const category = e.currentTarget.dataset.id;
        filterBtns.forEach(b => b.classList.remove("active_btn"));
        e.currentTarget.classList.add("active_btn");
        displayMenuItems(category === "all" ? menu : menu.filter(item => item.category === category));
    });
});

window.addEventListener("DOMContentLoaded", () => displayMenuItems(menu));

/* ---------- Scroll reveal ---------- */
const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ---------- Animated counters ---------- */
const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.target;
        const start = performance.now();
        const duration = 1800;
        (function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            el.textContent = Math.floor(p * target);
            if (p < 1) requestAnimationFrame(tick);
        })(start);
        obs.unobserve(el);
    });
}, { threshold: 0.5 });
document.querySelectorAll(".num").forEach(el => counterObserver.observe(el));

/* ---------- Reservation form ---------- */
const form = document.getElementById("reservationForm");
const formMsg = document.getElementById("formMsg");
const dateInput = document.getElementById("bookDate");
dateInput.min = new Date().toISOString().split("T")[0];

form.addEventListener("submit", e => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get("name").trim();
    const phone = data.get("phone").trim();
    const email = data.get("email").trim();

    if (!name || !phone || !data.get("people") || !data.get("date") || !data.get("time")) {
        formMsg.style.color = "#ffd1d1";
        formMsg.textContent = "Please fill in your name, phone, number of people, date and time.";
        return;
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
        formMsg.style.color = "#ffd1d1";
        formMsg.textContent = "Please enter a valid email address.";
        return;
    }
    formMsg.style.color = "#c8ffd0";
    formMsg.textContent = "Thank you " + name + "! Your table request has been received. We will contact you shortly.";
    form.reset();
    // To receive bookings, connect this form to a backend, Formspree or WhatsApp link.
});

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();