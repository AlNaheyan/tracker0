"use client"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import {
  TrashIcon,
  BriefcaseIcon,
  CalendarIcon,
  MapPinIcon,
  LinkIcon,
  BuildingOfficeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline"

const statusColors = {
  APPLIED: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
  INTERVIEW: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200" },
  OFFER: { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" },
  REJECTED: { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" },
}

const jobTypeIcons = {
  FULL_TIME: <ClockIcon className="h-4 w-4" />,
  PART_TIME: <ClockIcon className="h-4 w-4" />,
  INTERNSHIP: <BriefcaseIcon className="h-4 w-4" />,
  CONTRACT: <BriefcaseIcon className="h-4 w-4" />,
}

const formatDate = (dateString) => {
  if (!dateString) return "—"
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export default function JobList() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL)
      const data = await res.json()
      setJobs(data.reverse()) // newest first
    } catch (err) {
      console.error(err)
      toast.error("Failed to fetch jobs ❌")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this job application?")) return
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error()
      toast.success("Job application deleted successfully")
      setJobs(jobs.filter((job) => job.id !== id))
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete job application")
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!jobs.length) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
        <div className="flex justify-center mb-4">
          <BriefcaseIcon className="h-16 w-16 text-gray-300" />
        </div>
        <h3 className="text-xl font-medium text-gray-700 mb-2">No job applications yet</h3>
        <p className="text-gray-500 mb-6">Start tracking your job search by adding your first application</p>
        <p className="text-sm text-gray-400">Click the "Add New Job" button to get started</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {jobs.map((job) => {
        const statusStyle = statusColors[job.status] || statusColors.APPLIED

        return (
          <div
            key={job.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative transition-all duration-200 hover:shadow-md group"
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={() => handleDelete(job.id)}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Delete job application"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-start gap-4">
              <div className={`rounded-lg p-3 ${statusStyle.bg} ${statusStyle.border}`}>
                <BuildingOfficeIcon className={`h-6 w-6 ${statusStyle.text}`} />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">{job.companyName}</h3>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    {job.status}
                  </span>
                </div>

                <p className="text-gray-700 font-medium mt-1">{job.role}</p>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {job.location || "No location specified"}
                  </div>

                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    Applied: {formatDate(job.applicationDate)}
                  </div>

                  <div className="flex items-center text-gray-600">
                    {jobTypeIcons[job.jobType] || <BriefcaseIcon className="h-4 w-4" />}
                    <span className="ml-2">{job.jobType.replace("_", " ").toLowerCase()}</span>
                  </div>
                </div>

                {job.links?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center mb-2">
                      <LinkIcon className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500">Links</span>
                    </div>
                    <div className="space-y-1">
                      {job.links.map((link, i) => (
                        <a
                          key={i}
                          href={link.startsWith("http") ? link : `https://${link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-800 hover:underline text-sm block truncate transition-colors duration-200"
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
