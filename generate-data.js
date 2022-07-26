const faker = require("faker");
const fs = require("fs");

//Set locate to use Vietnamese
faker.locale = "vi";

// Random data
console.log(faker.commerce.department());
console.log(faker.commerce.productName());
console.log(faker.commerce.productDescription());

console.log(faker.random.uuid());
console.log(faker.image.imageUrl());

const randomCategoryList = (n) => {
  if (n <= 0) return [];
  const categoryList = [];
  //Loop and push category
  Array.from(new Array(n)).forEach(() => {
    const category = {
      id: faker.random.uuid(),
      name: faker.commerce.department(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    categoryList.push(category);
  });
  return categoryList;
};

const randomProductList = (categoryList, numberOfProducts) => {
  if (numberOfProducts <= 0) return [];
  const productList = [];
  //random data
  for (const category of categoryList) {
    Array.from(new Array(numberOfProducts)).forEach(() => {
      const product = {
        id: faker.random.uuid(),
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        quantitySell: faker.random.number(1000),
        description: faker.commerce.productDescription(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        thumbnailUrl: faker.image.imageUrl(183, 183),
        images: [],
        categoryId: category.id,
      };
      productList.push(product);
    });
  }

  return productList;
};

// IFFE
(() => {
  // Random data
  const categoryList = randomCategoryList(13);
  const productList = randomProductList(categoryList, 10);
  // prepare db object
  const db = {
    categories: categoryList,
    products: productList,
  };
  // write db object to db.json file
  fs.writeFileSync("db.json", JSON.stringify(db), () => {
    console.log("Generate data successfully");
  });
})();
