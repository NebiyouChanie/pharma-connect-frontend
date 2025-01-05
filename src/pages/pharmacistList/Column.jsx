import {CellAction}  from "./CellAction";

export const columns = [
    {
      accessorKey: "firstName",
      header: "First Name",
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phoneNumber",
      header: "phone Number",
    },
     
    {
      id: "actions",
      header: "Actions",
      cell: ({row}) => <CellAction data={row.original}/>
    },
  ]
  