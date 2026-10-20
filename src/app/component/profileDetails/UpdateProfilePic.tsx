/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Button from '../button';
import { ProfileAvatar } from '../../../../content';
import ProfilePicture from '../profilepicture';
import { useMutation } from '@tanstack/react-query';
import { UserUpdate } from '@/app/tools/mutatefn/userdetails';
import useSnackbarStore from '@/app/store/toaster';
import UserStore from '@/app/store/profile';
import { fetchUser } from '@/app/tools/queryfn/fetch';
import UseLoadingRouter from '@/app/hooks/useLoadingRoutes';
import PageContext from "@/app/providers/pagecontext";

const UpdateProfilePic = () => {
  const { i18 } = useContext(PageContext);
  const router = UseLoadingRouter();
  const { setUser } = UserStore()
  const [avatar, setAvatar] = useState('')
  const [profiles, setFile] = useState<any>({})
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const handleavatar = (index: any) => {
    setAvatar(index.img)
  }
  const uploadImage = (file: any) => {
    setFile(file)
  }

  const FetchProfile = async () => {
    const res: any = await fetchUser()
    if (res) {
      setUser(res.profile)
    }
  }
  const Profile = useMutation({
    mutationFn: UserUpdate,
    onSuccess: (data) => {
      // console.log('step2')
      showSnackbar(data.data.message, "success");
      FetchProfile()
      router.push('/profileDetails')
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    }
  })
  const onSubmit = async () => {
    let formData = new FormData();
    if (profiles) {
      formData.append('file', profiles);
    }
    if (avatar) {
      const blob = await fetch(avatar).then(response => response.blob());

      formData.append('file', blob, 'image.jpg');
    }
    // console.log('step1')
    Profile.mutateAsync(formData)
  }
  return (
    <div className='p-6'>
      <div className='flex flex-col items-center gap-4 md:gap-8 mt-4 mb-4 md:mt-12 md:mb-12'>
        <h1 className='font-bold text-2xl md:text-4xl text-center'>{i18?.NEW?.UPLOAD_PROFILE_PICTURE || "Upload Your Profile Picture"} <br />({i18?.NEW?.OR || "or"}) {i18?.NEW?.PICK_DEFAULT_AVATAR || "Pick An Default Avatar"}</h1>
        <div className='flex justify-center items-center w-full md:w-[365px] h-[245px] border border-radius rounded-lg shadow'>
          <div className='flex flex-col items-center gap-4'>
            {/* <ProfilePicture avatar= {avatar !=='' ? avatar : null} onData={uploadImage} /> */}
            <p className='font-normal text-sm'>{i18?.NEW?.UPLOAD_PROFILE_PICTURE_ALT || "Upload Your Profile Picture"}</p>
          </div>
        </div>
        <div>
          <p className='font-bold text-2xl'>{i18?.NEW?.AVATARS || "Avatars"}</p>
        </div>
        <div className="flex flex-wrap justify-center cursor-pointer">
          <Stack direction="row" spacing={2}>
            {ProfileAvatar.map((index: any) => (
              <>
                <Avatar
                  key={index}
                  alt={`Avatar ${index}`}
                  src={index?.img}
                  sx={{ width: '60px', height: '60px' }}
                  onClick={() => handleavatar(index)}
                />
              </>

            ))}
          </Stack>

        </div>
        <div className="mt-4 md:mt-6">
          <Button className='w-full md:w-44 px-6 py-4 bg-btncolor rounded-[7px] text-[#fff] cursor-pointer' onClick={onSubmit} >{i18?.NEW?.UPLOAD_SAVE || "Upload & Save"}</Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfilePic;
