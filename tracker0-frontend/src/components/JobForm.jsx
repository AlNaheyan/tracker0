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

      toast.success("Job listing added successfully!")
      setFormData(initialState)
      onSubmitSuccess?.()
    } catch (err) {
      console.error(err)
      toast.error("Error submitting job listing!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center">
            <BuildingOfficeIcon className="h-4 w-4 mr-1 text-muted-foreground" />
            Company Name
          </label>
          <input
            name="companyName"
            placeholder="e.g. Acme Inc."
            value={formData.companyName}
            onChange={handleChange}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center">
            <BriefcaseIcon className="h-4 w-4 mr-1 text-muted-foreground" />
            Role
          </label>
          <input
            name="role"
            placeholder="e.g. Frontend Developer"
            value={formData.role}
            onChange={handleChange}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center">
            <MapPinIcon className="h-4 w-4 mr-1 text-muted-foreground" />
            Location
          </label>
          <input
            name="location"
            placeholder="e.g. Remote, New York"
            value={formData.location}
            onChange={handleChange}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
            Application Date
          </label>
          <input
            name="applicationDate"
            type="date"
            value={formData.applicationDate}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center">
            <ClockIcon className="h-4 w-4 mr-1 text-muted-foreground" />
            Job Type
          </label>
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {jobTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Status</label>
          <div className="grid grid-cols-2 gap-2">
            {statusOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-center p-2 rounded-md cursor-pointer border transition-all duration-200 ${
                  formData.status === option.value
                    ? `${option.color} border-transparent`
                    : "border-input hover:bg-accent hover:text-accent-foreground"
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

      <div className="mt-6 space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center">
          <LinkIcon className="h-4 w-4 mr-1 text-muted-foreground" />
          Links (comma separated)
        </label>
        <input
          name="links"
          placeholder="e.g. https://job-posting.com, https://company.com"
          value={formData.links}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <p className="text-xs text-muted-foreground mt-1">Add job posting URL, company website, etc.</p>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex bg-zinc-800 text-white cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
        >
          {loading ? "Submitting..." : "Submit Job Application"}
        </button>
      </div>
    </form>
  )
}
