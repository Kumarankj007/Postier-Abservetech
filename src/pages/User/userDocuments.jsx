import React from "react";
import { useQuery } from "@tanstack/react-query";
import { APICONSTANT } from "@/components/services/config";
import { getApiMethos } from "@/components/services/gobal";
import Loading from "@/components/Loading";
import Card from "@/components/ui/Card";
import Accordion from "@/components/ui/Accordion/DocumentsAccordion";

const UserDocuments = ({ userId }) => {
  const { data: documentData, error: documentError, isLoading: isDocumentLoading } = useQuery({
    queryKey: ["userDocument", APICONSTANT.getUserDocument + "/" + userId],
    queryFn: getApiMethos,
    retry: 0,
    enabled: !!userId, // Ensures the query runs only if `userId` is truthy
  });

  if (isDocumentLoading) return <div><Loading /></div>;
  if (documentError) return <div>An error occurred: {documentError.message}</div>;

  return (
    <>
      <div className="mt-3">
        <Card title={"Documents"}>
          {isDocumentLoading ? (
            <Loading />
          ) : (
            <Accordion items={documentData?.data?.documents} />
          )}
        </Card>
      </div>
    </>
  );
};

export default UserDocuments;
