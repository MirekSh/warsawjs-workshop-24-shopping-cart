import axios from "axios";
import httpAdapter from "axios/lib/adapters/http";

axios.defaults.adapter = httpAdapter;

const client = axios.create({
  baseURL: "http://payments.local"
});

const authorizeClient = async (username, password) => {
  try {
    const response = await client.post("/auth/token", { username, password });

    return response.data.token;
  } catch (error) {
    switch (error.response.status) {
      case 401:
        throw new Error("Unauthorized");
      default:
        throw new Error("API Error");
    }
  }
};

const processPayment = async (token, card, amount) => {
  try {
    const response = await client.post("/payments/payment", {
      token,
      amount: amount * 100,
      card
    });

    return response.data.transactionId;
  } catch (error) {
    //console.log(error);
    switch (error.response.status) {
      case 401:
        throw new Error("Unauthorized");
      default:
        throw new Error("API Error");
    }
  }
};

const isPaymentCompleted = async (token, transactionId) => {
  try {
    const response = await client.get(
      `/payments/payment/${transactionId}?token=${token}`
    );

    return response.data.status === "COMPLETED";
  } catch (error) {
    switch (error.response.status) {
      case 401:
        throw new Error("Unauthorized");
      default:
        throw new Error("API Error");
    }
  }
};

export default { authorizeClient, processPayment, isPaymentCompleted };
