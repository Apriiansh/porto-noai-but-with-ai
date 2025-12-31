'use client';

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
import { About } from "@/lib/definitions";
import { useAbout } from "@/lib/hooks/useAbout";
import ErrorSection from "./ErrorSection";
import LoadingSection from "./LoadingSection";
import NoDataSection from "./NoDataSection";

export default function AboutForm() {
  const { about, loading, error, refetch } = useAbout();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
    skills: "",
    hobbies: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (about) {
      setFormData({
        name: about.name,
        role: about.role,
        description: about.description,
        skills: about.skills.join(", "),
        hobbies: about.hobbies.join(", "),
      });
    }
  }, [about]);

  const handleSave = async () => {
    try {
      const updatedData: Partial<About> = {
        name: formData.name,
        role: formData.role,
        description: formData.description,
        skills: formData.skills.split(",").map(s => s.trim()).filter(s => s),
        hobbies: formData.hobbies.split(",").map(h => h.trim()).filter(h => h),
      };

      let response;
      if (photoFile) {
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("role", formData.role);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("skills", formData.skills);
        formDataToSend.append("hobbies", formData.hobbies);
        formDataToSend.append("photo", photoFile);
        response = await fetch('/api/about', {
          method: 'PUT',
          body: formDataToSend,
        });
      } else {
        response = await fetch('/api/about', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to update about data');
      }
      refetch();
      setEditMode(false);
      setPhotoFile(null);
    } catch (err) {
      console.error(err);
    }
  };

   if (loading) {
     return (
       <LoadingSection />
     );
   }
 
   if (error) {
     return (
       <ErrorSection error={error} />
     );
   }
 
   if (!about) {
     return (
       <NoDataSection />
     );
   }

  return (
    <section className="h-screen mx-auto flex flex-col justify-center items-center p-4">
      <div className="flex gap-4 mb-4">
        <Button onClick={() => setEditMode(!editMode)}>
          {editMode ? "Cancel" : "Edit"}
        </Button>
        {editMode && <Button onClick={handleSave}>Save</Button>}
      </div>
      <h1 className="font-heading text-4xl sm:text-3xl sm:mb-3">ABOUT ME</h1>
      <Card className="w-full max-w-4xl mt-5 border-border hover:border-primary transition-all duration-300">
        <div className="flex justify-between items-center border-b border-border hover:border-primary transition-all duration-300">
          <CardHeader className="flex flex-col whitespace-nowrap flex-1">
            {editMode ? (
              <div className="flex flex-col">
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Name"
                  className="font-heading text-primary text-2xl mb-2 border-none bg-transparent p-0 focus:ring-0 focus:outline-none"
                />
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Role"
                  className="font-heading text-primary text-xl mb-2 border-none bg-transparent p-0 focus:ring-0 focus:outline-none"
                />
                <label className="mb-1 text-sm font-medium">Change Photo:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="mb-2"
                />
              </div>
            ) : (
              <>
                <CardTitle className="font-heading text-primary text-2xl">
                  {about.name}
                </CardTitle>
                <CardDescription className="text-xl">
                  {about.role}
                </CardDescription>
              </>
            )}
          </CardHeader>
          <Image
            src={editMode && photoFile ? URL.createObjectURL(photoFile) : (about.photo || "/profile.JPG")}
            alt="profile picture"
            width={140}
            height={100}
            aria-label="Apri Photo"
            className="shadow-accent shadow-md/20 rounded-md m-4"
          />
        </div>

        <CardContent>
          {editMode ? (
            <div>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
                className="mb-4 border-none bg-transparent p-0 resize-none focus:ring-0 focus:outline-none"
              />
              <Input
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="Skills (separate with commas)"
                className="mb-4 border-none bg-transparent p-0 focus:ring-0 focus:outline-none"
              />
              <Input
                value={formData.hobbies}
                onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
                placeholder="Hobbies (separate with commas)"
                className="mb-4 border-none bg-transparent p-0 focus:ring-0 focus:outline-none"
              />
            </div>
          ) : (
            <>
              <p>
                {about.description}
              </p>
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
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}