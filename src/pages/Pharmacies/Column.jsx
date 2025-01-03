import {CellAction}  from "./CellAction";



export const columns = [
    {
      accessorKey: "ownerName",
      header: "Owner Name",
    },
    {
      accessorKey: "name",
      header: "Pharmacy Name",
    },
    {
      accessorKey: "state",
      header: "State",
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => {
        const createdDate = new Date(row.original.createdAt);
        if (isNaN(createdDate)) return "Invalid Date";
        const date = createdDate.getDate().toString().padStart(2, "0");
        const month = (createdDate.getMonth() + 1).toString().padStart(2, "0");
        const year = createdDate.getFullYear();
        return `${date}-${month}-${year}`;
      }
    },
    {
            id: "actions",
            header: "Actions",
            cell: ({row}) => <CellAction data={row.original}/>
        },
  ]
  