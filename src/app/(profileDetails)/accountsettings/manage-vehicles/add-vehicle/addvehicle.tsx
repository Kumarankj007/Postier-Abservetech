/* eslint-disable react-hooks/exhaustive-deps */
import Button from "@/app/component/button";
import LabeledInput from "@/app/component/input";
import SelectC from "@/app/component/select";
import Store from "@/app/store/store";
import useSnackbarStore from "@/app/store/toaster";
import VehicleStore from "@/app/store/vehicle";
import { AddVehicleAPI, UpdateVehicleAPI } from "@/app/tools/mutatefn/vehicle";
import { MenuItem } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function AddVehicleComp() {
  const { setModal } = Store();
  const params: any = useSearchParams();
  const Vehicle_id = params ? params.get("vehicle_id") : null;
  const User_id =
    typeof window !== "undefined" &&
    window.localStorage.getItem("appUserId") !== ""
      ? window.localStorage.getItem("appUserId")
      : null;
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const {
    fetchTypeOfVehicle,
    TypeOfVehicle,
    fetchVehicle,
    Vehicle,
    fetchMake,
    Make,
    fetchModel,
    Model,
    fetchSingleVehicle,
    SingleVehicle,
  }: any = VehicleStore();
  const [selected, setSelected] = useState<any>({});
  const [selectedServiceType, setSelectedServiceType] = useState<any>(null);
  // console.log("====================================");
  // console.log(selected, "selected");
  // console.log(SingleVehicle, "SingleVehicle");
  // console.log("====================================");
  const ButtonValidate = params
    ? true
    : selected?.color &&
      selected?.makeid &&
      selected?.model &&
      selected?.registrationnumber &&
      selected?.capacity &&
      selected?.servicetype &&
      selected?.year;

  const Inputs = [
    {
      type: "select",
      name: "servicetype",
      title: "Select Type Of Vehicle",
      map: TypeOfVehicle,
    },
    {
      type: "select",
      name: "makeid",
      title: "Select Vehicle brand",
      map: Make,
    },
    {
      type: "select",
      name: "model",
      title: "Select Vehicle Model",
      map: Model,
    },
    {
      type: "input",
      name: "year",
      title: "Select Vehicle Year",
    },
    {
      type: "input",
      name: "color",
      title: "Enter Vehicle Color",
    },
    {
      type: "input",
      name: "capacity",
      title: "Vehicle Capacity",
    },
    {
      type: "input",
      name: "registrationnumber",
      title: "Vehicle Number",
    },
  ];

  const getVisibleInputs = () => {
    const base = Inputs.find((i) => i.name === "servicetype");
    const regNum = Inputs.find((i) => i.name === "registrationnumber");
    const capacity = Inputs.find((i) => i.name === "capacity");

    if (!selectedServiceType) return [base];
    if (selectedServiceType?.way === "road") {
      return Inputs;
    } else {
      return [base, regNum, capacity];
    }
  };

  const visibleInputs = getVisibleInputs();

  const {
    handleSubmit,
    formState: { errors, dirtyFields },
    control,
    reset,
    setValue,
  } = useForm<any>({
    defaultValues: {
      servicetype: "",
      makeid: "",
      model: "",
      year: "",
      capacity: "",
      registrationnumber: "",
      color: "",
    },
  });

  const Post = useMutation({
    mutationFn: AddVehicleAPI,
    onSuccess: (data) => {
      showSnackbar(data.data.message, "success");
      setModal("AddVehicleModel", data?.data?.Vehicle?._id);
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });
  const Put = useMutation({
    mutationFn: UpdateVehicleAPI,
    onSuccess: (data) => {
      showSnackbar(data.data.message, "success");
      setModal("AddVehicleModel", data?.data?.vechicleData?._id);
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });
  const onSubmit = (data: any) => {
    if (!Vehicle_id) {
      let payload: any = {
        servicetype: data.servicetype,
        capacity: data.capacity,
        registrationnumber: data.registrationnumber,
      };

      if (selectedServiceType?.way === "road") {
        payload = {
          ...payload,
          makeid: data.makeid,
          model: data.model,
          year: data.year,
          color: data.color,
        };
      }
      Post.mutateAsync(payload);
    } else {
      const value: any = {};
      if (dirtyFields.servicetype) {
        value.servicetype = data?.servicetype;
      }
      if (dirtyFields.makeid) {
        value.makeid = data?.makeid;
      }
      if (dirtyFields.model) {
        value.model = data?.model;
      }
      if (dirtyFields.year) {
        value.year = data?.year;
      }
      if (dirtyFields.registrationnumber) {
        value.registrationnumber = data?.registrationnumber;
      }
      if (dirtyFields.capacity) {
        value.capacity = data?.capacity;
      }
      if (dirtyFields.color) {
        value.color = data?.color;
      }
      Put.mutateAsync({ value, Vehicle_id });
    }
  };

  useLayoutEffect(() => {
    fetchTypeOfVehicle();
    fetchMake();
  }, []);

  useEffect(() => {
    if (Vehicle_id) {
      fetchSingleVehicle(Vehicle_id);
    } else {
      reset();
      setSelectedServiceType(null);
    }
  }, [Vehicle_id]);

  useEffect(() => {
    if (SingleVehicle.length >= 1) {
      const single = SingleVehicle[0];
      const selected = TypeOfVehicle.find(
        (type: any) => type._id === single?.servicetype
      );
      setSelectedServiceType(selected);

      const baseValues = {
        servicetype: single?.servicetype,
        capacity: single?.capacity,
        registrationnumber: single?.registrationnumber,
      };

      const fullValues = {
        ...baseValues,
        makeid: single?.makeid,
        model: single?.model,
        year: single?.year,
        color: single?.color,
      };
      fetchModel(single?.makeid);

      // Use timeout to let state update OR use selected directly
      setTimeout(() => {
        if (selected?.way === "road") {
          reset(fullValues);
        } else {
          reset(baseValues);
        }
      }, 0); // or usePromise if applicable
    }
  }, [SingleVehicle, TypeOfVehicle]); // no need to include params if not affecting values

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-8 max-w-[600px]">
          {visibleInputs.map((items: any, index: any) => (
            <div key={index}>
              <Controller
                name={items.name}
                control={control}
                rules={{
                  required: "required",
                  ...(items.name === "year" && {
                    validate: (value: string) => {
                      const currentYear = new Date().getFullYear();
                      const yearNum = parseInt(value, 10);
                      if (isNaN(yearNum)) return "Year must be a number";
                      if (yearNum > currentYear)
                        return "Year cannot be in the future";
                      if (yearNum < 1900) return "Year must be reasonable";
                      return true;
                    },
                  }),
                }}
                render={({ field }) => {
                  const fieldId = `field-${items.name}`;
                  return (
                    <>
                      {items.type === "select" && (
                        <label htmlFor={fieldId} className="sr-only">
                          {items.title}
                        </label>
                      )}

                      {items.type === "select" ? (
                        <SelectC
                          {...field}
                          id={fieldId}
                          labelId={`${fieldId}`}
                          label={items.title}
                          required
                          error={!!errors[items?.name]}
                          onChange={(e: any) => {
                            const selectedValue = e.target.value;
                            if (index === 1) {
                              fetchModel(selectedValue);
                            }
                            setSelected((prev: any) => ({
                              ...prev,
                              [items.name]: { title: selectedValue },
                            }));
                            setValue(items.name, selectedValue, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                            if (items.name === "servicetype") {
                              const selectedType = TypeOfVehicle.find(
                                (type: any) => type._id === selectedValue
                              );
                              setSelectedServiceType(selectedType);
                            }
                          }}
                        >
                          <MenuItem disabled value="">
                            {items.title}
                          </MenuItem>
                          {Array.isArray(items.map) &&
                            items.map.map((option: any) => (
                              <MenuItem key={option._id} value={option._id}>
                                {option.name}
                              </MenuItem>
                            ))}
                        </SelectC>
                      ) : (
                        <LabeledInput
                          // aria-invalid="false"
                          {...field}
                          id={fieldId}
                          labelId={fieldId}
                          placeholder={items.title}
                          error={!!errors[items?.name]}
                          onChange={(e: any) => {
                            setSelected((prev: any) => ({
                              ...prev,
                              [items.name]: { title: e.target.value },
                            }));
                            setValue(items.name, e.target.value, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }}
                          // Apply validation only if items.title is 'color'
                          {...(items.name === "color" && {
                            onInput: (e: any) => {
                              e.target.value = e.target.value.replace(
                                /[^A-Za-z\s]/g,
                                ""
                              ); // Allow only letters and spaces
                            },
                            onKeyDown: (e) => {
                              if (/\d/.test(e.key)) {
                                e.preventDefault(); // Prevent typing numbers
                              }
                            },
                          })}
                        />
                      )}
                      <p className="text-red-500 text-sm mt-1">
                        {items.name === "year" && errors.year?.message
                          ? String(errors.year.message)
                          : null}
                      </p>
                    </>
                  );
                }}
              />
            </div>
          ))}
          {ButtonValidate && (
            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-btncolor px-[30px] py-[15px] rounded-full text-[#fff]"
              >
                {Vehicle_id ? "Update Vehicle" : "Add Vehicle"}
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}