"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Education } from "@/lib/definitions";
import { useEducation } from "@/lib/hooks/useEducation";
import LoadingSection from "./LoadingSection";
import ErrorSection from "./ErrorSection";
import NoDataSection from "./NoDataSection";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  year: z.string().min(1, "Year is required"),
  gpa: z.string().optional(),
});

type EducationFormData = z.infer<typeof educationSchema>;

export default function EducationForm() {
  const { educations, loading, error, refetch } = useEducation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: "",
      degree: "",
      year: "",
      gpa: "",
    },
  });

  const handleAdd = () => {
    setEditingEducation(null);
    form.reset();
    setDialogOpen(true);
  };

  const handleEdit = (education: Education) => {
    setEditingEducation(education);
    form.reset({
      institution: education.institution,
      degree: education.degree,
      year: education.year,
      gpa: education.gpa || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this education?")) return;
    setDeletingId(id);
    try {
      const response = await fetch(`/api/education/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete education");
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const onSubmit = async (data: EducationFormData) => {
    try {
      if (editingEducation) {
        // Edit
        const response = await fetch(`/api/education/${editingEducation.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update education");
      } else {
        const response = await fetch("/api/education", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to add education");
      }
      refetch();
      setDialogOpen(false);
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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex gap-4 justify-between items-center">
        <h1 className="font-heading text-3xl">Edit Education</h1>
        <Button variant="default" onClick={handleAdd}>
          <FaPlus className="mr-2" />
          Add
        </Button>
      </div>
      <ul className="flex flex-col w-full items-start space-y-4">
        {educations.map((education, index) => (
          <li
            key={education.id}
            className="w-full flex justify-between items-start p-4 border rounded-lg"
          >
            <div className="flex-1">
              <h3 className="border-b-2 w-9/10 font-semibold text-2xl">
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
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleEdit(education)}>
                <FaEdit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDelete(education.id!)}
                disabled={deletingId === education.id}
              >
                <FaTrash className="w-4 h-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEducation ? "Edit Education" : "Add Education"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Input placeholder="Institution name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="Degree" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input placeholder="Year" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gpa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GPA (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="GPA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                {editingEducation ? "Update" : "Add"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
