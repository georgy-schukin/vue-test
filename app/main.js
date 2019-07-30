Vue.component('product-details', {
	props: {
		details: {
			type: Array,
			default: []
		}
	},
	template: `<ul>
				<li v-for="detail in details">{{detail}}</li>
				</ul>`
});

Vue.component('product', {
	props: {
		premium: {
			type: Boolean,
			required: true
		}
	},
	template: `<div class="product">
		<div class="product-image">
			<a :href="link"><img :src="image"></a>
		</div>
		<div class="product-info">
			<h1>{{ title }}</h1>
			<h2>{{ description }}</h2>	

			<p v-if="inventory > 10">In stock</p>
			<p v-else-if="inventory <= 10 && inventory > 0">Almost sold out</p>
			<p v-else :class="{outOfStock: !inStock}">Out of stock</p>
			<p v-show="onSale">On sale!!!</p>
			<p>Shipping: {{shipping}}</p>
			<product-details :details="details"></product-details>			

			<div v-for="(variant, index) in variants" 
				:key="variant.variantId"
				class="color-box"
				:style="{backgroundColor: variant.variantColor}"
				@mouseover="updateProduct(index)">				
			</div>
			<p>				
			Sizes:
			<ul>
				<li v-for="size in sizes">{{size}}</li>
			</ul>
			</p>
			<button v-on:click="addToCart" 
				:disabled="!inStock" 
				:class="{disabledButton: !inStock}">Add to cart</button>
			<button v-on:click="removeFromCart">Remove from cart</button>			
		</div>		
		</div>`,
	data() {
		return {
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
					variantQuantity: 2
				}
			],
			sizes: [42, 43, 44, 45]			
		}
	},
	methods: {
		addToCart: function() {
			this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
		},
		removeFromCart: function() {
			this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
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
		},
		shipping() {
			return this.premium ? 'Free' : 2.99
		}
	}
});

var app = new Vue({
	el: '#app',
	data: {
		premium: true,
		cart: []
	},
	methods: {
		addToCart: function(id) {
			this.cart.push(id)
		},
		removeFromCart: function(id) {
			var index = this.cart.indexOf(id)
			if (index !== -1) {
				this.cart.splice(index, 1)
			}
		}
	}
});
