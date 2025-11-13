'use client';
import Modal from "./Modal";
import useSignupModal from "@/app/hooks/useSignupModal";
import { useState } from "react";
import CustomButton from "../forms/CustomButton";

const SignupModal = () => {
    const signupModal = useSignupModal();
    
    const content = (
        <>
            <form className="space-y-4">
                <input placeholder="Your Email" type="email" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl"/>
                <input placeholder="Your password" type="password" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl"/>
                <input placeholder="Repeat password" type="password" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl"/>

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
            isOpen={signupModal.isOpen}  //takes the variable isOpen from useLoginModal then pass it to Modal window here
            close={signupModal.close}
            label="Sign up"
            content={content}
            
        />
    )
}

export default SignupModal;