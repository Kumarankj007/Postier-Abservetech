'use client'
import React, { useContext, useEffect, useState } from 'react';
import UserStore from '../store/profile';
import { useMutation } from '@tanstack/react-query';
import { UserUpdate } from '../tools/mutatefn/userdetails';
import useSnackbarStore from '../store/toaster';
import UseLoadingRouter from "../hooks/useLoadingRoutes";
import Image from 'next/image';
import PageContext from "@/app/providers/pagecontext";

// const ProfilePicture = ({avatar,onData}:any) => {
//   const { user } = UserStore()
//    const  router  = UseLoadingRouter();
//   const [previewImage, setPreviewImage] = useState('');
//   const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
//   const handleImageChange = (e: any) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader: any = new FileReader();
//       reader.onloadend = () => {
//         setPreviewImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//       onData(file);
//     }
//   };
//   // const uploadImage =  (file:any) => {
//   //   const formData = new FormData();
//   //   formData.append('profile', file);
//   //   if(formData){
//   //     Profile.mutateAsync(formData)
//   //   }
//   // }
//   // const Profile = useMutation({
//   //   mutationFn: UserUpdate,
//   //   onSuccess: (data) => {
//   //     showSnackbar(data.data.message, "success");
//   //   },
//   //   onError: (err) => {
//   //     showSnackbar(err.message, "error");
//   //   }
//   // })


//   useEffect(() => {
//     if (user?.profile?.startsWith('https') && avatar === null) {
//       setPreviewImage(user.profile);
//     } else if(avatar !== null) {
//       setPreviewImage(avatar)
//     }
//     else{
//       setPreviewImage(user?.profile ? process.env.NEXT_PUBLIC_IMAGE_URL + user.profile : '/png/profile.png');
//     }
//   }, [user,avatar])
//   return (
//     <label className="bg-[#F0F0F0] w-[130px] h-[130px] flex items-center justify-center cursor-pointer">
//     <div className="relative flex items-center">
//       <img src={previewImage} alt="Preview" className="w-[130px] h-[130px]" />
//       <img
//         src="/svg/icon/edit_square.svg"
//         alt="UploadFile"
//         className="absolute right-[-10px] top-[-10px] w-6 h-6"
//       />
//       <input
//         type="file"
//         id="fileInput"
//         className="hidden"
//         onChange={handleImageChange}
//         accept="image/*"
//       />
//     </div>
//   </label>
//   );
// };
const ProfilePicture = () => {
  const { i18 } = useContext(PageContext);
  const { user,setUser } = UserStore()
  const [profiles,setFile] = useState<any>({})
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
          uploadImage(file);
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
  const uploadImage =  (file:any) => {
    const formData = new FormData();
    formData.append('file', file);
    if(formData){
      // console.log(formData, 'formData')
      Profile.mutateAsync(formData)
    }
    Profile.mutateAsync(formData);
  }
  const Profile = useMutation({
    mutationFn: UserUpdate,
    onSuccess: (data) => {
      showSnackbar(data.data.message, "success");
      setUser(data.data.user)
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    }
  })


  useEffect(() => {
    if (user?.profile?.startsWith('https')) {
      setPreviewImage(user.profile);
    }
    else{
      setPreviewImage(user?.profile ? process.env.NEXT_PUBLIC_IMAGE_URL + user.profile : '/png/profile.png');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])
  // console.log('previewImage',previewImage)
  return (
    <label className="p-8  h-[100px] flex items-center justify-between cursor-pointer">
      <div className="relative flex items-center">
        <Image width={600} height={600} src={`${previewImage}`} alt="Preview" className=" w-20 h-20 rounded-full object-cover" />
      </div>
      <div>
      <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={handleImageChange}
          accept="image/*"
        />
        <p className='bg-[#fff] text-[17px] font-[400] leading-[22px] underline cursor-pointer'>{i18?.NEW?.UPDATE || "Update"}</p>
      </div>
    </label>
  )
}
export default ProfilePicture;
