import React, { useState,useEffect } from "react";
import Select, { components } from "react-select";
import { useSelector, useDispatch } from "react-redux";
import Textinput from "@/components/ui/Textinput";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Icon from "@/components/ui/Icon";
import { useNavigate } from "react-router-dom";
import ImageUpload from "@/components/ui/ImageUpload";
import {editManagerDetailsbyManager} from "../auth/common/store"


// import { EditManagerDetails } from "../provider/store";
// import { getmenuList } from "../category/store";
// import Modal from "@/components/ui/Modal";
// import SplitDropdown from "@/components/ui/Split-dropdown";
// import Button from "@/components/ui/Button";
// import { v4 as uuidv4 } from "uuid";
// import Flatpickr from "react-flatpickr";
// import FormGroup from "@/components/ui/FormGroup";
// import avatar1 from "@/assets/images/avatar/av-1.svg";
// import avatar2 from "@/assets/images/avatar/av-2.svg";
// import avatar3 from "@/assets/images/avatar/av-3.svg";
// import avatar4 from "@/assets/images/avatar/av-4.svg";
// import { files } from "src/constant/data";


const AddProducts = ({menuI}) => {
  // console.log("...id...","menuId");
  // const [list,setList] = useState();
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { managerDetails } = useSelector((state) => state.provider);
  const { loginUserDetails } = useSelector((state)=> state.auth);
  // console.log("productId",product)
  console.log("----loginUserDetails----",loginUserDetails)
  const [images , setImg]= useState("")

  useEffect(()=>{
  //   // dispatch(getmenuList())
    setValue("title",loginUserDetails.managerName)
    setValue("email",loginUserDetails.email) 
    setValue("phone",loginUserDetails.phone)
    // setValue("password",loginUserDetails.password)
    setImg(loginUserDetails.profileImage) 


  },[loginUserDetails])
  
  const handleBackClick =()=>{
    reset()
    navigate("/profile")
  }
  
  
  const FormValidationSchema = yup
    .object({
      title: yup.string().required("Name is required"),
      email: yup.string().required("email is required").email("Invalid email"),
      phone: yup.string().required("Phone is required").min(10).max(10),
    })
    .required();

  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  const handleUploadedFile = (event) => {
    const file = event.target.files[0];
    setImg(file)
  }

  const onSubmit = async(data) => {
    const formData = new FormData();
    formData.append("managerName",data.title.trim())
    formData.append("profileImage",images)
    formData.append("email",data.email.trim())
    formData.append("phone",data.phone)
    // formData.append("status",data.menuId.value)

    await dispatch(editManagerDetailsbyManager(formData));
    navigate("/profile")
  };

  return (
    <div>
      {/* <Modal
        title="Create New Product"
        labelclassName="btn-outline-dark"
        activeModal={openProjectModal}
        onClose={() => dispatch(toggleAddModal(false))}
      > */}
      <div className="flex items-center mb-3">
      <button className="" onClick={()=>navigate("/profile")}>
        <Icon icon="heroicons-outline:arrow-sm-left" className="w-[30px] h-[30px] mr-5"  />
      </button>
      <h5 className="">Edit Manager Details</h5>
      </div>
      {/* <h4 className="mb-3">Edit Manager Details</h4> */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          <Textinput
            name="title"
            label="Manager Name*"
            placeholder="Manager Name"
            register={register}
            error={errors.title}
          />
          <Textinput
            name="email"
            label="Email*"
            placeholder="Email*"
            register={register}
            error={errors.email}
          />
          <Textinput
            name="phone"
            label="Phone*"
            placeholder="Phone"
            register={register}
            error={errors.phone}
          />
           <label >
            <p className="mt-5">Manager Image</p>
            <ImageUpload  value={images} onChange={handleUploadedFile} />
          </label>
          {/* <div className={errors.assign ? "has-error" : ""}>
            <label className="form-label" htmlFor="icon_s">
              Category
            </label>
            <Controller
              name="menuId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={newMenu}
                  styles={styles}
                  className="react-select"
                  classNamePrefix="select"
                  // isMulti
                  components={{
                    Option: OptionComponent,
                  }}
                  id="icon_s"
                />
              )}
            />
            {errors.assign && (
              <div className=" mt-2  text-danger-500 block text-sm">
                {errors.assign?.message || errors.assign?.label.message}
              </div>
            )}
          </div> */}
           {/* <SplitDropdown
            classMenuItems="left-0 w-full top-[110%]"
            label="category"
            labelClass="btn-outline-primary"
            wrapperClass="block"
          /> */}
          {/* <div className="grid lg:grid-cols-2 gap-4 grid-cols-1">
            <FormGroup
              label="Start Date"
              id="default-picker"
              error={errors.startDate}
            >
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <Flatpickr
                    className="form-control py-2"
                    id="default-picker"
                    placeholder="yyyy, dd M"
                    value={startDate}
                    onChange={(date) => {
                      field.onChange(date);
                    }}
                    options={{
                      altInput: true,
                      altFormat: "F j, Y",
                      dateFormat: "Y-m-d",
                    }}
                  />
                )}
              />
            </FormGroup>
            <FormGroup
              label="End Date"
              id="default-picker2"
              error={errors.endDate}
            >
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <Flatpickr
                    className="form-control py-2"
                    id="default-picker2"
                    placeholder="yyyy, dd M"
                    value={endDate}
                    onChange={(date) => {
                      field.onChange(date);
                    }}
                    options={{
                      altInput: true,
                      altFormat: "F j, Y",
                      dateFormat: "Y-m-d",
                    }}
                  />
                )}
              />
            </FormGroup>
          </div> */}
          

          {/* <div className={errors.tags ? "has-error" : ""}>
            <label className="form-label" htmlFor="icon_s">
              Tag
            </label>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={options}
                  styles={styles}
                  className="react-select"
                  classNamePrefix="select"
                  isMulti
                  id="icon_s"
                />
              )}
            />
            {errors.assign && (
              <div className=" mt-2  text-danger-500 block text-sm">
                {errors.tags?.message || errors.tags?.label.message}
              </div>
            )}
          </div> */}
          {/* <Textarea label="Description" placeholder="Description" /> */}
          {/* <input type="file" placeholder="Select Image"/> */}
         
          <div className="ltr:text-right rtl:text-left">
            <button className="btn btn-dark  text-center" onClick={handleBackClick}>Cancel</button>
            <button className="btn btn-dark  text-center ml-[10px]">Update</button>
          </div>
        </form>
      {/* </Modal> */}
    </div>
  );
};

export default AddProducts;
