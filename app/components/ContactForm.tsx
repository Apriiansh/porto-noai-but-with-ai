"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useContact } from "@/lib/hooks/useContact";
import { Mail, Phone } from "lucide-react";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLeftLong,
  FaLinkedin,
} from "react-icons/fa6";
import LoadingSection from "../components/LoadingSection";
import ErrorSection from "../components/ErrorSection";
import NoDataSection from "../components/NoDataSection";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Contact } from "@/lib/definitions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";

const contactSchema = z.object({
  email: z.email(),
  phone: z.string().min(10),
  github: z.url(),
  linkedin: z.url(),
  facebook: z.url(),
  instagram: z.url(),
  yapping: z.string().max(500),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const { contact, loading, error, refetch } = useContact();
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      yapping: "",
      email: "",
      phone: "",
      github: "",
      linkedin: "",
      facebook: "",
      instagram: "",
    },
  });

  const handleEdit = () => {
    if (contact) {
      form.reset({
        yapping: contact.yapping || "",
        email: contact.email || "",
        phone: contact.phone || "",
        github: contact.github || "",
        linkedin: contact.linkedin || "",
        facebook: contact.facebook || "",
        instagram: contact.instagram || "",
      });

      setDialogOpen(true);
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    try {
      const updatedData: Partial<Contact> = {
        email: data.email,
        phone: data.phone,
        github: data.github,
        linkedin: data.linkedin,
        facebook: data.facebook,
        instagram: data.instagram,
        yapping: data.yapping,
      };

      let response = await fetch("/api/contact", {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Failed to update contact data");
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

  if (!contact) {
    return <NoDataSection />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex gap-4 justify-between items-center">
        <h1 className="font-heading text-3xl">Edit Contact</h1>
        <Button onClick={handleEdit}>
          <FaEdit className="mr-2" />
          Edit
        </Button>
      </div>

      <Card className="w-full border-border hover:border-primary transition-all duration-300">
        <CardHeader>
          <CardTitle>Get In Touch</CardTitle>
          <CardDescription>{contact.yapping}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-primary" />
            <span>{contact.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-primary" />
            <span>{contact.phone}</span>
          </div>
          <div className="flex gap-4 mt-6">
            <Button variant="outline" size="icon" asChild>
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a
                href={contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="yapping"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yapping</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Your yapping" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row space-x-2 justify-between">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-row space-x-2 justify-between">
                <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input placeholder="Your LinkedIn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub</FormLabel>
                    <FormControl>
                      <Input placeholder="Your GitHub" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
              
              <div className="flex flex-row space-x-2 justify-between">
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input placeholder="Instagram" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <FormControl>
                        <Input placeholder="My Fesnuk" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
