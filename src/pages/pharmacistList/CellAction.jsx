import { Button } from "@/components/ui/button";
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import AlertDialog from "@/components/Aler";
import { toast } from "react-toastify";
import { BASE_URL } from "@/lib/utils";
import {useParams} from 'react-router-dom'
 
export const CellAction = ({
    data
}) => {
     
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const {pharmacyId} = useParams()
     
    
    const onDelete = async() => {
        try {
            setLoading(true)
            const response = await axios.patch(`${BASE_URL}/pharmacies/${pharmacyId}/pharmacists/${data._id}`)
            toast.success("Pharmacist Removed from pharmacy successfully.")
            window.location.reload();
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
            title="Confirm Removal"
            message="Are you sure you want to Remove this pharmacist from pharmacy?"
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
                <DropdownMenuItem onClick={() => setOpen(true)}>
                    <Trash className="mr-2 h-4 w-4"/>
                    Remove pharmacist
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}