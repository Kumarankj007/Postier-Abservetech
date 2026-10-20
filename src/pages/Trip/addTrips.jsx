import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery } from "@tanstack/react-query";
import { APICONSTANT, APIURLS } from "../../components/services/config";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/ButtonComp";
import Select from "react-select";
import DatePickerComponent from "@/components/ui/input/DatePicker";
import { getApiMethos } from "@/components/services/gobal";
import AsyncSelect from "react-select/async";
import axios from "axios";

// import Suggestions from '@/components/ui/Suggestion';

// Validation Schema
const FormValidationSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  email: yup.string().required("Email is required"),
  capacity: yup.string().required("Capacity is required"),
  avgPrice: yup.string().required("Average price is required"),
});

const tripStatus = [
  { value: "Pending", label: "Pending" },
  { value: "Published", label: "Published" },
  { value: "Transit", label: "Transit" },
  { value: "Finished", label: "Finished" },
  { value: "Cancelled", label: "Cancelled" },
];

const tripTypes = [
  { value: "Food Parcel", label: "Food Parcel" },
  { value: "Fragile", label: "Fragile" },
  { value: "Workshop Materials", label: "Workshop Materials" },
  { value: "Furnitures", label: "Furnitures" },
  { value: "Electron", label: "Electron" },
];

