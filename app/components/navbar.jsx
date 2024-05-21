"use client"

import { useAuthContext } from "@app/hooks/useAuthContext";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faUserSecret } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useState, useEffect } from "react";

const Navbar = () => {
  const {user, dispatch} = useAuthContext();

  const [toggleDropdown, setToggleDropDown] = useState(false);

  const logout = () =>{
    //dipatch logout action
    dispatch({type: "LOGOUT"})
  }

  return (
    <div className="fixed top-0 w-full h-fit py-3 px-5 flex justify-between z-10 bg-black border-b-2 border-gray-500">
      <Link href={"/"} className="gray_gradient flex gap-1">
        <FontAwesomeIcon icon={faUserSecret} className="text-gray-400 text-xl w-6 h-6" />
        <span className="text-xl">Maluda's Anonymous</span>
      </Link>

      {/* Desktop Navigation */}
      {user ? (
        <div className="sm:flex gap-4 hidden text-xl white_gradient px-2 items-center">
          <Link href={"/"} className="hover:scale-105">
            Home
          </Link>
          <Link href={"/profile"} className="hover:scale-105">
            Profile
          </Link>
          <Link href={"/messages"} className="hover:scale-105">
            Messages
          </Link>
          <Link href={"/generate-messages"} className="hover:scale-105">
            Generate Messages
          </Link>
          <button
            className="hover:scale-105 hover:bg-white hover:border-black hover:text-black p-1 border-2 border-white text-white rounded-lg text-center text-lg font-inter flex items-center justify-center"
            onClick={()=>logout()}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="sm:flex gap-4 hidden text-xl white_gradient px-2 items-center">
          <Link href={"/"} className="hover:scale-105">
            Home
          </Link>
          <Link href={"/sign-in"} className="hover:scale-105 hover:bg-white hover:border-black hover:text-black p-1 border-2 border-white text-white rounded-lg text-center text-lg font-inter flex items-center justify-center">
            Sign In
          </Link>
          <Link href={"/sign-up"} className="hover:scale-105 hover:bg-white hover:border-black hover:text-black p-1 border-2 border-white text-white rounded-lg text-center text-lg font-inter flex items-center justify-center">
            Register
          </Link>
        </div>
      )}

      {/* Mobile navigation */}
      <div className="flex sm:hidden gap-3">
        <div className="flex gap-2 items-center">
        {user && (
          <Image
            src={user.imageUrl || "/assets/images/empty-image.png"}
            width={32}
            height={32}
            alt="user image"
            className="rounded-full border-2 border-gray-400"
          />
        )}
        <FontAwesomeIcon icon={toggleDropdown ? faXmark : faBars} onClick={() => setToggleDropDown((prev) => !prev)} className="text-2xl h-6 hover:cursor-pointer text-gray-500" />
        </div>
        {toggleDropdown && (
          user ? (
            <div className="glassmorphism dropdown text-lg">
              <Link href={"/"} className="white_gradient hover:scale-105" onClick={() => setToggleDropDown((prev) => !prev)}>
                Home
              </Link>
              <Link href={"/profile"} className="white_gradient hover:scale-105" onClick={() => setToggleDropDown((prev) => !prev)}>
                Profile
              </Link>
              <Link href={"/messages"} className="white_gradient hover:scale-105" onClick={() => setToggleDropDown((prev) => !prev)}>
                Messages
              </Link>
              <Link href={"/generate-messages"} className="white_gradient hover:scale-105" onClick={() => setToggleDropDown((prev) => !prev)}>
                Generate Messages
              </Link>
              <button
                className="white_gradient hover:scale-105 outline_btn font-bold"
                onClick={() => {
                  logout();
                  setToggleDropDown((prev) => !prev);
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="glassmorphism dropdown text-lg">
              <Link href={"/"} className="white_gradient hover:scale-105" onClick={() => setToggleDropDown((prev) => !prev)}>
                Home
              </Link>
              <Link href={"/sign-in"} className="outline_btn hover:scale-105" onClick={() => setToggleDropDown((prev) => !prev)}>
                Sign In
              </Link>
              <Link href={"/sign-up"} className="black_btn hover:scale-105" onClick={() => setToggleDropDown((prev) => !prev)}>
                Register
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Navbar;
