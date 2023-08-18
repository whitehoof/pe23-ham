"use strict"

// створюю масив для впорядкованого зберігання обʼєктів "назва-елемент", назва береться з коментаря, що безпосередньо передує LI-ноді:
let tableOfContents = [];

// тут буде проміжний масив без зайвих (текстових) нод:
let nodesArray = [];

// витягую зі сторінки лише функціонально значимі ноди (type 1 та 8):
const tabsContent = document.querySelector(".tabs-content");

for (let i=0; i < tabsContent.childNodes.length; i++) {
	if(tabsContent.childNodes[i].nodeType === 1 || tabsContent.childNodes[i].nodeType === 8) {
		nodesArray.push(tabsContent.childNodes[i]);
		// принагідно ховаю всі LI-ноди
		if(tabsContent.childNodes[i].nodeType === 1){
			tabsContent.childNodes[i].style.display = "none";
		};
	};
};

// створюю список "презентабельних" нод (це ті, перед якими є коментар-нода)
for (let i=0; i < nodesArray.length; i++) {
	// лише якщо перед LI-нодою є коментар-нода:
	if (nodesArray[i].nodeType === 1 && nodesArray[i-1].nodeType === 8) {
		// тоді додаю до масиву обʼєкт {текст_коментаря : LI-нода}
		tableOfContents.push({ [nodesArray[i-1].textContent.trim()] : nodesArray[i] });
	}
};

// Очищую статичну навігацію:
const navContainer = document.querySelector(".tabs");
navContainer.innerHTML="";

// Створюю нову навігацію. 
// Текст для пункту навігації беру з першого ключа обʼєкту.
// Для першого пункту навігації ще додаю тернарним оператором клас "active" за допомогою другого аргумента колбек-функції (index).
// Також, index використовую для призначення значення дата-атрибуту кожному пункту навігації.
tableOfContents.forEach( (el, index) => {
	navContainer.insertAdjacentHTML("beforeend", `<li data-order="${index}" class="tabs-title${index === 0 ? " active" : ""}">${Object.keys(el)[0]}</li>`);

});

// вішаю на батька елементів навігації слідкування за кліком, при цьому event.target видає мені конкретний елемент, по якому був клік
navContainer.addEventListener("click", event => {
	[...navContainer.children].forEach(el => el.classList.remove("active") );
	event.target.classList.add("active");
	// перетворюю на number значення, яке отримав з data-атрибута, інакше не працюватиме:
	showLi(+event.target.dataset.order);
});

// нарешті, викликаю функцію showLi без атрибутів, щоб відобразити перший таб відвідувачам сайта.
showLi();

// Функція покаже презентабельну LI-ноду, порядковий номер якої задано аргументом. За замовчуванням, покаже першу LI-ноду.
function showLi(index=0) {
	tableOfContents.forEach((el,i) => {
		if(index === i){
			Object.values(el)[0].style.display = "flex";
		} else {
			Object.values(el)[0].style.display = "none";
		};
	});
};
