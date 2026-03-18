import { X } from 'lucide-react';
import React, { createContext, useState, useContext } from 'react'
import Login from "../components/Forms/Login";
import Register from '../components/Forms/Register';
import ForgotPassword from '../components/Forms/Forgot';
// Create the context
const ModalContext = createContext({
  isOpen: false,
  modalContent: null,
  openModal: (content) => {},
  closeModal: () => {},
});

// Custom hook to easily consume the context
export const useModal = () => useContext(ModalContext)


export const ModalProvider = ({children}) => {
const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => {
    setModalContent(content);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalContent(null);
  }

  return (
    <>
    <ModalContext.Provider  value={{isOpen,modalContent,openModal,closeModal}}>
       {children}
      {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
      />

      {/* Modal */}
      <div className="relative z-[101] w-full max-w-lg mx-4 rounded-xl bg-white shadow-2xl p-3">
        {/* Header */}
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
        {/* Body */}
        <div className="px-5 pb-5 text-gray-700">
          {modalContent == "login" && <Login/>}
          {modalContent == "register" && <Register/>}
          {modalContent == "forgot" && <ForgotPassword/>}
        </div>

       
      </div>
    </div>
      )}


    </ModalContext.Provider>
    </>
  )
}

