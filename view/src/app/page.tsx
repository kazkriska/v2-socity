"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getSocietiesAction,
  getPocketsAction,
  getResidentAction,
} from "./actions";

export default function Home() {
  const router = useRouter();
  const [societies, setSocieties] = useState<any[]>([]);
  const [selectedSociety, setSelectedSociety] = useState<string>("");
  const [pockets, setPockets] = useState<any[]>([]);
  const [selectedPocket, setSelectedPocket] = useState<string>("");
  const [flatNumber, setFlatNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Fetch societies on mount
    getSocietiesAction().then((data) => {
      setSocieties(data);
    });
  }, []);

  useEffect(() => {
    if (selectedSociety) {
      // Fetch pockets when society changes
      getPocketsAction(Number(selectedSociety)).then((data) => {
        setPockets(data);
        setSelectedPocket(""); // Reset pocket selection
      });
    } else {
      setPockets([]);
      setSelectedPocket("");
    }
  }, [selectedSociety]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!selectedPocket || !flatNumber) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const result = await getResidentAction(
        Number(selectedPocket),
        Number(flatNumber)
      );
      if (result) {
        const societyName = societies.find(s => s.id === Number(selectedSociety))?.name;
        const pocketName = pockets.find(p => p.id === Number(selectedPocket))?.name;
        
        // Navigate to confirmation page with resident data
        const params = new URLSearchParams({
          id: result.toString(),
          society: societyName || "",
          pocket: pocketName || "",
          flat: flatNumber
        });
        router.push(`/confirmation?${params.toString()}`);
      } else {
        setError("Resident not found with the given details.");
      }
    } catch (err) {
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Resident Portal</h1>
          <p className="text-blue-100 mt-2 text-sm">Find your details to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Society Dropdown */}
          <div className="space-y-1">
            <label htmlFor="society" className="block text-sm font-medium text-gray-700">
              Society
            </label>
            <select
              id="society"
              value={selectedSociety}
              onChange={(e) => setSelectedSociety(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 border p-2.5 text-gray-900"
            >
              <option value="">Select a society</option>
              {societies.map((soc) => (
                <option key={soc.id} value={soc.id}>
                  {soc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Pocket Dropdown */}
          <div className="space-y-1">
            <label htmlFor="pocket" className="block text-sm font-medium text-gray-700">
              Pocket
            </label>
            <select
              id="pocket"
              value={selectedPocket}
              onChange={(e) => setSelectedPocket(e.target.value)}
              disabled={!selectedSociety || pockets.length === 0}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 border p-2.5 text-gray-900 disabled:opacity-50"
            >
              <option value="">Select a pocket</option>
              {pockets.map((pkt) => (
                <option key={pkt.id} value={pkt.id}>
                  {pkt.name}
                </option>
              ))}
            </select>
          </div>

          {/* Flat Number Input */}
          <div className="space-y-1">
            <label htmlFor="flatNumber" className="block text-sm font-medium text-gray-700">
              Flat Number
            </label>
            <input
              type="number"
              id="flatNumber"
              value={flatNumber}
              onChange={(e) => setFlatNumber(e.target.value)}
              placeholder="e.g. 101"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 border p-2.5 text-gray-900"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? "Processing..." : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
