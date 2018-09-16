import nock from "nock";
import paymentsApi from "../paymentsApi";

describe("paymentsApi", () => {
  const card = {
    "number": "4111111111111111",
    "securityCode": "950",
    "expMonth": "07",
    "expYear": "21",
    "owner": "John Doe"
  };
  const token = "123ABC";
  const amount = 950;
  const transactionId = 'TX123';

  it("authorizes the client", async () => {
    nock('http://payments.local')
    .post('/auth/token', {username: 'test', password: 'test'})
    .reply(200, {
      token: '123TOKEN'
     });

    const token = await paymentsApi.authorizeClient("test", "test");
    expect(token).toBe('123TOKEN');
  });

  it("throws an error when credentials are wrong", () => {
    nock('http://payments.local')
      .post('/auth/token', {username: 'test', password: 'test'})
      .reply(401);

      let anon = async () =>  {
        return await paymentsApi.authorizeClient("test", "test")  
      }
      
      expect(anon()).rejects.toEqual(new Error('Unauthorized'))
  });

  it("processes card payment", async () => {
    nock('http://payments.local')
    .post('/payments/payment', {token, amount: amount*100, card})
    .reply(200, {
      transactionId: 'TX123'
     });

    const transactionId = await paymentsApi.processPayment(token, card, amount);
    expect(transactionId).toBe('TX123');
  });

  it("checks if transaction is completed", async () => {
    nock('http://payments.local')
    .get(`/payments/payment/${transactionId}?token=${token}`)
    .reply(200, {
      status: 'COMPLETED'
     });

    const res = await paymentsApi.isPaymentCompleted("123ABC", 'TX123');
    expect(res).toBe(true);
  });
});
