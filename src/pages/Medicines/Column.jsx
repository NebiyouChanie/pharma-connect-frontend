import {CellAction}  from "./CellAction";



export const columns = [
    {
      accessorKey: "name",
      header: "Medicine Name",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({row}) => {
        const description = row.original.description;
        return description.length > 50 
          ? <div>{description.substring(0, 50) + '...'}</div> 
          : <div>{description}</div>;
      }
    }
    ,
    
    {
        id: "actions",
      header: "Actions",
        cell: ({row}) => <CellAction data={row.original}/>
    },
  ]
  