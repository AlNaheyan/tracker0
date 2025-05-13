"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import {
  BuildingOfficeIcon,
  BriefcaseIcon,
  MapPinIcon,
  CalendarIcon,
  LinkIcon,
  ClockIcon,
} from "@heroicons/react/24/outline"

const initialState = {
  companyName: "",
  role: "",
  jobType: "FULL_TIME",
  location: "",
  status: "APPLIED",
  applicationDate: "",
  links: "",
}

const jobTypeOptions = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "INTERNSHIP", label: "Intern" },
  { value: "CONTRACT", label: "Contract" },
]

const statusOptions = [
  { value: "APPLIED", label: "Applied", color: "bg-blue-100 text-blue-800" },
  { value: "INTERVIEW", label: "Interview", color: "bg-purple-100 text-purple-800" },
  { value: "OFFER", label: "Offer", color: "bg-green-100 text-green-800" },
  { value: "REJECTED", label: "Rejected", color: "bg-red-100 text-red-800" },
]

export default function JobForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState(initialState)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...formData,
      links: formData.links
        .split(",")
        .map((link) => link.trim())
        .filter(Boolean),
    }

    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to submit")

      toast.success("Job application added successfully! ✅")
      setFormData(initialState)
      onSubmitSuccess?.()
    } catch (err) {
      console.error(err)
      toast.error("Error submitting job application ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <BuildingOfficeIcon className="h-4 w-4 mr-1 text-gray-500" />
            Company Name
          </label>
          <input
            name="companyName"
            placeholder="e.g. Acme Inc."
            value={formData.companyName}
            onChange={handleChange}
            required
            className="p-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <BriefcaseIcon className="h-4 w-4 mr-1 text-gray-500" />
            Role
          </label>
          <input
            name="role"
            placeholder="e.g. Frontend Developer"
            value={formData.role}
            onChange={handleChange}
            required
            className="p-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" />
            Location
          </label>
          <input
            name="location"
            placeholder="e.g. Remote, New York"
            value={formData.location}
            onChange={handleChange}
            required
            className="p-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
            Application Date
          </label>
          <input
            name="applicationDate"
            type="date"
            value={formData.applicationDate}
            onChange={handleChange}
            className="p-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
            Job Type
          </label>
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="p-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white"
          >
            {jobTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <div className="grid grid-cols-2 gap-2">
            {statusOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-center p-2 rounded-lg cursor-pointer border transition-all duration-200 ${
                  formData.status === option.value
                    ? `${option.color} border-transparent`
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  checked={formData.status === option.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-1">
        <label className="text-sm font-medium text-gray-700 flex items-center">
          <LinkIcon className="h-4 w-4 mr-1 text-gray-500" />
          Links (comma separated)
        </label>
        <input
          name="links"
          placeholder="e.g. https://job-posting.com, https://company.com"
          value={formData.links}
          onChange={handleChange}
          className="p-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
        />
        <p className="text-xs text-gray-500 mt-1">Add job posting URL, company website, etc.</p>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-lg w-full font-semibold transition-all duration-200 transform hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-sm"
        >
          {loading ? "Submitting..." : "Submit Job Application"}
        </button>
      </div>
    </form>
  )
}
