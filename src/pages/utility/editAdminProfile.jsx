import React, { useState,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Textinput from "@/components/ui/Textinput";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup"
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import {editAdminDetails} from "../auth/common/store"
import Card from "../../components/ui/Card";

// import Select, { components } from "react-select";
// import ImageUpload from "@/components/ui/ImageUpload";

const AddProducts = () => {
  const { loginUserDetails } = useSelector((state)=> state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [images , setImg]= useState("")
//   const { managerDetails } = useSelector((state) => state.provider);

//   useEffect(()=>{
//     setValue("title",managerDetails.managerName)
//     setValue("email",managerDetails.email) 
//     setValue("phone",managerDetails.phone)
//     setValue("password",managerDetails.password)
//     setImg(managerDetails.profileImage) 
//     {managerDetails.status ===  true? 
//     setValue("menuId", {label: 'Active' , value: 'active'})
//     :
//     setValue("menuId", {label: 'InActive' , value: 'inactive'})}

//   },[managerDetails])
  
  const handleBackClick =()=>{
    reset()
    navigate("/profile")
  }

  useEffect(()=>{
    setValue("title",loginUserDetails.firstname)
    setValue("title1",loginUserDetails.lastname)
    setValue("email",loginUserDetails.email)
    setValue("phone",loginUserDetails.phone)
  },[loginUserDetails])
  

  const FormValidationSchema = yup
    .object({
      title: yup.string().required("First Name is required"),
      title1: yup.string().required("Last Name is required"),
      email: yup.string().required("email is required").email("Invalid email"),
      phone: yup.string().required("Phone is required"),
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
    console.log(data)
    const formData = new FormData();
    formData.append("firstname",data.title)
    formData.append("lastname",data.title1)
    formData.append("email",data.email)
    formData.append("phone",data.phone)
    // formData.append("profileImage",images)
    // reset();
    // setImg("")
    // navigate("/admin/Manager")
    dispatch(editAdminDetails(formData))
    
    navigate("/profile")
  };

  return (
    <Card>
      <div className="flex items-center mb-3">
      <button className="" onClick={()=>navigate("/profile")}>
        <Icon icon="heroicons-outline:arrow-sm-left" className="w-[30px] h-[30px] mr-5"  />
      </button>
      <h5 className="">Edit Admin Details</h5>
      </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          <Textinput
            name="title"
            label="First Name*"
            placeholder="First Name"
            register={register}
            error={errors.title}
          />
          <Textinput
            name="title1"
            label="Last Name*"
            placeholder="Last Name"
            register={register}
            error={errors.title1}
          />
          <Textinput
            name="email"
            label="Email*"
            placeholder="Email"
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
           {/* <div className="w-[100px]" >
            <p className="mt-5">Admin Image</p>
            <ImageUpload  value={images} onChange={handleUploadedFile} />
          </div> */}
          <div className="ltr:text-right rtl:text-left">
            <button className="btn btn-dark  text-center" onClick={handleBackClick}>Cancel</button>
            <button className="btn btn-dark  text-center ml-[10px]">Save</button>
          </div>
        </form>
    </Card>
  );
};

export default AddProducts;
