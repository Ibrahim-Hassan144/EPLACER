import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/auth";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function InternshipApply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth(); // <-- ensure we can read token

  const [company, setCompany] = useState(null);
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    cover: "",
    cv: null,
  });

  useEffect(() => {
    fetchInternship();
    if (user) {
      setForm(f => ({ ...f, fullname: user.name, email: user.email }));
    }
  }, [id]);

  async function fetchInternship() {
    try {
      const res = await axios.get(`${API}/internships/${id}`);
      setCompany(res.data);
    } catch {
      alert("Unable to load internship");
    }
  }

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleCV(e) {
    setForm({ ...form, cv: e.target.files[0] });
  }

  async function submitApplication() {
    if (!form.fullname || !form.email || !form.phone || !form.cv) {
      alert("All fields required");
      return;
    }

    const fd = new FormData();
    fd.append("internshipId", id);
    fd.append("fullname", form.fullname);
    fd.append("email", form.email);
    fd.append("phone", form.phone);
    fd.append("cover", form.cover);
    fd.append("cv", form.cv);

    try {
      // READ TOKEN FROM LOCALSTORAGE
      const stored = localStorage.getItem("eplacer_auth");
      const auth = stored ? JSON.parse(stored) : null;
      const jwt = auth?.token;

      if (!jwt) {
        alert("You must be logged in to apply.");
        return;
      }

      await axios.post(`${API}/applications`, fd, {
        headers: {
          Authorization: `Bearer ${jwt}`, // <-- FIXED
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Submitted!");
      navigate("/applications");
    } catch (err) {
      alert(err?.response?.data?.message || "Submit failed.");
    }
  }

  if (!company) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex justify-center mb-6">
        <img src={company.logo} className="w-28 h-28 object-contain" />
      </div>

      <h1 className="text-2xl font-semibold text-center mb-1">
        Apply to {company.company}
      </h1>

      <p className="text-center text-gray-500 mb-8">{company.department}</p>

      <div className="space-y-4">
        <input
          name="fullname"
          placeholder="Full name"
          className="w-full px-4 py-2 border rounded"
          value={form.fullname}
          onChange={update}
        />

        <input
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
          value={form.email}
          onChange={update}
        />

        <input
          name="phone"
          placeholder="Phone"
          className="w-full px-4 py-2 border rounded"
          value={form.phone}
          onChange={update}
        />

        <textarea
          name="cover"
          placeholder="Cover letter (optional)"
          className="w-full px-4 py-2 border rounded h-32"
          onChange={update}
        />

        <div>
          <label className="font-semibold">Upload CV (PDF)</label>
          <input type="file" accept="application/pdf" onChange={handleCV} />
        </div>

        <button
          onClick={submitApplication}
          className="w-full bg-primary text-white py-3 rounded"
        >
          Submit Application
        </button>
      </div>
    </div>
  );
}
