'use client';

import {useState, useEffect, useCallback} from 'react'

interface ModalProps {  //to make the modal dynamic and not just have a static input
    label: string   // STEP 1
    close: () => void
    content: React.ReactElement;  // pass in content to be able to use HTML then render it in the section below
    isOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({  //pass the ModalProps interface to the Modal component
    label,  // STEP 2: pass in the label here which would be the title of the modal STEP 3: then use the label in the header below STEP 4:then go to layout then pass in the label there
    content,
    isOpen,
    close
}) => {
    const [showModal, setShowModal] = useState(isOpen)

    useEffect(() => {
        setShowModal(isOpen)
    }, [isOpen])  //if this value changes from true-false or false-true, the useEffect func will run

    //useCallback is from django which is sort of like caching the result to prevent the modal from being re-rendered
    const handleClose = useCallback(() => {
        setShowModal(false);
    
    //after 300ms the timeout is run, call func is called
    //300ms is needed because the translate-y-full opacity-10 needs 300ms to move it out of the screen
        setTimeout(() => {
            close();
        }, 300)
    }, [close])

    if (!isOpen) {
        return null;
    }

    return (
        <div className="flex items-center justify-center fixed inset-0 z-50 bg-black/60">
            <div className="relative w-[90%] md:w[80%] lg:w-[700px] my-6 mx-auto h-auto">
                <div className={`translate duration-600 h-full ${showModal ? 'translate-y-0 opacity-100': 'translate-y-full opacity-10'}`}>
                    <div className="w-full h-auto rounded-xl relative flex flex-col bg-white">
                        
                        <header className="h-[60px] flex items-center p-6 rounded-t justify-center relative border-b border-gray-200">
                            <div className="p-3 absolute left-3 hover:bg-gray-300 rounded-full cursor-pointer">
                                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </div>

                            <h2 className="text-lg font-bold">{label}</h2>
                        </header>  

                        <section className="p-6 ">
                            {content}   
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal
 