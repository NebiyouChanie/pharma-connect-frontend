import AlertDialog from "@/components/Aler";
import  ImageModal  from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/lib/utils";
import axios from "axios";
import { XCircle } from "lucide-react";
import { CheckCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ApplicationDetail() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const navigate = useNavigate();

  const fetchApplication = async (id) => {
    try {
      const response = await fetch(BASE_URL + `/applications/${id}`);
      const responseJson = await response.json();
      const application = responseJson.application;
      setApplication(application);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchApplication(id);
  }, []);

  const approvePharmacy = async () => {
    try {
      const status = { status: "Approved" };
      const response = await fetch(BASE_URL + `/applications/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(status),
      });

      if (response.ok) {
        toast.success("Pharmacy Approved");
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || "An error occurred!"}`);
      }
    } catch (error) {
      toast.error("An error has occurred!");
      console.error(error);
    }
  };

  const deletePharmacy = async () => {
    try {
      await axios.delete(BASE_URL + `/applications/${id}/delete`);
      toast.success("Application Declined!");
      navigate(0);
    } catch (error) {
      toast.error("An error has occurred!");
      console.error(error);
    }
  };

  if (!application) {
    return <div className="container text-xl">Loading Application...</div>;
  }

  const renderDetailRow = (label, value) => (
    <div className="flex justify-between py-2 border-b">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="text-gray-600">{value || "N/A"}</span>
    </div>
  );


  const handleApprove = async () => {
    setIsApproveDialogOpen(false); // Close the dialog
    await approvePharmacy();
  };

  const handleReject = async () => {
    setIsRejectDialogOpen(false); // Close the dialog
    await deletePharmacy();
  };
  

  // Handle opening the modal with image URL and title
  const openModal = (imageUrl, title) => {
    setModalImage(imageUrl);
    setModalTitle(title);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(""); // Clear the image when closing the modal
    setModalTitle(""); // Clear the title when closing the modal
  };

  return (
    <div className="container pt-10">
      <div className="w-10/12 m-auto bg-white  rounded-lg p-6">
        <h1 className="text-4xl font-bold mb-6">Application Detail</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {renderDetailRow("Pharmacy Name", application.pharmacyName)}
            {renderDetailRow("Owner Name", application.ownerName)}
            {renderDetailRow("License Number", application.licenseNumber)}
            {renderDetailRow("Email", application.email)}
            {renderDetailRow("Contact Number", application.contactNumber)}
            {renderDetailRow("Address", `${application.address}, ${application.city}`)}
            {renderDetailRow("State", application.state)}
            {renderDetailRow("Zip Code", application.zipCode)}
            {renderDetailRow("Status", application.status)}
          </div>
          <div className="flex flex-col items-center gap-4">
            <img
              src={application.licenseImage}
              alt="License"
              className="bg-gray-200 h-[200px] w-[300px] rounded-lg object-cover cursor-pointer"
              onClick={() => openModal(application.licenseImage, "License Image")}
            />
            <img
              src={application.pharmacyImage}
              alt="Pharmacy"
              className="bg-gray-200 h-[200px] w-[300px] rounded-lg object-cover cursor-pointer"
              onClick={() => openModal(application.pharmacyImage, "Pharmacy Image")}
            />
          </div>
        </div>
        {application.status === "Pending" ? (
          <div className="flex justify-start gap-4 mt-8 w-fit">
          <Button onClick={() => setIsApproveDialogOpen(true)} variant="approve">
            Approve
          </Button>
          <Button onClick={() => setIsRejectDialogOpen(true)} variant="decline">
            Decline
          </Button>
        </div>
        ) : (
          <div
            className={`mt-6 text-white font-semibold  py-2 px-6 rounded-md w-fit flex gap-2 ${
              application.status === "Approved" ? "bg-success" : "bg-error"
            }`}
          >
            {application.status === "Approved" ? <CheckCircle/> : <XCircle />}
            {application.status === "Approved" ? "Approved" : "Rejected"}
          </div>
        )}
         <ImageModal
          imageSrc={modalImage} // The image to display in the modal
          isOpen={isModalOpen}  // Controls whether the modal is open or not
          onClose={closeModal}  // Handles closing the modal
          title={modalTitle}    // Pass the title to the modal
        />
 
        <AlertDialog
          isOpen={isApproveDialogOpen}
          onClose={() => setIsApproveDialogOpen(false)}
          title="Confirm Approval"
          message="Are you sure you want to approve this application?"
          confirmText="Yes, Approve"
          cancelText="Cancel"
          onConfirm={handleApprove}
        />

        {/* Reject Dialog */}
        <AlertDialog
          isOpen={isRejectDialogOpen}
          onClose={() => setIsRejectDialogOpen(false)}
          title="Confirm Rejection"
          message="Are you sure you want to reject this application?"
          confirmText="Yes, Reject"
          cancelText="Cancel"
          onConfirm={handleReject}
        />
      </div>
    </div>
  );
}
