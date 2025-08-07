import React, { useEffect, useState } from "react";
import axios from "axios";

const GoldPage = () => {
const [quantity, setQuantity] = useState("");
const [goldQuantity, setGoldQuantity] = useState(0);
const [walletBalance, setWalletBalance] = useState(0);
const [ratePerGram, setRatePerGram] = useState(0);
const [loading, setLoading] = useState(false);
const user_id = 1; // Assuming only one user

const fetchGoldData = async () => {
try {
const response = await axios.get(`http://localhost:3000/api/gold/${user_id}`);
setGoldQuantity(parseFloat(response.data.gold_quantity));
setWalletBalance(parseFloat(response.data.wallet_balance));
setRatePerGram(response.data.rate_per_gram);
} catch (error) {
console.error("Error fetching gold data:", error);
}
};

const handleTransaction = async (type) => {
if (!quantity || isNaN(quantity) || quantity <= 0) {
alert("Please enter a valid quantity");
return;
}


setLoading(true);
try {
  const payload = { user_id, quantity: parseFloat(quantity) };
  const url = `http://localhost:3000/api/gold/${type}`;
  const response = await axios.post(url, payload);
  alert(response.data.message || `${type} successful`);
  setQuantity("");
  fetchGoldData();
} catch (error) {
  alert(error.response?.data?.message || `Failed to ${type} gold`);
} finally {
  setLoading(false);
}
};

useEffect(() => {
fetchGoldData();
}, []);

return (
<div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border">
<h1 className="text-3xl font-bold mb-4 text-center text-yellow-600">Digital Gold</h1>


  <div className="space-y-3 text-center mb-6">
    <p className="text-lg">
      <span className="font-semibold">Gold Quantity:</span>{" "}
      {goldQuantity?.toFixed(2)} grams
    </p>
    <p className="text-lg">
      <span className="font-semibold">Wallet Balance:</span> ₹
      {walletBalance?.toFixed(2)}
    </p>
    <p className="text-lg">
      <span className="font-semibold">Gold Rate:</span> ₹{ratePerGram} / gram
    </p>
  </div>

  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
    <input
      type="number"
      value={quantity}
      onChange={(e) => setQuantity(e.target.value)}
      placeholder="Quantity in grams"
      className="px-4 py-2 border rounded-xl w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
    />
    <button
      onClick={() => handleTransaction("buy")}
      disabled={loading}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow"
    >
      {loading ? "Processing..." : "Buy Gold"}
    </button>
    <button
      onClick={() => handleTransaction("sell")}
      disabled={loading}
      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl shadow"
    >
      {loading ? "Processing..." : "Sell Gold"}
    </button>
  </div>
</div>
);
};

export default GoldPage;