import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogTrigger, DialogContent } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

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
      <Input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="mb-4" />

      {plos.length > 0 && (
        <div className="space-y-4">
          {plos.map((item) => (
            <div key={item.id} className="p-4 border rounded-xl shadow-sm flex justify-between items-center">
              <div>
                <div className="font-semibold">PLO: {item.plo}</div>
                <div className="text-sm text-gray-500">Short Term: {item.shortTerm}</div>
              </div>
              <div className="space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => openEditDialog(item)}>Edit</Button>
                  </DialogTrigger>
                  {editingItem && editingItem.id === item.id && (
                    <DialogContent className="space-y-4">
                      <div>
                        <Label htmlFor="plo">Edit PLO</Label>
                        <Textarea
                          id="plo"
                          value={editedPLO}
                          onChange={(e) => setEditedPLO(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="shortTerm">Edit Short Term</Label>
                        <Textarea
                          id="shortTerm"
                          value={editedShortTerm}
                          onChange={(e) => setEditedShortTerm(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="default" onClick={saveEdit}>
                          Save
                        </Button>
                        <Button variant="ghost" onClick={() => setEditingItem(null)}>
                          Cancel
                        </Button>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
                <Button variant="destructive" onClick={() => handleDelete(item.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
