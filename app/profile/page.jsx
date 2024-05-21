"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@app/hooks/useAuthContext';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { jwtDecode } from 'jwt-decode';

const Profile = () => {
  const { user, dispatch } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = Cookies.get('isLoggedIn');
    if (!user && !isLoggedIn) {
      router.push('/sign-in');
    }
  }, [user, router]);

  const schema = yup.object().shape({
    password: yup.string().min(8).max(15).required("Password is required"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), undefined], "Passwords do not match").required("Confirm password is required"),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const togglePasswordVisibility = (type) => {
    if (type === 1) {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    } else {
      setShowPassword2((prevShowPassword2) => !prevShowPassword2);
    }
  };


  
  const decodeToken = (token) => {
    try {
        const decoded = jwtDecode(token);  // Use jwtDecode from jwt-decode
        return decoded;
    } catch (error) {
        console.error("Error decoding token: ", error);
        return null;
    }
};

  const onSubmit = async (data) => {
    try {
      console.log("Frontend profile formdata: ", data);
      setIsLoading(true);
      const response = await fetch("/api/user/profile-update", {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setIsLoading(false);
        const { message, token } = responseData;
        setSuccessMessage(message);
        setTimeout(()=>setSuccessMessage(""),3000);
        localStorage.setItem("user", JSON.stringify({ ...user, firstName: data.firstName, lastName: data.lastName }));
        const decodedToken = decodeToken(token);
        dispatch({ type: "LOGIN", payload: decodedToken });
      } else {
        const errorData = await response.json();
        const { message } = errorData;
        setErrorMessage(message);
        setTimeout(()=>setErrorMessage(""),3000);
        console.error("Update failed:", message);
      }
    } catch (error) {
      console.error("Error during profile update:", error);
    }
  };

  if (user) {
    return (
      <section className="py-20 flex flex-col sm:flex-row justify-center w-full">
        <div className="flex items-center justify-center p-5 w-full">
          <div className='flex flex-col lg:flex-row gap-2 w-full'>
            <div className='lg:w-1/3 pb-6 sm:pb-2'>
              <h1 className="text-3xl font-poppins font-bold white_gradient">Profile</h1>
              <h2 className='text-xl font-bold'>General Setting</h2>
              <h3 className='text-lg text-gray-500'>Profile configuration settings</h3>
            </div>

            <form className='glassmorphism_dark flex flex-col gap-3 lg:w-full shadow-xl shadow-gray-500' onSubmit={handleSubmit(onSubmit)}>
              <p className='font-poppins font-bold text-xl'>Basic Information</p>
              <div className='flex items-center'>
                <p className='first-letter:uppercase font-semibold w-1/3 text-gray-400'>Username</p>
                <input type="text" className='p-3 border-2 rounded-lg bg-slate-700 border-gray-500 w-full' value={user.username} readOnly />
              </div>
              <div className='flex items-center'>
                <p className='first-letter:uppercase font-semibold w-1/3 text-gray-400'>Email</p>
                <input type="text" className='p-3 border-2 rounded-lg bg-slate-700 border-gray-500 w-full' value={user.email} {...register("email")} readOnly />
              </div>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center'>
                  <p className='first-letter:uppercase font-semibold w-1/3 text-gray-400'>First Name</p>
                  <input type="text" className='p-3 border-2 rounded-lg bg-slate-600 border-gray-500 w-full' defaultValue={user.firstName} {...register("firstName")} />
                </div>
                <p className="text-sm text-red-600 font-poppins italic">{errors.firstName?.message}</p>
              </div>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center'>
                  <p className='first-letter:uppercase font-semibold w-1/3 text-gray-400'>Last Name</p>
                  <input type="text" className='p-3 border-2 rounded-lg bg-slate-600 border-gray-500 w-full' defaultValue={user.lastName} {...register("lastName")} />
                </div>
                <p className="text-sm text-red-600 font-poppins italic">{errors.lastName?.message}</p>
              </div>

              <div className='flex-col gap-1 flex'>
                <div className='flex items-center w-full'>
                  <p className='first-letter:uppercase font-semibold w-1/3 text-gray-400'>New Password</p>
                  <div className='flex items-center gap-1 w-full'>
                    <input className='p-3 border-2 relative rounded-lg bg-slate-600 border-gray-500 w-full' 
                      type={showPassword ? 'text' : 'password'} {...register("password")} />
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} onClick={() => togglePasswordVisibility(1)} className="hover:cursor-pointer absolute right-7 text-gray-300 hover:text-black" />
                  </div>
                </div>
                <p className="text-sm text-red-600 font-poppins italic">{errors.password?.message}</p>
              </div>
              <div className='flex-col gap-1 flex'>
                <div className='flex items-center w-full'>
                  <p className='first-letter:uppercase font-semibold w-1/3 text-gray-400'>Confirm Password</p>
                  <div className='flex items-center gap-1 w-full'>
                    <input className='p-3 border-2 relative rounded-lg bg-slate-600 border-gray-500 w-full'  
                      type={showPassword2 ? 'text' : 'password'} {...register("confirmPassword")} />
                    <FontAwesomeIcon icon={showPassword2 ? faEyeSlash : faEye} onClick={() => togglePasswordVisibility(2)} className="hover:cursor-pointer absolute right-7 text-gray-300 hover:text-black" />
                  </div>
                </div>
                <p className="text-sm text-red-600 font-poppins italic">{errors.confirmPassword?.message}</p>
              </div>
              <button className='text-white bg-blue-500 sm:text-lg text-[15px] font-semibold w-fit p-2 font-poppins rounded-md hover:bg-blue-600 px-3 mt-6' disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Account"}
              </button>
              {errorMessage && <p className="p-2 bg-red-300 font-semibold rounded-md border-2 border-red-500 text-red-500">{errorMessage}</p>}
              {successMessage && <p className="p-2 bg-green-300 font-semibold rounded-md border-2 border-green-600 text-green-600">{successMessage}</p>}
            </form>
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default Profile;
