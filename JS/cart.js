const productsBtn = document.querySelectorAll('.product__btn');
const cartProductsList = document.querySelector('.cart-content__list');
const cart = document.querySelector('.header__cart');
const cartQuantity = cart.querySelector('.card__quantity');
const fullPrice = document.querySelector('.fullprice');
const orderModalOpenProd = document.querySelector('.order-modal__btn');
const orderMoadlList = document.querySelector('.order-modal__list');
let price = 0;

const randomId = () => {
	return Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15);
};

const priceWithoutSpaces = (str) => {
	return str.replace(/\s/g,'');
};

const normalPrice = (str) => {
	return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g,'$1 ');
};

const plusFullPrice = (currentPrice) => {
	return price += currentPrice;
};

const minusFullPrice = (currentPrice) => {
	return price -= currentPrice;
};

const printQuantity = () => {
	let length = cartProductsList.querySelector('.simplebar-content').children.length;
	cartQuantity.textContent = length;
	length > 0 ? cart.classList.add('active') : cart.classList.remove('active');
};

const printFullPrice = () => {
	fullPrice.textContent = `${normalPrice(price)} ₽`;
};


const generateCartProduct = (img,title,author,price,id) => {
	return `
			<li li class="cart-content__item" >
				<article class="cart-content__product cart-product" data-id="${id}">
						<img src="${img}" alt="" class="cart-product__img">
					<div class ="cart-product__text">
						<a href="#" class ="cart-product__title">${title}</a>
						<h3 class ="cart-product__author">${author}</h3>
						<span class ="cart-product__price">${normalPrice(price)}</span>
					</div>
					<button class ="cart-product__delete" aria-label="Удалить товар"></button>
				</article>
			</li >
	`;
};



const deleteProducts = (productParent) => {
	let id = productParent.querySelector('.cart-product').dataset.id;
	document.querySelector(`.product[data-id="${id}"]`).querySelector('.product__btn').disabled = false;

	let currentPrice = parseInt(priceWithoutSpaces(productParent.querySelector('.cart-product__price').textContent));
	minusFullPrice(currentPrice);
	printFullPrice();
	productParent.remove();

	printQuantity();
};


productsBtn.forEach(el => {
	el.closest('.product').setAttribute('data-id',randomId());
	el.addEventListener('click',(e) => {
		let self = e.currentTarget;
		let parent = self.closest('.product');
		let id = parent.dataset.id;
		let img = parent.querySelector('.image-sex img').getAttribute('src');
		let title = parent.querySelector('.product__name').textContent;
		let author = parent.querySelector('.product__author').textContent;
		let priceString = parent.querySelector('.product__price').textContent;
		let priceNumber = parseInt(priceWithoutSpaces(parent.querySelector('.product__price').textContent));

		plusFullPrice(priceNumber);
		printFullPrice();
		cartProductsList.querySelector('.simplebar-content').insertAdjacentHTML('afterbegin',generateCartProduct(img,title,author,priceString,id));
		printQuantity();
		self.disabled = true;
	});
});

cartProductsList.addEventListener('click',(e) => {
	if (e.target.classList.contains('cart-product__delete')) {
		deleteProducts(e.target.closest('.cart-content__item'));
	}
});

let flag = 0;
orderModalOpenProd.addEventListener('click',(e) => {
	if (flag == 0) {
		orderModalOpenProd.classList.add('open');
		orderMoadlList.style.display = 'block';
		flag = 1;
	} else {
		orderModalOpenProd.classList.remove('open');
		orderMoadlList.style.display = 'none';
		flag = 0;
	}
});



const generateModalProduct = (img,title,author,price,id) => {
	return `
		<li class="order-modal__item">
		<article class="order-modal__product order-product" data-id="${id}">
			<img src="${img}" alt="" class="order-product__img">
			<div class="order-product__text">
				<h3 class="modal-product__title">${title}</h3>
				<h3 class="modal-product__author">${author}</h3>
				<span class="order-product__price">${price}</span>
			</div>
			<button class="order-product__delete">Удалить</button>
		</article>
	</li>
	`;
};



const modal = new GraphModal({
	isOpen: (modal) => {
		console.log('opened');
		orderMoadlList.innerHTML = '';
		let array = cartProductsList.querySelector('.simplebar-content').children;
		let fullprice = fullPrice.textContent;
		let length = array.length;

		document.querySelector('.order-modal__quantity span').textContent = `${length} шт`;
		document.querySelector('.order-modal__summ span').textContent = `${fullprice}`;

		for (item of array) {
			console.log(item)
			let id = item.querySelector('.cart-product').dataset.id;
			let img = item.querySelector('.cart-product__img').getAttribute('src');
			let title = item.querySelector('.cart-product__title').textContent;
			let author = item.querySelector('.cart-product__author').textContent;
			let price = item.querySelector('.cart-product__price').textContent;
			orderMoadlList.insertAdjacentHTML('afterbegin',generateModalProduct(img,title,author,price,id));
		}
	},
	isClose: () => {
		console.log('closed');
	}
});