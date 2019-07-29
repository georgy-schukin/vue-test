var app = new Vue({
	el: '#app',
	data: {
		product: 'Socks',
		description: 'Socks are warm',
		image: './images/vmSocks-green-onWhite.jpg',
		link: 'http://ssd.sscc.ru',
		inventory: 100,
		onSale: true,
		details: ['80% cotton', '20% polyester', 'Male'],
		variants: [
			{	
				variantId: 1,
				variantColor: 'green'
			},
			{
				variantId: 2,
				variantColor: 'blue'
			}
		],
		sizes: [42, 43, 44, 45]		
	}
});