const selectStyles = {
  option: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const addTrips = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedTripTypes, setSelectedTripTypes] = useState(null);
  const [userType, setUserType] = useState(null);
  const [parcelType, setParcelType] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  const { data: userData } = useQuery({
    queryKey: ["userData", APICONSTANT.getUser],
    queryFn: getApiMethos,
    retry: 0,
  });
  const usertypes =
    userData?.data?.user?.map((item) => ({
      value: item._id,
      label: `${item.uniCode} - ${item.fname} ${item.lname}`,
    })) || [];

  const handleUser = (selectedOptions) => {
    setUserType(selectedOptions);
  };

  const { data: parcelData } = useQuery({
    queryKey: ["parcelData", APICONSTANT.viewParcelType],
    queryFn: getApiMethos,
    retry: 0,
  });
  // console.log("parcelData", parcelData);

  const parceltypes =
    parcelData?.data?.parcelType?.map((item) => ({
      value: item._id,
      label: item.name,
    })) || [];

  const handleParcel = (selectedOptions) => {
    setParcelType(selectedOptions);
  };

  const { data: deliverytripData } = useQuery({
    queryKey: ["tripData", APICONSTANT.viewDeliverParcel],
    queryFn: getApiMethos,
    retry: 0,
  });

  const deliverytriptypes =
    deliverytripData?.data?.deliverParcelType?.map((item) => ({
      value: item._id,
      label: item.name,
    })) || [];
  // console.log("Delivery Dropdown :", deliverytriptypes);
  const handledeliveryTrip = (selectedOptions) => {
    setSelectedTripTypes(selectedOptions);
  };

  const token = localStorage.getItem("token");
  const fetchSuggestions = async (inputValue) => {
    if (!inputValue) return [];
    try {
      const response = await axios.get(
        `${APIURLS.baseUrl}common/suggestion?search=${inputValue}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      console.log("Suggestions Response:", response?.data);

      const suggestions = response?.data?.suggestion;
      if (!Array.isArray(suggestions)) {
        console.warn("No suggestion array in response:", response?.data);
        return [];
      }

      return suggestions.map((item) => ({
        label: `${item.primaryAddress} (${item.secondaryAddress})`,
        value: item.place_id,
        data: item,
      }));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return [];
    }
  };

  // Handle selection of an option
  const handleChange = async (selected) => {
    setSelectedOption(selected);
    // console.log("Selected item:", selected);

    // Post the selected data to another API
    try {
      const postResponse = await axios.post(`${APIURLS.baseUrl}common/submit`, {
        place_id: selected.data.place_id,
        lat: selected.data.lat,
        lng: selected.data.lng,
        city: selected.data.city,
      });
      // console.log("POST response:", postResponse.data);
    } catch (error) {
      // console.error("Error posting data:", error);
    }
  };

  const handleStatusChange = (selectedOption) => {
    setSelectedStatus(selectedOption);
  };

  const handleTripMenuChange = (selectedOptions) => {
    setSelectedTripTypes(selectedOptions);
  };

  const onSubmit = (data) => {
    // console.log(data);
  };

  return (
    <>
      <Card
        title={"Add Trip"}
        footer={<Button formId="addTripForm" />}
        backIcon={true}
      >
        <form
          id={"addTripForm"}
          onSubmit={handleSubmit(onSubmit)}
          className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6"
        >
          <div>
            <label className="form-label">Suggestions</label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={fetchSuggestions} // Async load function
              onChange={handleChange} // Handle user selection
              placeholder="Search for a place..."
              className="react-select"
              classNamePrefix="select"
            />
          </div>

          <div>
            <label className="form-label">User</label>
            <Select
              value={userType}
              options={usertypes}
              onChange={handleUser}
              styles={selectStyles}
              className="react-select"
              classNamePrefix="select"
            />
          </div>

          <Textinput
            label="Description"
            type="text"
            placeholder="Type Description"
            name="description"
            register={register}
            error={errors.group}
          />

          <div>
            <label className="form-label">Parcel Type</label>
            <Select
              value={parcelType}
              options={parceltypes}
              onChange={handleParcel}
              styles={selectStyles}
              className="react-select"
              classNamePrefix="select"
            />
          </div>
          <div>
            <label className="form-label">Delivery Type</label>
            <Select
              value={selectedTripTypes}
              options={deliverytriptypes}
              onChange={handledeliveryTrip}
              styles={selectStyles}
              className="react-select"
              classNamePrefix="select"
            />
          </div>
          <div className="flex justify-between">
            <DatePickerComponent
              selectedDate={startDate}
              onDateChange={setStartDate}
              label="Start Date"
              placeholder="Select a date"
              id="startDate"
            />
            <DatePickerComponent
              selectedDate={endDate}
              onDateChange={setEndDate}
              label="End Date"
              placeholder="Select a date"
              id="endDate"
            />
          </div>
          <Textinput
            label="Capacity"
            type="text"
            placeholder="Type Capacity"
            name="capacity"
            register={register}
            error={errors.group}
          />
          <Textinput
            label="MaxWeight"
            type="number"
            placeholder="Type MaxWeight"
            name="maxWeight"
            register={register}
            error={errors.group}
          />
          <Textinput
            label="MaxWidth"
            type="number"
            placeholder="Type MaxWidth"
            name="maxWidth"
            register={register}
            error={errors.group}
          />
          <Textinput
            label="MaxHeight"
            type="number"
            placeholder="Type MaxHeight"
            name="maxHeight"
            register={register}
            error={errors.group}
          />
          <Textinput
            label="maxLength"
            type="number"
            placeholder="Type maxLength"
            name="maxLength"
            register={register}
            error={errors.group}
          />

          <div>
            <label className="form-label">Instant Booking</label>
            <Select
              value={selectedStatus}
              options={tripStatus}
              onChange={handleStatusChange}
              styles={selectStyles}
              className="react-select"
              classNamePrefix="select"
            />
          </div>
          <Textinput
            label="Avg Price"
            type="number"
            placeholder="Type Avg Price"
            name="avgPrice"
            register={register}
            error={errors.group}
          />
          <div>
            <label className="form-label">wayPointId</label>
            <Select
              value={selectedStatus}
              options={tripStatus}
              onChange={handleStatusChange}
              styles={selectStyles}
              className="react-select"
              classNamePrefix="select"
            />
          </div>
          <div>
            <label className="form-label">vehicleId</label>
            <Select
              value={selectedStatus}
              options={tripStatus}
              onChange={handleStatusChange}
              styles={selectStyles}
              className="react-select"
              classNamePrefix="select"
            />
          </div>
          <div>
            <label className="form-label">dimensionType</label>
            <Select
              value={selectedStatus}
              options={tripStatus}
              onChange={handleStatusChange}
              styles={selectStyles}
              className="react-select"
              classNamePrefix="select"
            />
          </div>

          {/* <Suggestions /> */}
        </form>
      </Card>
    </>
  );
};

export default addTrips;
