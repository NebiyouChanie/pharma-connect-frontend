import { MinusSquare } from 'lucide-react';
import { PlusSquare } from 'lucide-react';
import React, { useState } from 'react';

import { BASE_URL } from "@/lib/utils";

function QuantityUpdater({ data }) {
  const [quantity, setQuantity] = useState(data.quantity);

  const [clickedButton, setClickedButton] = useState(null);

  const handleQuantityChange = async (change, button) => {
    setClickedButton(button);  
    const newQuantity = quantity + change;
    const dataToSend = { quantity: newQuantity, medicineId: data.medicine };
    try {
      const response = await fetch(`${BASE_URL}/pharmacies/${data.pharmacy}/inventory/${data._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      // Update the state on success
      setQuantity(newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      // Reset the clicked button after a short delay
      setTimeout(() => setClickedButton(null), 200);
    }
  };

  return (
    <div className="flex space-x-2 items-center">
      <MinusSquare
        onClick={() => handleQuantityChange(-1, "minus")}
        className="cursor-pointer"
        size={20}
        color={clickedButton === "minus" ? "black" : "#474747"} 
        strokeWidth={1}
      />
      <span>{quantity}</span>
      <PlusSquare
        onClick={() => handleQuantityChange(1, "plus")}
        className="cursor-pointer"
        size={20}
        color={clickedButton === "plus" ? "black" : "#474747"} 
        strokeWidth={1}
      />
    </div>
  );
}

export default QuantityUpdater;
