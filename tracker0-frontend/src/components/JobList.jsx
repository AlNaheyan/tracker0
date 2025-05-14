"use client"

import { useEffect, useState, useRef } from "react"
import { toast } from "react-toastify"
import {
  TrashIcon,
  BriefcaseIcon,
  CalendarIcon,
  MapPinIcon,
  LinkIcon,
  BuildingOfficeIcon,
  ClockIcon,
} from "@heroicons/react/24/solid"

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
  const [openDropdownId, setOpenDropdownId] = useState(null)
  const dropdownRefs = useRef({})

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL)
      const data = await res.json()
      setJobs(data.reverse()) // newest first
    } catch (err) {
      console.error(err)
      toast.error("Failed to fetch jobs, Please wait!")
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
      toast.success("Job deleted successfully")
      setJobs(jobs.filter((job) => job.id !== id))
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete job listing")
    }
  }

  // Handle clicks outside of dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (openDropdownId !== null) {
        const currentDropdownRef = dropdownRefs.current[openDropdownId]
        if (currentDropdownRef && !currentDropdownRef.contains(event.target)) {
          setOpenDropdownId(null)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openDropdownId])

  useEffect(() => {
    fetchJobs()
  }, [])

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!jobs.length) {
    return (
      <div className="bg-card rounded-lg shadow-sm p-12 text-center border">
        <div className="flex justify-center mb-4">
          <BriefcaseIcon className="h-16 w-16 text-muted-foreground/30" />
        </div>
        <h3 className="text-xl font-medium text-foreground mb-2">No job applications yet</h3>
        <p className="text-muted-foreground mb-6">Start tracking your job search by adding your first application</p>
        <p className="text-sm text-muted-foreground/70">Click the "Add New Job" button to get started</p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b text-xs font-medium text-muted-foreground">
        <div className="col-span-3">COMPANY & ROLE</div>
        <div className="col-span-2">STATUS</div>
        <div className="col-span-2">LOCATION</div>
        <div className="col-span-2">APPLIED</div>
        <div className="col-span-2">TYPE</div>
        <div className="col-span-1 text-right">ACTIONS</div>
      </div>

      {/* Table Body */}
      <div className="divide-y">
        {jobs.map((job) => {
          const statusStyle = statusColors[job.status] || statusColors.APPLIED
          const dropdownId = `dropdown-${job.id}`
          const isDropdownOpen = openDropdownId === dropdownId

          return (
            <div key={job.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/20 transition-colors">
              {/* Company & Role */}
              <div className="col-span-3 flex items-center gap-3">
                <div className={`rounded-md p-1.5 ${statusStyle.bg} ${statusStyle.border} shrink-0`}>
                  <BuildingOfficeIcon className={`h-5 w-5 ${statusStyle.text}`} />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-foreground">{job.companyName}</h3>
                  <p className="text-xs text-muted-foreground">{job.role}</p>
                </div>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <span
                  className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}
                >
                  {job.status}
                </span>
              </div>

              {/* Location */}
              <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                <MapPinIcon className="h-4 w-4 mr-1.5 text-muted-foreground/70 shrink-0" />
                <span className="truncate">{job.location || "No location"}</span>
              </div>

              {/* Applied Date */}
              <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4 mr-1.5 text-muted-foreground/70 shrink-0" />
                <span>{formatDate(job.applicationDate)}</span>
              </div>

              {/* Job Type */}
              <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                {jobTypeIcons[job.jobType] || <BriefcaseIcon className="h-4 w-4 shrink-0" />}
                <span className="ml-1.5 truncate">
                  {job.jobType
                    .replace("_", " ")
                    .toLowerCase()
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-1 flex justify-end items-center gap-2">
                {job.links?.length > 0 && (
                  <div className="relative" ref={(el) => (dropdownRefs.current[dropdownId] = el)}>
                    <button
                      onClick={() => toggleDropdown(dropdownId)}
                      className={`p-1.5 rounded-md transition-colors ${
                        isDropdownOpen
                          ? "text-primary bg-muted"
                          : "text-muted-foreground hover:text-primary hover:bg-muted"
                      }`}
                    >
                      <LinkIcon className="h-4 w-4 cursor-pointer" />
                    </button>

                    {/* Links Dropdown */}
                    {isDropdownOpen && (
                      <div className="absolute bg-white right-0 mt-1 w-64 bg-card rounded-md shadow-lg border px-3 py-2 z-10">
                        <div className="text-xs font-medium text-muted-foreground mb-1.5">Links</div>
                        <div className="space-y-1">
                          {job.links.map((link, i) => (
                            <a
                              key={i}
                              href={link.startsWith("http") ? link : `https://${link}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline cursor-pointer text-sm flex items-center gap-1.5"
                            >
                              <span className="truncate">{link}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleDelete(job.id)}
                  className="p-1.5 rounded-md text-muted-foreground cursor-pointer hover:text-red-600 hover:bg-zinc-100 transition-colors"
                  aria-label="Delete job application"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
