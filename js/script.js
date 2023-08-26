"use strict"



// ФУНКЦІОНАЛ TABS:




// створюю масив для впорядкованого зберігання обʼєктів "назва-елемент", назва береться з коментаря, що безпосередньо передує LI-ноді:
let tableOfContents = [];

// тут буде проміжний масив без зайвих (текстових) нод:
let nodesArray = [];

// витягую зі сторінки лише функціонально значимі ноди (type 1 та 8):
const tabsContent = document.querySelector(".tabs-content");

for (let i = 0; i < tabsContent.childNodes.length; i++) {
	if (tabsContent.childNodes[i].nodeType === 1 || tabsContent.childNodes[i].nodeType === 8) {
		nodesArray.push(tabsContent.childNodes[i]);
		// принагідно ховаю всі LI-ноди
		if (tabsContent.childNodes[i].nodeType === 1) {
			tabsContent.childNodes[i].style.display = "none";
		};
	};
};

// створюю список "презентабельних" нод (це ті, перед якими є коментар-нода)
for (let i = 0; i < nodesArray.length; i++) {
	// лише якщо перед LI-нодою є коментар-нода:
	if (nodesArray[i].nodeType === 1 && nodesArray[i - 1].nodeType === 8) {
		// тоді додаю до масиву обʼєкт {текст_коментаря : LI-нода}
		tableOfContents.push({ [nodesArray[i - 1].textContent.trim()]: nodesArray[i] });
	}
};

// Очищую статичну навігацію:
const navContainer = document.querySelector("#tabs");
navContainer.innerHTML = "";

// Створюю нову навігацію. 
// Текст для пункту навігації беру з першого ключа обʼєкту.
// Для першого пункту навігації ще додаю тернарним оператором клас "active" за допомогою другого аргумента колбек-функції (index).
// Також, index використовую для призначення значення дата-атрибуту кожному пункту навігації.
tableOfContents.forEach((el, index) => {
	navContainer.insertAdjacentHTML("beforeend", `<li data-order="${index}" class="tabs-title${index === 0 ? " active" : ""}">${Object.keys(el)[0]}</li>`);

});

// вішаю на батька елементів навігації слідкування за кліком, при цьому event.target видає мені конкретний елемент, по якому був клік
navContainer.addEventListener("click", event => {
	[...navContainer.children].forEach(el => el.classList.remove("active"));
	event.target.classList.add("active");
	// перетворюю на number значення, яке отримав з data-атрибута, інакше не працюватиме:
	showLi(+event.target.dataset.order);
});

// нарешті, викликаю функцію showLi без атрибутів, щоб відобразити перший таб відвідувачам сайта.
showLi();

// Функція покаже презентабельну LI-ноду, порядковий номер якої задано аргументом. За замовчуванням, покаже першу LI-ноду.
function showLi(index = 0) {
	tableOfContents.forEach((el, i) => {
		if (index === i) {
			Object.values(el)[0].style.display = "flex";
		} else {
			Object.values(el)[0].style.display = "none";
		};
	});
};






// ФУНКЦІОНАЛ ФІЛЬТРАЦІЇ ЕЛЕМЕНТІВ OUR AMAZING WORK:




let filtersContainer = document.querySelector("#filters");
let amazingWorks = document.querySelector("#filters");

// перефарбовую обирачку тегів та викликаю фільтрацію елементів галереї робіт:
filtersContainer.addEventListener("click", event => {
	[...filtersContainer.children].forEach(el => el.classList.remove("active"));
	event.target.classList.add("active");
	filterLi(document.querySelector("#ourwork"), event.target.innerText.trim());
});


// заповнюю галерею робіт ще одиннадцятьма картинками:
fillGallery("img/graphic-design/graphic-design", ".jpg", 12, true);



// вішаю слухач на кнопку LOAD MORE WORKS:

const loadMoreWorksButton = document.querySelector(".work .button-plus");

const loadMoreWorks = loadMoreWorksButton.addEventListener("click", () => {
	// якщо картинок менше, ніж 36, додаю і знов рахую:
	if (document.querySelectorAll("#ourwork li").length < 36) {
		fillGallery(`https://picsum.photos/300/211?random=`, "", 12);
		// якщо картинок стало 36+, видаляю кнопку на цьому ж кліку:
		if (document.querySelectorAll("#ourwork li").length >= 36) {
			loadMoreWorksButton.remove();
		};
	};
	// викликаю фільтрацію, щоб показати нові завантажені картинки з поточним обраним тегом:
	filterLi(document.querySelector("#ourwork"));
});

