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
import { useState } from "react";
import { About } from "@/lib/definitions";
import { useAbout } from "@/lib/hooks/useAbout";
import ErrorSection from "./ErrorSection";
import LoadingSection from "./LoadingSection";
import NoDataSection from "./NoDataSection";
import Link from "next/link";
import { FaLeftLong } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const aboutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  description: z.string().min(1, "Description is required"),
  skills: z.string().min(1, "Skills are required"),
  hobbies: z.string().min(1, "Hobbies are required"),
});

type AboutFormData = z.infer<typeof aboutSchema>;

export default function AboutForm() {
  const { about, loading, error, refetch } = useAbout();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const form = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      name: "",
      role: "",
      description: "",
      skills: "",
      hobbies: "",
    },
  });

  const handleEdit = () => {
    if (about) {
      form.reset({
        name: about.name,
        role: about.role,
        description: about.description,
        skills: about.skills.join(", "),
        hobbies: about.hobbies.join(", "),
      });
    }
    setDialogOpen(true);
  };

  const onSubmit = async (data: AboutFormData) => {
    try {
      const updatedData: Partial<About> = {
        name: data.name,
        role: data.role,
        description: data.description,
        skills: data.skills.split(",").map(s => s.trim()).filter(s => s),
        hobbies: data.hobbies.split(",").map(h => h.trim()).filter(h => h),
      };

      let response;
      if (photoFile) {
        const formDataToSend = new FormData();
        formDataToSend.append("name", data.name);
        formDataToSend.append("role", data.role);
        formDataToSend.append("description", data.description);
        formDataToSend.append("skills", data.skills);
        formDataToSend.append("hobbies", data.hobbies);
        formDataToSend.append("photo", photoFile);
        response = await fetch("/api/about", {
          method: "PUT",
          body: formDataToSend,
        });
      } else {
        response = await fetch("/api/about", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });
      }

      if (!response.ok) throw new Error("Failed to update about data");
      refetch();
      setDialogOpen(false);
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

  if (!about) {
    return <NoDataSection />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex gap-4 justify-between items-center">
        <h1 className="font-heading text-3xl">Edit About</h1>
        <Button onClick={handleEdit}>
          <FaEdit className="mr-2" />
          Edit
        </Button>
      </div>
      <Card className="w-full border-border hover:border-primary transition-all duration-300">
        <div className="flex justify-between items-center border-b border-border hover:border-primary transition-all duration-300">
          <CardHeader className="flex flex-col whitespace-nowrap">
            <CardTitle className="font-heading text-primary text-2xl">
              {about.name}
            </CardTitle>
            <CardDescription className="text-xl">
              {about.role}
            </CardDescription>
          </CardHeader>
          <div className="w-35 h-25 relative m-4">
            <Image
              src={about.photo || "/profile.JPG"}
              alt="profile picture"
              fill
              sizes="140px"
              className="object-cover shadow-accent shadow-md/20 rounded-md"
              aria-label="Apri Photo"
            />
          </div>
        </div>

        <CardContent>
          <p>{about.description}</p>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {about.skills.map((skill: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Hobbies:</h3>
            <div className="flex flex-wrap gap-2">
              {about.hobbies.map((hobby: string, index: number) => (
                <Badge key={index} variant="outline">
                  {hobby}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit About</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="Your role" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <FormControl>
                      <Input placeholder="Skills (comma separated)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hobbies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hobbies</FormLabel>
                    <FormControl>
                      <Input placeholder="Hobbies (comma separated)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">Change Photo:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="mb-2 border border-gray-300 rounded-md p-1.5"
                />
              </div>
              <Button type="submit">Update</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
