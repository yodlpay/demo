const API_BASE_URL = process.env.REACT_APP_API_URL;

export const fetchTransaction = async (txHash: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/transactions/${txHash}`);
    const data = await response.json();
    return JSON.parse(data.transaction);
  } catch (err) {
    console.log("err", err);
    throw err;
  }
};

export const fetchTransactions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/transactions`);
    const data = await response.json();
    return data.transactions.map((item: { key: string; value: string }) =>
      JSON.parse(item.value)
    );
  } catch (err) {
    console.log("err", err);
    throw err;
  }
};