fillNews("img/news/image-", ".png", 8);



// Функціонал каруселі What People Say:


const scrollLeft = document.querySelector(".scroller-left");
const scrollRight = document.querySelector(".scroller-right");
const carouselNav = document.querySelector("#carousel");
const carouselItems = document.querySelectorAll("#carousel-content > li");




// слухач на управління каруселлю:

const carouselListener = carouselNav.addEventListener("click", event => {
	// забороняю спрацьовувати, якщо миша влучила по UL (юзер промахнувся по портрету)
	if (event.target !== event.currentTarget) {

		[...carouselNav.children].forEach((el, i) => {
			// знімаю .active з портретів:
			el.classList.remove("active");
			// вимикаю попередній контент
			carouselItems[i].classList.remove("active");

			// додаю .active клікнутому портрету та вмикаю новий контент
			if (el === event.target.closest("#carousel > li")) {
				console.log(i);
				el.classList.add("active");
				carouselItems[i].classList.add("active");
			};
		});
	};
});




// слухач на лівий скрол каруселі:

const goLeft = document.querySelector(".scroller-left").addEventListener("click", () => {
	let prev;
	[...carouselNav.children].forEach((el, i) => {

		if (el.classList.contains("active")) {
			prev = (i + carouselItems.length - 1) % carouselItems.length;
		};
		// знімаю .active з усіх портретів:
		el.classList.remove("active");
		// вимикаю весь контент
		carouselItems[i].classList.remove("active");
	});
	// додаю .active портрету ліворуч від активного та вмикаю відповідний контент	
	document.querySelectorAll("#carousel > li")[prev].classList.add("active");
	carouselItems[prev].classList.add("active");
});






// слухач на правий скрол каруселі:




const goRight = document.querySelector(".scroller-right").addEventListener("click", () => {
	let next;
	[...carouselNav.children].forEach((el, i) => {

		if (el.classList.contains("active")) {
			next = (i + 1) % carouselItems.length;
		};
		// знімаю .active з усіх портретів:
		el.classList.remove("active");
		// вимикаю весь контент
		carouselItems[i].classList.remove("active");
	});
	// додаю .active портрету ліворуч від активного та вмикаю відповідний контент	
	document.querySelectorAll("#carousel > li")[next].classList.add("active");
	carouselItems[next].classList.add("active");
});






// слухач на пошук:




document.querySelector("#search-icon").addEventListener("click", () => {
	if (document.querySelector("input#search").classList.contains("active")) {
		if (document.querySelector("input#search").value !== "") {
			window.open(`https://www.google.com/search?q=${document.querySelector("input#search").value}`);
		} else {
			document.querySelector("input#search").classList.remove("active");
			document.querySelector("input#search").blur();
		};
	} else {
		document.querySelector("input#search").classList.add("active");
		document.querySelector("input#search").focus();
	};
});





// Функціонал GALLERY OF BEST IMAGES — MASONRY:
const picWidths = [390, 150, 75]; // три варіанти розміру картинок (тягну їх з сайта Lorem Picsum).
const numOfPics = [1, 2, 4]; // скільки картинок кожного розміру довантажувати (великих поменше, малих побільше).
const maxBricks = 48; // ліміт картинок в секції Masonry.

const masonryOptions = {
	columnWidth: 60,
	itemSelector: '.grid-item',
	gutter: 20,
	horizontalOrder: false,
}

loadMoreBricks(0);
// видаляю зразкову картинку, щоб не зʼїжджали рядки картинок:
document.querySelector(".grid-item:first-child").remove();
loadMoreBricks(1);
loadMoreBricks(2);

// вішаю слухач на кнопку LOAD MORE WORKS:

const loadMoreMasonryButton = document.querySelector(".gallery .button-plus");

const loadMoreMasonry = loadMoreMasonryButton.addEventListener("click", () => {
	loadMoreBricks();
});
















// FUNCTIONS DEFINITION:




// функція, яка додає до галереї РОБІТ (не Masonry!) вказану кількість робіт:
// функція розраховує на наявність цифри в назві файла картинки (початок з "1")!
// останній аргумент визначає, чи видаляти оригінал при клонуванні.

