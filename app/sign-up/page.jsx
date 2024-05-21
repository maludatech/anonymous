"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuthContext } from "@app/hooks/useAuthContext";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const SignUp = () =>{
    //context management
  const{dispatch} = useAuthContext();
  const { user } = useAuthContext();
  const router = useRouter();

    useEffect(() => {
        // Check for the presence of a cookie indicating successful login
        const isLoggedIn = Cookies.get('isLoggedIn');
        
        if (user && isLoggedIn) {
          router.push('/generate-messages');
        }
      }, [user, router]);

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    firstName: "",
    lastName: ""
  });

  const togglePasswordVisibility = (type) => {
    if (type === 1) {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    } else {
      setShowPassword2((prevShowPassword2) => !prevShowPassword2);
    }
  };
     // set up yup validation
  const schema = yup.object().shape({
    email: yup.string().email().required("Email is required"),
    password: yup.string().min(8).max(15).required("Password is required"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), undefined], "Passwords do not match").required("Confirm password is required"),
    username: yup.string().min(6).max(10, "Username must be between 6-10 characters").required("Username is required"),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
  })

  //setup useform
  const{register, handleSubmit, formState: {errors}} = useForm({
    resolver: yupResolver(schema)
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
  setIsLoading(true);
  try {
    const response = await fetch("/api/user/sign-up", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      const { token } = responseData;
      localStorage.setItem("user", JSON.stringify(token));
      const decodedToken = decodeToken(token);
      dispatch({ type: "LOGIN", payload: decodedToken });
      setSuccessMessage("User signed up successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      router.push("/generate-messages")
    } else {
      // Handle sign-up failure
      const errorData = await response.json();
      const { message } = errorData;
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 3000);
      console.error("Sign-up failed:", message);
    }
  } catch (error) {
    console.error("Error during signup:", error);
  } finally {
    setIsLoading(false);
  }
};

    return (
        <section className="py-20 flex justify-center items-center">
          <form className="flex flex-col gap-3 glassmorphism_dark text-white font-poppins" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-1 pb-4">
              <h1 className="text-xl font-semibold text-start white_gradient">Create your Account</h1>
              <h4 className="text-lg font-semibold text-start">to continue to anonymous by Maluda</h4>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col gap-1">
                <label>First name</label>
                <input className="rounded-md w-full p-2 bg-slate-600" onChange={(e)=>setFormData({...formData, firstName:e.target.value})} {...register("firstName")}/>
                <p className="text-sm text-red-600">{errors.firstName?.message}</p>
              </div>
              <div className="flex flex-col gap-1">
                <label>Last name</label>
                <input className="rounded-md w-full p-2 bg-slate-600" onChange={(e)=>setFormData({...formData, lastName:e.target.value})} {...register("lastName")}/>
                <p className="text-sm text-red-600">{errors.lastName?.message}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label>username</label>
              <input className="rounded-md w-full p-2 bg-slate-600" onChange={(e)=>setFormData({...formData, username:e.target.value})} {...register("username")}/>
              <p className="text-sm text-red-600">{errors.username?.message}</p>
            </div>
            <div className="flex flex-col gap-1">
              <label>Email address</label>
              <input className="rounded-md w-full p-2 bg-slate-600" onChange={(e)=>setFormData({...formData, email:e.target.value})} {...register("email")}/>
              <p className="text-sm text-red-600">{errors.email?.message}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col gap-1">
                <label>Password</label>
                <div className="flex relative items-center">
                  <input className="rounded-md w-full p-2 bg-slate-600" onChange={(e)=>setFormData({...formData, password:e.target.value})} {...register("password")} type={showPassword ? 'text' : 'password'}/>
                  <FontAwesomeIcon className="absolute right-2 hover:cursor-pointer" icon={showPassword? faEyeSlash :faEye} onClick={()=>togglePasswordVisibility(1)}/>
                </div>
                <p className="text-sm text-red-600">{errors.password?.message}</p>
              </div>
              <div className="flex flex-col gap-1">
                <label>Confirm Password</label>
                <div className="flex relative items-center">
                  <input className="rounded-md w-full p-2 bg-slate-600" onChange={(e)=>setFormData({...formData, confirmPassword:e.target.value})} {...register("confirmPassword")}  type={showPassword2 ? 'text' : 'password'}/>
                  <FontAwesomeIcon className="absolute right-2 hover:cursor-pointer" icon={showPassword2? faEyeSlash :faEye} onClick={()=>togglePasswordVisibility(2)}/>
                </div>
                <p className="text-sm text-red-600">{errors.confirmPassword?.message}</p>
              </div>
            </div>
            <button className="p-2 my-2 bg-white text-black font-semibold rounded-lg uppercase hover:bg-slate-200" disabled={isLoading}>{isLoading? <FontAwesomeIcon icon={faSpinner} className="text-lg animate-spin text-slate-500"/> : "Continue"}</button>
            {errorMessage && <p className="p-1 bg-red-300 font-semibold rounded-md border-2 border-red-500 text-red-500">{errorMessage}</p>}
            {successMessage && <p className="p-1 bg-blue-300 font-semibold rounded-md border-2 border-blue-500 text-blue-500">{successMessage}</p>}
            <p>Have an account? <Link href={"/sign-in"} className="font-semibold hover:underline">Sign in</Link></p>
          </form>
        </section>
    )
};
export default SignUp;