import React from "react";
import { useQuery } from "@tanstack/react-query";
import { APICONSTANT } from "@/components/services/config";
import { getApiMethos } from "@/components/services/gobal";
import Loading from "@/components/Loading";
import Card from "@/components/ui/Card";
import Accordion from "@/components/ui/Accordion/DocumentsAccordionVehicle";

const UserDocuments = ({ userId, apidata }) => {
  const search = new URLSearchParams(location.search);
  const id = search.get("id");

  const { data: documentData, error: documentError, isLoading: isDocumentLoading } = useQuery({
    queryKey: ["userDocument", APICONSTANT.getUserVehicle + "/" + apidata.data.Vehicle[0].userId + "/" + userId],
    queryFn: getApiMethos,
    retry: 0,
    enabled: !!userId,
  });

  console.log("documentData", apidata)
  console.log("documentData", documentData)

  if (isDocumentLoading) return <div><Loading /></div>;
  if (documentError) return <div>An error occurred: {documentError.message}</div>;

  return (
    <>
      <div className="mt-3">
        <Card title={"Documents"}>
          {isDocumentLoading ? (
            <Loading />
          ) : (
            <Accordion items={documentData?.data?.documents} apidata={apidata} />
          )}
        </Card>
      </div>
    </>
  );
};

export default UserDocuments;
