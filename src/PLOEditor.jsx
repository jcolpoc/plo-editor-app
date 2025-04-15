import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function PLOEditor() {
  const [plos, setPlos] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editedPLO, setEditedPLO] = useState("");
  const [editedShortTerm, setEditedShortTerm] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const parsedData = jsonData.map((row, index) => ({
        id: index,
        plo: row.PLO,
        shortTerm: row["Short Term"],
      }));

      setPlos(parsedData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDelete = (id) => {
    setPlos((prev) => prev.filter((item) => item.id !== id));
  };

  const openEditDialog = (item) => {
    setEditingItem(item);
    setEditedPLO(item.plo);
    setEditedShortTerm(item.shortTerm);
  };

  const saveEdit = () => {
    setPlos((prev) =>
      prev.map((item) =>
        item.id === editingItem.id ? { ...item, plo: editedPLO, shortTerm: editedShortTerm } : item
      )
    );
    setEditingItem(null);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">PLO Editor</h1>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4 block border p-2 rounded"
      />

      {plos.length > 0 && (
        <div className="space-y-4">
          {plos.map((item) => (
            <div
              key={item.id}
              className="p-4 border rounded-xl shadow-sm flex justify-between items-center"
            >
              <div>
                <div className="font-semibold">PLO: {item.plo}</div>
                <div className="text-sm text-gray-500">Short Term: {item.shortTerm}</div>
              </div>
              <div className="space-x-2">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={() => openEditDialog(item)}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Edit PLO</h2>
            <label className="block mb-2 font-medium">PLO</label>
            <textarea
              className="w-full border p-2 rounded mb-4"
              value={editedPLO}
              onChange={(e) => setEditedPLO(e.target.value)}
            />
            <label className="block mb-2 font-medium">Short Term</label>
            <textarea
              className="w-full border p-2 rounded mb-4"
              value={editedShortTerm}
              onChange={(e) => setEditedShortTerm(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={saveEdit}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded"
                onClick={() => setEditingItem(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