function fillGallery(filenameStart, filenameEnd = "", numTiles = 1, toRemoveModel = false) {
	const parentEl = document.querySelector("#ourwork");
	// беру всі теги зі сторінки:
	let tagsList = [];
	[...document.querySelector("#filters").children].forEach(el => {
		let text = el.innerText.trim();
		if (text.toLowerCase() !== "all") {
			tagsList.push(text);
		};
	});

	// беру перший елемент, який буду клонувати:
	const model = parentEl.querySelector("li");

	// клоную з заміною цифри в назві файлу картинки,
	// додаю клонові рандомно теги,
	// додаю клон в кінець батьківського елемента:
	for (let i = 1; i <= numTiles; i++) {
		let clone = model.cloneNode(true);
		if (toRemoveModel) {
			model.remove();
		}

		clone.querySelector("img").src = `${filenameStart}${i}${filenameEnd}`;

		clone.querySelector(".taglist").innerText = tagsList[randBetween(tagsList.length - 1)];

		// вмикаю показ прелоадера перед додаванням на сторінку:
		clone.querySelector(".preloader").style.display = "block";

		// задаю приховування прелоадера для новоствореного елемента галереї:
		let cloneTimeout = setTimeout(() => {
			clone.querySelector(".preloader").style.display = "none";
			clearTimeout(cloneTimeout);
			// перші картинки "довантажаться" раніше, ніж наступні, але з невеличким рандомом:
		}, (i + randBetween(0, 5)) * 100);
		parentEl.append(clone);
	};
};









// функція, яка додає до галереї Masonry вказану кількість елементів.
// функція розраховує на наявність цифри в назві файла картинки (початок з "1")!
// останній аргумент визначає, чи видаляти оригінал при клонуванні.

function fillMasonry(filenameStart, filenameEnd = "", numTiles = 1, toRemoveModel = true) {
	let clones = [];
	const parentEl = document.querySelector(".grid");

	// беру перший елемент, який буду клонувати:
	const model = parentEl.querySelector(".grid-item");

	// клоную з заміною цифри в назві файлу картинки,
	// додаю клонові рандомно теги,
	// додаю клон в кінець батьківського елемента:
	for (let i = 1; i <= numTiles; i++) {
		let clone = model.cloneNode(true);
		if (toRemoveModel) {
			model.remove();
		} else {
			model.querySelector(".grid-item .preloader").style.display = "none";
		}
		// задаю унікальний url картинки:
		clone.querySelector("img").src = `${filenameStart}${i}${filenameEnd}`;

		// вмикаю показ прелоадера перед додаванням на сторінку:
		clone.querySelector(".grid-item .preloader").style.display = "block";

		// задаю приховування прелоадера для новоствореного елемента галереї:
		let cloneTimeout = setTimeout(() => {
			clone.querySelector(".grid-item .preloader").style.display = "none";
			clearTimeout(cloneTimeout);
			// перші картинки "довантажаться" раніше, ніж наступні, але з невеличким рандомом:
		}, (i + randBetween(0, 5)) * 100);
		parentEl.append(clone);
		clones.push(clone);
	};
	return clones;
};







function loadMoreBricks(rand){
	let newBricks = [];
	document.querySelector(".grid").style.opacity = "0.2";
	// якщо картинок менше, ніж 36, додаю і знов рахую:
	if (document.querySelectorAll(".grid-item").length < maxBricks) {
		// додаю ще картинок, задаю розміри картинок рандомно з трьох варіантів, враховуючи ширину гріда Месонрі, при цьому якщо картинка мала, то додаю три штуки такого розміру, якщо середня — то дві, якщо велика - одну:
		
		
		if(rand === undefined) {
			rand = randBetween(picWidths.length - 1);
		}
		// рандомно обираю один з трьох розмірів картинок:
		let w = picWidths[rand];
		let h = Math.floor(w * 0.68);

		newBricks = fillMasonry(`https://picsum.photos/${w}/${h}?random=${randBetween(1000)}`, "", numOfPics[rand] * 2, false);
		// якщо картинок стало 36+, видаляю кнопку на цьому ж кліку:
		if (document.querySelectorAll(".grid-item").length >= maxBricks) {
			loadMoreMasonryButton.remove();
		};
		let loadedCount = 0;
		for (let brick of newBricks) {
			brick.querySelector("img").onload = () => {
				loadedCount++;
				
				console.log(`loadedCount ${loadedCount}/${newBricks.length}`);
				
				if(loadedCount === newBricks.length) {
					console.log(`HOORAY!`);
					const grid = document.querySelector(".grid");
					const masonry = new Masonry(grid, masonryOptions);
					document.querySelector(".grid").style.opacity = "1";
				};
			};
		};
		



	};

}






