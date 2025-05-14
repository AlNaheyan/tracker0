"use client"

import { useState } from "react"
import JobForm from "./components/JobForm"
import JobList from "./components/JobList"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { BriefcaseIcon, XMarkIcon } from "@heroicons/react/24/solid"

function App() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BriefcaseIcon className="h-8 w-8 text-emerald-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              tracker<span className="font-black">0</span>
            </h1>
          </div>
          <button
            onClick={openModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-sm flex items-center"
          >
            + Add New Job
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Your Job Applications</h2>
          <div className="text-sm text-gray-500">Track your career journey</div>
        </div>

        <JobList key={refreshKey} />
      </main>

      {/* Modal Backdrop */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeModal}
        >
          {/* Modal Content - Stop propagation to prevent closing when clicking inside the modal */}
          <div
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <BriefcaseIcon className="h-5 w-5 mr-2 text-emerald-600" />
                Add New Job
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 transition-colors">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <JobForm
                onSubmitSuccess={() => {
                  setRefreshKey((prev) => prev + 1)
                  closeModal()
                }}
              />
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

export default App
