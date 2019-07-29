var app = new Vue({
	el: '#app',
	data: {
		brand: 'Vue-Zue',
		product: 'Socks',
		description: 'Socks are warm',
		selectedVariant: 0,		
		link: 'http://ssd.sscc.ru',		
		onSale: true,
		details: ['80% cotton', '20% polyester', 'Male'],
		variants: [
			{	
				variantId: 1,
				variantColor: 'green',
				variantImage: './images/vmSocks-green-onWhite.jpg',
				variantQuantity: 10
			},
			{
				variantId: 2,
				variantColor: 'blue',
				variantImage: './images/vmSocks-blue-onWhite.jpg',
				variantQuantity: 0
			}
		],
		sizes: [42, 43, 44, 45],
		cart: 0		
	},
	methods: {
		addToCart: function() {
			this.cart += 1
		},
		removeFromCart: function() {
			this.cart = Math.max(0, this.cart - 1)
		},
		updateProduct: function(index) {
			this.selectedVariant = index	
		},
		isInStock: function() {
			return this.inventory > 0
		},
		isOutOfStock: function() {
			return !this.isInStock();
		}
	},
	computed: {
		title() {
			return this.brand + ' ' + this.product
		},
		image() {
			return this.variants[this.selectedVariant].variantImage
		},
		inStock() {
			return this.variants[this.selectedVariant].variantQuantity > 0
		},
		inventory() {
			return this.variants[this.selectedVariant].variantQuantity
		}
	}
});
