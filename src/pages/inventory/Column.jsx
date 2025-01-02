import {CellAction}  from "./CellAction";

export const columns = [
    {
      accessorKey: "medicineName",
      header: "Medicine Name",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "quantity",
      header: "Stock Quantity",
    },
    {
      accessorKey: "price",
      header: () => <div>Price</div>,
      cell: ({row}) => {
        const amount = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-ET",{
          style: "currency",
          currency: "ETB",
        }).format(amount);
  
        return <div>{formatted}</div>;
      },
    },

    {
      accessorKey: "expiryDate",
      header: "Expire Date",
      cell: ({ row }) => {
        const expiryDate = new Date(row.original.expiryDate);
        if (isNaN(expiryDate)) return "Invalid Date";
        const date = expiryDate.getDate().toString().padStart(2, "0");
        const month = (expiryDate.getMonth() + 1).toString().padStart(2, "0");
        const year = expiryDate.getFullYear();
        return `${date}-${month}-${year}`;
      },
    },
    
    {
      id: "actions",
      cell: ({row}) => <CellAction data={row.original}/>
    },
  ]
  