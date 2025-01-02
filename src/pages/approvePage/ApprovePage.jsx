import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/lib/utils";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function ApprovePage() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const fetchApplication = async (id) => {
    try {
      const response = await fetch(BASE_URL + `/applications/${id}`);
      const responseJson = await response.json();
      console.log(responseJson);
      const application = responseJson.application;
      setApplication(application);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchApplication(id);
  }, []);

  const approvePharmacy = async () => {
    try {
      const status = { status: "approved" };
      await axios.patch(BASE_URL + `/applications/${id}/update`, status);
      toast.success("Pharmacy Approved");
    } catch (error) {
      toast.error("An error has occured!");
      console.log(error);
    }
  };
  const deletePharmacy = async () => {
    try {
      await axios.delete(BASE_URL + `/applications/${id}/delete`);
      toast.success("Application Declined!");
    } catch (error) {
      toast.error("An error has occured!");
    }
  };
  if (!application) {
    return <div className="container text-xl">Loading Application</div>;
  }
  return (
    <div className="container pt-10">
      <div className="w-10/12 m-auto">
        <h1 className="text-5xl font-bold">Application Detail</h1>
        <div className="flex justify-between mt-10">
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl text-gray-800">Applicant</h2>
            <p>
              <span className="font-bold">Pharmacy Name: </span>{" "}
              <span>{application.pharmacyName}</span>
            </p>
            <p>
              <span className="font-bold">Owner Name: </span>{" "}
              <span>{application.ownerName}</span>
            </p>
            <p>
              <span className="font-bold"> License Number: </span>{" "}
              <span>{application.licenseNumber}</span>
            </p>
            <p>
              <span className="font-bold">Location: </span>{" "}
              <span>{application.location}</span>
            </p>
          </div>
          <div className="flex flex-col gap-5">
            {/* <img
              src={application.licenseImage}
              alt="Pharmacy Image"
              className="bg-gray-200 h-[200px] w-[300px] rounded-lg"
            /> */}
            <img
              src={application.licenseImage}
              alt="Pharmacy Image"
              className="bg-gray-200 h-[200px] w-[300px] rounded-lg"
            />
          </div>
        </div>
        <div className="flex justify-center gap-6 ml-auto mt-8">
          <Button onClick={approvePharmacy} variant="approve">
            Approve
          </Button>
          <Button onClick={deletePharmacy} variant="destructive">
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
}
