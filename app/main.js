var eventBus = new Vue();

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

Vue.component('product-review', {
	template: `<form class="review-form" @submit.prevent="onSubmit">

		<p v-if="errors.length">
		Please correct the following errors:
		<ul>
			<li v-for="error in errors">{{error}}</li>
		</ul>
		</p>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>`,
	data() {
		return {
			name: null,
			review: null,
			rating: 1,
			errors: []
		}
	},
	methods: {
		onSubmit() {
			let errors = []
			if (!this.name || !this.review || !this.rating) {
				if (!this.name) errors.push("Name required.")
				if (!this.review) errors.push("Review required.")
				if (!this.rating) errors.push("Rating required.")
				this.errors = errors
				return
			}
			let productReview = {
				name: this.name,
				review: this.review,
				rating: this.rating
			}
			eventBus.$emit('review-submitted', productReview)
			this.name = null
			this.review = null
			this.rating = 1
			this.errors = []
		}		
	}
});

Vue.component('product-tabs', {
	props: {
		reviews: {
			type: Array,
			required: true
		}
	},
	template: `
		<div>
			<span class="tab" 
				v-for="(tab, index) in tabs" 
				:key="index" 
				@click="selectedTab = tab"
				:class="{activeTab: selectedTab === tab}">
				{{tab}}
			</span>		

			<div v-show="selectedTab === 'Reviews'">
			<h2>Reviews</h2>
			<p v-show="reviews.length === 0">There are no reviews yet.</p>
			<ul>
			<li v-for="review in reviews">
				<p>{{review.name}}</p>
				<p>Rating: {{review.rating}}</p>
				<p>{{review.review}}</p>
			</li>
			</ul>
			</div>

			<product-review v-show="selectedTab === 'Make a review'"></product-review>	

		</div>
	`,
	data() {
		return {
			tabs: ['Reviews', 'Make a review'],
			selectedTab: 'Reviews'
		}
	}
})

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

		<product-tabs :reviews="reviews"></product-tabs>		

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
			sizes: [42, 43, 44, 45],
			reviews: []			
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
		},
		addReview(review) {
			this.reviews.push(review)
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
	},
	mounted() {
		eventBus.$on('review-submitted', review => {
			this.addReview(review)
		}) 
		console.log("added")
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

