import Basket from "../../utils/basket";

describe("basket", () => {
  it("adds product to basket", () => {
    const b = new Basket();

    expect(b.products()).toHaveLength(0);

    b.add({ name: "Produkt 1" });

    expect(b.products()).toHaveLength(1);
  });

  it("removes products from basket", () => {
    const b = new Basket();

    expect(b.products()).toHaveLength(0);

    b.add({ name: "Produkt 1" });

    expect(b.products()).toHaveLength(1);

    expect(b.hasProduct({ name: "Produkt 1" })).toBeTruthy();

    b.remove({ name: "Produkt 1" });

    expect(b.products()).toHaveLength(0);
  });
});