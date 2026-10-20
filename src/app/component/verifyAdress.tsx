'use client'
import React, { useEffect, useState } from 'react';
import UserStore from '../store/profile';
import { useMutation } from '@tanstack/react-query';
import { UserUpdate } from '../tools/mutatefn/userdetails';
import useSnackbarStore from '../store/toaster';
import UseLoadingRouter from "../hooks/useLoadingRoutes";
import Image from 'next/image';

const VerifyUser = ({avatar,onData}:any) => {
  const { user } = UserStore()
   const  router  = UseLoadingRouter();
  const [previewImage, setPreviewImage] = useState('');
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
        if (!file) return;

        // Allow only image formats
        if (!file.type.startsWith("image/")) {
            showSnackbar("Please select a valid image file.", "error");
            e.target.value = "";
            return;
        }

        // 10MB size limit
    const maxSize = 10 * 1000 * 1024; // 10 MB
        if (file.size > maxSize) {
            showSnackbar("File size must be less than 10MB.", "error");
            e.target.value = "";
            return;
        }
    if (file) {
      const reader = new FileReader();
      reader.onload = (val) => {
        const img = document.createElement("img");
        img.onload = () => {
          // Image loaded successfully (valid image data)
          setPreviewImage(reader?.result as string);
        };
        img.onerror = () => {
          // Image failed to load (corrupt or not an actual image file)
          showSnackbar("Please select a valid image file.", "error");
          e.target.value = "";
          return;
        };
        img.src = val?.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };
  // const uploadImage =  (file:any) => {
  //   const formData = new FormData();
  //   formData.append('profile', file);
  //   if(formData){
  //     Profile.mutateAsync(formData)
  //   }
  // }
  // const Profile = useMutation({
  //   mutationFn: UserUpdate,
  //   onSuccess: (data) => {
  //     showSnackbar(data.data.message, "success");
  //   },
  //   onError: (err) => {
  //     showSnackbar(err.message, "error");
  //   }
  // })


//   useEffect(() => {
   
//       setPreviewImage(previewImage ? previewImage : '/svg/icon/sendng.svg');
//   }, [user])
  return (
    <label className="bg-[#F0F0F0] w-[130px] h-[130px] flex items-center justify-center cursor-pointer">
    <div className="relative flex items-center">
        {
            previewImage ? 
             <Image width={20} height={20} src={previewImage} alt="Preview" className="w-[130px] h-[130px]" />
             :
             <Image width={20} height={20} src='/svg/icon/sendng.svg' alt="Preview" className="w-[30px] h-[30px]" />
        }
      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={handleImageChange}
        accept="image/*"
      />
    </div>
  </label>
  );
};

export default VerifyUser;