// функція, яка додає вказану кількість _НОВИН_ до розділу Breaking News:
// функція розраховує на наявність цифри в назві файла картинки!

function fillNews(filenameStart, filenameEnd = "", numTiles = 1) {
	const parentEl = document.querySelector(".news #news-parent");

	// автори та заголовки новин (в кожному бажано не менше елементів, ніж новин на сайті):
	const authors = ["Benedict", "Amy", "editor"];
	const headlines1 = ["dangerous", "disturbing", "angry", "dead", "lost", "runaway", "scandalous", "crazy", "another"];
	const headlines2 = ["dog", "politician", "protester", "terrorist", "businessman", "kitty", "driver", "prostitute"];
	const headlines3 = ["rescue", "arrest", "murder", "fact", "update", "attack", "fraud", "scam", "protest"];


	// беру перший елемент, який буду клонувати (в новинах це <a>):
	const model = parentEl.querySelector("a");

	// створюю дату для заповнення новин:
	let d = new Date();
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	// роблю копії текстових масивів, щоб видаляти з них використані елементи задля максимального розмаїття слів у заголовках:
	let h1 = headlines1.slice();
	let h2 = headlines2.slice();
	let h3 = headlines3.slice();


	// клоную з заміною цифри в назві файлу картинки,
	// додаю клонові рандомно назву, автора, дату,
	// додаю клон в кінець батьківського елемента:
	for (let i = 1; i <= numTiles; i++) {
		let clone = model.cloneNode(true);
		// видаляю оригінал, бо його дата, автор та кількість коментів не апдейтяться:
		model.remove();

		// визначаю урл картинки новини:
		clone.querySelector("img").src = `${filenameStart}${i}${filenameEnd}`;

		// роблю дату новини:
		d.setDate(d.getDate() - randBetween(7));
		clone.querySelector(".date").innerHTML = `${d.getDate()}<br>${months[d.getMonth()]}`;

		// роблю автора та кількість коментів новини:
		let commentsCount = randBetween(99);
		clone.querySelector(".details").innerText = `by ${authors[randBetween(authors.length - 1)]} | ${commentsCount} comment${commentsCount === 1 ? "" : "s"}`;


		// роблю заголовок новини:
		clone.querySelector(".title").innerText = capitalize(
			h1.splice([randBetween(h1.length - 1)], 1) + " " +
			h2.splice([randBetween(h2.length - 1)], 1) + " " +
			h3.splice([randBetween(h3.length - 1)], 1)
		);

		parentEl.append(clone);
	};
};







// функція, яка фільтрує список робіт:

function filterLi(parentEl, tag = undefined) {
	// визначаю, який tag зараз є активним, щоб ця функція коректно працювала не лише викликана зі слухача кліку (де я знаю event target), а й будь-звідки:
	if (tag === undefined) {
		[...document.querySelector("#filters").children].forEach(el => {
			if (el.classList.contains("active")) {
				tag = el.innerText;
			}
		});
	};
	// фільтрую елементи:
	if (tag === "All") {
		[...parentEl.children].forEach(el => {
			el.style.display = "block";
		});
	} else {
		[...parentEl.children].forEach(el => {
			if (el.querySelector(".taglist").innerText === tag) {
				el.style.display = "block";
			} else {
				el.style.display = "none";
			};

		});
	}
};









// функція видачі рандомного числа МІЖ двома числами включно, друге число не обовʼязкове:

function randBetween(a, b = 0) {
	const from = Math.min(a, b);
	const to = Math.max(a, b);
	return Math.ceil(Math.random() * (to - from + 1) + from - 1);
}


// функція перетворює першу літеру кожного слова рядка на велику:

function capitalize(string) {
	let words = string.split(" ");
	let result = [];
	words.forEach(word => {
		result.push(word.charAt(0).toUpperCase() + word.slice(1));
	});
	return result.join(" ");
}
