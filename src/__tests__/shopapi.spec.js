import shopApi from "../shopApi";

describe("shopApi", () => {
  const products = {
    productIds: [4],
    quantityById: {
      4: 2
    }
  };

  const address = {
        fullname: "John Doe",
        street: "Al. Wilanowska 5",
        city: "Warszawa",
        country: "PL"
  }

  const delivery = {
    deliveryMethod: "post"
  }

  it("returns list of products", async () => {
    const result = await shopApi.getProducts();

    expect(result.data.products).toBeDefined();
    expect(result.data.products).toBeInstanceOf(Array);
    expect(result.data.products[0]).toEqual(
      expect.objectContaining({
        id: expect.anything(),
        image: expect.anything(),
        price: expect.anything(),
        title: expect.anything()
      })
    );
  });

  it("creates an order", async () => {
    const response = await shopApi.createOrder(products);

    expect(response.data).toMatchObject({
      status: "NEW",
      products,
      orderNumber: expect.any(Number)
    });
  });

  it('updates delivery address', async () => {
    const newOrder = await shopApi.createOrder(products);
    const orderNumber = newOrder.data.orderNumber;
    const changeAddress = await shopApi.changeDeliveryAddress(orderNumber, address);
    
    expect(changeAddress.data).toMatchObject({
        status: "OK"
    });
  });

  it('updates delivery method', async () => {
    const newOrder = await shopApi.createOrder(products);
    const orderNumber = newOrder.data.orderNumber;
    const changeAddress = await shopApi.changeDeliveryMethod(orderNumber, delivery);
    
    expect(changeAddress.data).toMatchObject({
        status: "OK"
    });
  });

  it('should submit order', async () => {
    const newOrder = await shopApi.createOrder(products);
    const orderNumber = newOrder.data.orderNumber;

    const submitOrder = await shopApi.submitOrder(orderNumber);

    expect(submitOrder.data).toMatchObject({
        status: "OK"
    })

    const order = await shopApi.getOrder(orderNumber);
    expect(order.data.status).toBe("SUBMITTED");
  });
});