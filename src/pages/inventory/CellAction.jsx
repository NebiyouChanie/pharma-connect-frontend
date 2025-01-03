import { Button } from "@/components/ui/button";
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import AlertDialog from "@/components/Aler";
import { toast } from "react-toastify";
import { BASE_URL } from "@/lib/utils";
import  {useNavigate,useLocation} from 'react-router-dom';

 
export const CellAction = ({
    data
}) => {
     
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation();
    const onCopy = (name) => {
        navigator.clipboard.writeText(name);
        toast.success("Medicine Name copied to clipboard.")
    }
    
    const onDelete = async() => {
        try {
            setLoading(true)
            const response = await axios.delete(`${BASE_URL}/pharmacies/${data.pharmacyId}/inventory/${data.medicineId}`)
            toast.success("Medicine Removed from invontory successfully.")
            window.location.reload();
            console.log("🚀 ~ file: CellAction.jsx:32 ~ onDelete ~ response:", response)
        } catch (error) {
            toast.error("Something Went Wrong")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }
    
    const Delete = async () => {
        setOpen(false); // Close the dialog
        await onDelete();
      };

    return (
        <>

        <AlertDialog
            isOpen={open}
            onClose={() => setOpen(false)}
            title="Confirm Rejection"
            message="Are you sure you want to Remove this medicine from inventory?"
            confirmText="Yes, Remove"
            cancelText="Cancel"
            onConfirm={Delete}
        />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    Actions
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={()=>onCopy(data.medicineName)}>
                    <Copy className="mr-2 h-4 w-4"/>
                    Copy Medicine Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`${location.pathname}/update/${data.inventoryId}`) }>
                    <Edit className="mr-2 h-4 w-4"/>
                    Update
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpen(true)}>
                    <Trash className="mr-2 h-4 w-4"/>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}