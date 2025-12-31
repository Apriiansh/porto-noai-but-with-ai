"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useState, useEffect } from "react";
import { About, Education } from "@/lib/definitions";
import { useAbout } from "@/lib/hooks/useAbout";
import { useEducation } from "@/lib/hooks/useEducation";
import LoadingSection from "./LoadingSection";
import ErrorSection from "./ErrorSection";
import NoDataSection from "./NoDataSection";

export default function EducationForm() {
  const { educations, loading, error, refetch } = useEducation();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    year: "",
    gpa: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (educations && educations.length > 0) {
      const education = educations[0];
      setFormData({
        institution: education.institution,
        degree: education.degree,
        year: education.year,
        gpa: education.gpa || "",
      });
    }
  }, [educations]);

  const handleSave = async () => {
    try {
      const updatedData: Partial<Education> = {
        institution: formData.institution,
        degree: formData.degree,
        year: formData.year,
        gpa: formData.gpa,
      };

      let response;
      if (photoFile) {
        const formDataToSend = new FormData();
        formDataToSend.append("institution", formData.institution);
        formDataToSend.append("degree", formData.degree);
        formDataToSend.append("year", formData.year);
        formDataToSend.append("gpa", formData.gpa);
        response = await fetch("/api/education", {
          method: "PUT",
          body: formDataToSend,
        });
      } else {
        response = await fetch("/api/education", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to update education data");
      }
      refetch();
      setEditMode(false);
      setPhotoFile(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingSection />;
  }

  if (error) {
    return <ErrorSection error={error} />;
  }

  if (!educations || educations.length === 0) {
    return <NoDataSection />;
  }

  return (
    <section className="h-screen mx-auto flex flex-col justify-center items-center p-4">
      <div className="flex gap-4 mb-4">
        <Button onClick={() => setEditMode(!editMode)}>
          {editMode ? "Cancel" : "Edit"}
        </Button>
        {editMode && <Button onClick={handleSave}>Save</Button>}
      </div>
      <h1 className="font-heading text-4xl sm:text-3xl mb-4 md:mb-6">
        EDUCATION
      </h1>
      <ul className="flex flex-col w-full max-w-5xl mx-2 items-start">
        {educations.map((education, index) => (
          <li key={index} className="mb-4 w-md">
            <h3 className="border-b-2 w-full font-semibold text-2xl">
              {education.institution}
            </h3>
            <p>
              {education.degree} |{" "}
              <span className="font-medium">{education.year}</span>
            </p>
            {education.gpa && (
              <p>
                GPA <span className="font-medium">{education.gpa}</span>
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
