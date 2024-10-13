import { usePdf } from "@/hooks/use-pdf";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import PdfRenderer from "../PDF/pdf-renderer";

const PdfModal = () => {
  const pdfModal = usePdf();
  return (
    <Dialog open={pdfModal.isOpen} onOpenChange={pdfModal.onClose}>
      <DialogContent className="flex flex-col items-center justify-center">
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">PDF</h2>
        </DialogHeader>
        <div className="">
          <PdfRenderer url={pdfModal.url ?? ""} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PdfModal;
