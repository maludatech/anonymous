"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useAuthContext } from "@app/hooks/useAuthContext";

const SignIn = () => {

  const router = useRouter();
  const { user } = useAuthContext(); // Access the user state from context
  const {dispatch} = useAuthContext();

  useEffect(() => {
    // Check for the presence of a cookie indicating successful login
    const isLoggedIn = Cookies.get('isLoggedIn');

    // If the user is not logged in and the cookie is not present, redirect to sign-in page
    if (user && isLoggedIn) {
      router.push('/generate-messages');
    }
  }, [user, router]);

  // set up yup validation
  const schema = yup.object().shape({
    email: yup.string().email().required("email is required"),
    password: yup.string().min(8).max(15).required("Password is required"),
  });

  //setup useform
  const{register, handleSubmit, formState: {errors}} = useForm({
    resolver: yupResolver(schema)
  });

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        email:"",
        password:""
    });

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
        setIsLoading(true);
        const response = await fetch("/api/user/sign-in", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "content-type": "application/json",
          },
        });
        if (response.ok) {
          const { token} = await response.json();
          localStorage.setItem("user", JSON.stringify(token));
          const decodedToken = decodeToken(token);
          dispatch({ type: "LOGIN", payload: decodedToken });
          router.push("/generate-messages");
        } else {
          const errorData = await response.json();
          const { message } = errorData;
          setErrorMessage(message);
          console.error("Signin failed:", message);
        }
      } catch (error) {
        console.log("Error during signin: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
      };

  return (
    <section className="py-20 flex justify-center items-center">
    <form className="flex flex-col gap-3 glassmorphism_dark text-white font-poppins" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-1 pb-4">
        <h1 className="text-xl font-semibold text-start white_gradient">Sign in</h1>
        <h4 className="text-lg font-semibold text-start">to continue to anonymous by Maluda</h4>
      </div>
      
      <div className="flex flex-col gap-1">
        <label>Email address</label>
        <input className="rounded-md w-full p-2 bg-slate-600" onChange={(e)=>setFormData({...formData, email:e.target.value})} {...register("email")}/>
        <p className="text-sm text-red-600">{errors.email?.message}</p>
      </div>
        <div className="flex flex-col gap-1">
          <label>Password</label>
          <div className="flex relative items-center">
            <input className="rounded-md w-full p-2 bg-slate-600" onChange={(e)=>setFormData({...formData, password:e.target.value})} {...register("password")} type={showPassword ? 'text' : 'password'}/>
            <FontAwesomeIcon className="absolute right-2 hover:cursor-pointer" icon={showPassword? faEyeSlash :faEye} onClick={()=>togglePasswordVisibility()}/>
          </div>
          <p className="text-sm text-red-600">{errors.password?.message}</p>
        </div>
      <button className="p-2 my-2 bg-white text-black font-semibold rounded-lg uppercase hover:bg-slate-200" disabled={isLoading}>{isLoading? <FontAwesomeIcon icon={faSpinner} className="text-lg animate-spin text-slate-500"/> : "Continue"}</button>
      {errorMessage && <p className="p-1 bg-red-300 font-semibold rounded-md border-2 border-red-500 text-red-500">{errorMessage}</p>}
      <p className="mt-1">No account? <Link href={"/sign-up"} className="font-semibold hover:underline">Sign up</Link></p>
    </form>
  </section>
  )
}

export default SignIn;