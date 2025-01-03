import { Dialog, DialogTrigger, DialogContent, DialogOverlay, DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog";
 

const ImageModal = ({ imageSrc, isOpen, onClose, title }) => {
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black opacity-50" />
      <DialogContent className="max-w-4xl max-h-screen overflow-hidden bg-white rounded-lg p-4">
        <DialogHeader className="text-center">
          <h2 className="text-2xl font-bold">{title}</h2>  
        </DialogHeader>
        <div className="flex justify-center items-center">
          <img
            src={imageSrc}
            alt="Enlarged View"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;

