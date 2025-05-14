"use client"

import { useState } from "react"
import JobForm from "./components/JobForm"
import JobList from "./components/JobList"
import { Bounce, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { BriefcaseIcon, XMarkIcon } from "@heroicons/react/24/solid"

function App() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BriefcaseIcon className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">
              tracker<span className="font-black">0</span>
            </h1>
          </div>
          <button
            onClick={openModal}
            className="bg-primary cursor-pointer hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm"
          >
            + Add New Job
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Your Job Applications</h2>
          <div className="text-sm text-muted-foreground">Track your career journey</div>
        </div>

        <JobList key={refreshKey} />
      </main>

      {/* Modal Backdrop */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-zinc-700/35 z-40 flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeModal}
        >
          {/* Modal Content - Stop propagation to prevent closing when clicking inside the modal */}
          <div
            className="bg-white rounded-lg border shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-background p-4 border-b flex justify-between items-center z-10">
              <h2 className="text-lg font-semibold text-foreground flex items-center">
                <BriefcaseIcon className="h-5 w-5 mr-2 text-primary" />
                Add New Job
              </h2>
              <button
                onClick={closeModal}
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <XMarkIcon className="h-5 w-5" />
                <span className="sr-only">Close</span>
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
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </div>
  )
}

export default App
