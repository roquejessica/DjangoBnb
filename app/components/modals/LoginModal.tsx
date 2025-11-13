'use client';
import Modal from "./Modal";
import useLoginModal from "../../hooks/useLoginModal";
import { useState } from "react";
import CustomButton from "../forms/CustomButton";

const LoginModal = () => {
    const loginModal = useLoginModal();
    
    const content = (
        <>
            <form className="space-y-4">
                <input placeholder="Your Email" type="email" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl"/>
                <input placeholder="Your Password" type="password" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl"/>

                    <div className="p-5 bg-airbnb text-white rounded-xl opacity-80">
                       The Error Message
                    </div>
                
                <CustomButton
                    label="Submit"
                    onClick={() => console.log("Test")}
                />
            </form>
        </>
    )
    return (
        <Modal
            isOpen={loginModal.isOpen}  //takes the variable isOpen from useLoginModal then pass it to Modal window here
            close={loginModal.close}
            label="Log in"
            content={content}
            
        />
    )
}

export default LoginModal;