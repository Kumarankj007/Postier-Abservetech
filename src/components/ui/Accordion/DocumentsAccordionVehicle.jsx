import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import Icon from "@/components/ui/Icon";
import Dropdown from "@/components/ui/Dropdown";
import Modal from "@/components/ui/modal/documentModal"; // Import your modal component
import Textinput from "@/components/ui/Textarea";
import Fileinput from "@/components/ui/Fileinput"; // Adjusted import path
import { Button } from "@/components/ui/ButtonComp";
import usePostMutation from "@/hooks/usePostMuation";
import { APICONSTANT } from "@/components/services/config";
import usePatchMutation from "@/hooks/usePatchMuation";
import DatePickerComponent from "@/components/ui/input/DatePicker";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiMethos } from "@/components/services/gobal";

const Accordion = ({ items: initialItems, className = "space-y-5", apidata }) => {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const id = search.get("id");

  const [activeIndex, setActiveIndex] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [vehicleopen, setvehicleopen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedFile, setSelectedFile] = useState({});
  const [selectedDocDate, setSelectedDocDate] = useState({});
  const [items, setItems] = useState(initialItems);
  const { register, handleSubmit, setValue } = useForm();

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  console.log(selectedDoc);

  const handleUpdate = (doc) => {
    setSelectedDoc(doc);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedFile({});
    setSelectedDoc(null);
    setSelectedDocDate(null);
    setModalOpen(false);
  };

  const usersDocsStatus = usePatchMutation();
  const handleVerifyDocuments = async (status, doc) => {
    // console.log("statusss", status)
    try {

      const data = {
        vehicleId: id,
        status: status,
        name: doc.indexName,
        reason: "",
        docFor: "vehicleDocs"

      };

      await usersDocsStatus.mutateAsync({
        url: { apiUrl: `${APICONSTANT.docsStatus}` },
        body: data,
      });

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.indexName === doc.indexName ? { ...item, status } : item
        )
      );
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const statusMenuMap = {
    needAction: [
      {
        label: "Accept",
        icon: "mdi:edit-circle",
        onClick: handleUpdate,
      },
    ],
    pending: [
      {
        label: "Update",
        icon: "mdi:edit-circle",
        onClick: handleUpdate,
      },
      {
        label: "Accept",
        icon: "mdi:check-circle",
        onClick: (doc) => handleVerifyDocuments("approved", doc),
      },
      {
        label: "Reject",
        icon: "mdi:close-circle",
        onClick: (doc) => handleVerifyDocuments("rejected", doc),
      },
    ],
    approved: [
      {
        label: "Update",
        icon: "mdi:edit-circle",
        onClick: handleUpdate,
      },
      {
        label: "Reject",
        icon: "mdi:close-circle",
        onClick: (doc) => handleVerifyDocuments("rejected", doc),
      },
    ],
    rejected: [
      {
        label: "Update",
        icon: "mdi:edit-circle",
        onClick: handleUpdate,
      },
      {
        label: "Accept",
        icon: "mdi:check-circle",
        onClick: (doc) => handleVerifyDocuments("approved", doc),
      },
    ],
  };

  const getFilteredMenu = (status, doc) => {
    const menuItems = statusMenuMap[status] || [];
    return menuItems.map((item) => ({
      ...item,
      onClick: () => {
        item.onClick(doc);
      },
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (field.type.includes('image')) {
      setSelectedFile((prevImages) => ({ ...prevImages, [field?.indexName]: file }))
    }
  };

  const handleDateChange = (date, field) => {
    setSelectedDocDate((prevDates) => ({ ...prevDates, [field.indexName]: date }));
  };


  const usersDocUpdate = usePostMutation();

  const queryClient = useQueryClient();

  const handleUpdateDocs = async (data) => {
    try {
      const formData = new FormData();
      console.log("Selected Doc:", selectedDoc);
      console.log("Selected Files:", selectedFile);
      console.log("Selected Dates:", selectedDocDate);
      formData.append("fieldName", selectedDoc.indexName);


      if (selectedDoc.indexName === "insurance") {
        formData.append("documentNumber", data.documentNumber);
      }

      selectedDoc?.fields?.forEach((field) => {
        if (field?.type?.includes("image")) {
          const file = selectedFile[field.indexName];
          console.log(`Appending file for ${field?.indexName}:`, file);
          if (file) {
            formData.append(field.indexName, file);
          }
        } else if (field?.type === "date") {
          const date = selectedDocDate[field?.indexName];
          console.log(`Appending date for ${field?.indexName}:`, date);
          if (date) {
            formData.append(field.indexName, date);
          }
        }
      });

      const response = await usersDocUpdate.mutateAsync({
        url: { apiUrl: `${APICONSTANT.getUserVehicle}/${apidata?.data?.Vehicle[0]?.userId}/${id}` },
        body: formData,
      });

      if (response?.type === "success") {
        await queryClient.invalidateQueries([`${APICONSTANT.getUserVehicle}/${apidata?.data?.Vehicle[0]?.userId}/${id}`]);
        setSelectedFile({});
        setSelectedDoc(null);
        setSelectedDocDate({});
        setModalOpen(false);
      }

    } catch (error) {
      console.error("Error saving data:", error);
    }
  };



  return (
    <div className={className}>
      {items.map((doc, index) => {
        const filteredMenu = getFilteredMenu(doc.status, doc);
        const isActive = activeIndex === index;
        return (
          <div
            className="accordion shadow-base dark:shadow-none rounded-md"
            key={doc.id || index}
          >
            <div
              className={`flex justify-between transition duration-150 font-medium w-full text-start text-base text-slate-600 dark:text-slate-300 px-8 py-4 ${isActive
                ? "bg-slate-50 dark:bg-slate-700 dark:bg-opacity-60 rounded-t-md"
                : "bg-white dark:bg-slate-700 rounded-md"
                }`}
            >
              <div className="flex justify-between">
                <span>{doc.name}</span>
                {doc.status === "approved" && (
                  <Icon icon="mdi:check-circle" className="ml-1 mt-1" />
                )}
                {doc.status === "pending" && (
                  <Icon icon="mdi:clock-outline" className="ml-1 mt-1" />
                )}
                {doc.status === "rejected" && (
                  <Icon icon="mdi:close-circle" className="ml-1 mt-1" />
                )}
              </div>
              <div className="flex justify-between cursor-pointer">
                <Dropdown
                  label={
                    <Icon
                      className="text-slate-900 dark:text-white text-[22px] h-5"
                      icon="mdi:dots-vertical"
                    />
                  }
                  items={filteredMenu}
                  classItem="px-4 py-2"
                  classMenuItems="mt-2 w-[160px]"
                  wrapperClass="relative"
                />
                <span
                  className={`text-slate-900 dark:text-white text-[22px] transition-all duration-300 h-5 ${isActive ? "rotate-180 transform" : ""
                    }`}
                  onClick={() => toggleAccordion(index)}
                >
                  <Icon icon="heroicons-outline:chevron-down" />
                </span>
              </div>
            </div>

            {isActive && (
              <div
                className={`text-sm text-slate-600 font-normal bg-white dark:bg-slate-900 dark:text-slate-300 rounded-b-md`}
              >
                <div className="px-8 py-4">
                  {doc.fields.map((content, i) => (
                    <div key={i} className="flex justify-between">
                      <div className="py-5"><span >{content.name}:</span>
                        {
                          content.type === "image" ?
                            <img src={`${import.meta.env.VITE_API_URL}${content.value}`} className="w-[300px] h-[200px] object-contain mt-4">
                            </img> : <></>
                          // <span className="font-bold ml-4">{content.value}</span>
                        }

                      </div>


                      {content.value ? (
                        content.type.includes("image") ? (
                          <a
                            className="cursor-pointer"
                            href={`${import.meta.env.VITE_API_URL}${content.value}`}
                            target="_blank"
                            rel="noopener"
                          >
                            View
                          </a>
                        ) : content.indexName.includes("date") ? (
                          <span className="font-bold">{content.value}</span>
                        ) : (
                          <span className="font-bold">{content.value}</span>
                        )
                      ) : (
                        <span>No data available</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Modal for document update */}
      <Modal
        title={
          selectedDoc ? `Update Details for ${selectedDoc.name}` : "Update Document"
        }
        labelclassName="btn-outline-dark"
        activeModal={isModalOpen}
        onClose={handleModalClose}
      >
        <form onSubmit={handleSubmit(handleUpdateDocs)}>
          {selectedDoc?.fields.map((field, index) => (

            <div key={index}>

              {field?.type.includes("image") && (
                <div>
                  <label className="form-label">{field?.name}</label>
                  <Fileinput
                    name={field?.indexName} // Use indexName here
                    selectedFile={selectedFile[field?.indexName]} // Retrieve the correct file
                    onChange={(e) => handleFileChange(e, field)} // Pass the field object to handleFileChange
                  />

                </div>
              )}
              {field?.type === "date" && selectedDoc.name !== "Vehicle Image" && (
                <DatePickerComponent
                  selectedDate={selectedDocDate && selectedDocDate[field?.indexName]}
                  onDateChange={(date) => handleDateChange(date, field)}
                  label="Document Date"
                  placeholder="Select a date"
                  id="documentDate"
                />
              )}


              {/* {!field?.type.includes("image") && !field?.type.includes("date") && (
                <div>
                  <label className="form-label">{field?.name}</label>
                  <Textinput
                    name={field?.name}
                    defaultValue={field.value}
                    onChange={(e) => setValue(field?.name, e.target.value)}
                  />
                </div>
              )} */}
              {!field?.type.includes("image") && !field?.type.includes("date") && selectedDoc?.name !== "Vehicle Image" && (
                <Textinput
                  label="Document Number"
                  type="text"
                  placeholder="Document Number"
                  name="documentNumber"
                  register={register}
                />
              )}
              {/* {
                !field?.type.includes("image") && !field?.type.includes("date") && selectedDoc?.name === "Vehicle Image" && field.indexName === "documentNumber" && (<>
                  <Textinput
                    label="Document Number"
                    type="text"
                    placeholder="Document Number"
                    name="documentNumber"
                    register={register}
                  /></>
                )} */}

            </div>
          ))}
          <div className="lg:col-span-2 col-span-1 mt-3">
            <div className="ltr:text-right rtl:text-left">
              <button type="submit" className="btn btn-dark text-center">
                Update
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Accordion;
