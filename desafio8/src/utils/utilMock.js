const {faker} = require("@faker-js/faker");

const productGenerate = (code) => {
    return{
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: code,
        price: faker.commerce.price(),
        status: true,
        stock: parseInt(faker.string.numeric()),
        category: faker.commerce.department(),
        thumbnails: [],
        isMock: true
    }
}

module.exports = {productGenerate};