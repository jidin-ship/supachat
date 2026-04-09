"use client";

import { useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function Home() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query) return;

    setMessages([...messages, { type: "user", text: query }]);
    setLoading(true);

    try {
      const res = await axios.post(
        "/api/query",
        {},
        {
          params: { user_query: query },
        }
      );

      const data = res.data.data;

      // convert to chart format
      const formatted = data.map((item: any) => ({
        name: item[0],
        value: item[1],
      }));

      setChartData(formatted);

      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Data loaded successfully" },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Error fetching data" },
      ]);
    }

    setQuery("");
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">SupaChat 🚀</h1>

      {/* Chat */}
      <div className="border p-4 h-60 overflow-y-auto mb-4 rounded">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            {msg.type === "user" ? "🧑 " : "🤖 "}
            {msg.text}
          </div>
        ))}
        {loading && <div>⏳ Loading...</div>}
      </div>

      {/* Input */}
      <input
        className="border p-2 w-full mb-2 rounded"
        placeholder="Ask something..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Send
      </button>

      {/* Table */}
      {chartData.length > 0 && (
        <table className="w-full border mb-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Topic</th>
              <th className="border p-2">Views</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((row, i) => (
              <tr key={i}>
                <td className="border p-2">{row.name}</td>
                <td className="border p-2">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <BarChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      )}
    </div>
  );
}


