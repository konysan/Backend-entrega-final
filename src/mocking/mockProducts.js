const { faker } = require('@faker-js/faker');


function generateMockProducts() {
  const mockProducts = [];
  for (let i = 0; i < 50; i++) {
    mockProducts.push({
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      code: faker.datatype.uuid(),
      price: faker.commerce.price(),
      status: 'available',
      stock: faker.datatype.number(),
      category: faker.commerce.department(),
      thumbnails: [faker.image.imageUrl()],
      createdAt: new Date()
    });
  }
  return mockProducts;
}

module.exports = { generateMockProducts };
