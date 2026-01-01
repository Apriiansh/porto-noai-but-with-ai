"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Project } from "@/lib/definitions";
import { useEducation } from "@/lib/hooks/useEducation";
import LoadingSection from "./LoadingSection";
import ErrorSection from "./ErrorSection";
import NoDataSection from "./NoDataSection";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaPlus, FaLeftLong, FaGithub, FaPencil, FaChevronUp, FaChevronDown, FaTrash } from "react-icons/fa6";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useProjects } from "@/lib/hooks/useProjects";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FaRegEdit } from "react-icons/fa";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tech: z.string().min(1, "Tech is required"),
  type: z.string().optional(),
  link: z.string().optional(),
  githubLink: z.string().optional(),
});

type ProjectsFormData = z.infer<typeof projectSchema>;

export default function ProjectsForm() {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    setDeletingId(id);
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete project");
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };
  const { projects, loading, error, refetch } = useProjects();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isOrderMode, setIsOrderMode] = useState(false);
  const [orderedProjects, setOrderedProjects] = useState<Project[]>([]);

  const handleOrderMode = () => {
    setOrderedProjects([...projects]);
    setIsOrderMode(true);
  };

  const handleCancelOrder = () => {
    setIsOrderMode(false);
  };

  const handleDoneOrder = async () => {
    const updates = orderedProjects.map((p, i) => ({ id: p.id!, order: i }));
    try {
      const response = await fetch("/api/projects/order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update order");
      refetch();
      setIsOrderMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveUp = (idx: number) => {
    if (idx > 0) {
      const newOrder = [...orderedProjects];
      [newOrder[idx], newOrder[idx - 1]] = [newOrder[idx - 1], newOrder[idx]];
      setOrderedProjects(newOrder);
    }
  };

  const handleMoveDown = (idx: number) => {
    if (idx < orderedProjects.length - 1) {
      const newOrder = [...orderedProjects];
      [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
      setOrderedProjects(newOrder);
    }
  };

  const form = useForm<ProjectsFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      tech: "",
      type: "",
      link: "",
      githubLink: "",
    },
  });

  const handleAdd = () => {
    setEditingProject(null);
    form.reset();
    setDialogOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    form.reset({
      title: project.title,
      description: project.description,
      tech: project.tech.join(", "),
      type: project.type || "",
      link: project.link || "",
      githubLink: project.githubLink || "",
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: ProjectsFormData) => {
    try {
      const processedData = {
        ...data,
        tech: data.tech.split(",").map(s => s.trim()).filter(s => s),
      };
      if (editingProject) {
        // Edit
        const response = await fetch(`/api/projects/${editingProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(processedData),
        });
        if (!response.ok) throw new Error("Failed to update project");
      } else {
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(processedData),
        });
        if (!response.ok) throw new Error("Failed to add project");
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

  if (!projects || projects.length === 0) {
    return <NoDataSection />;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex gap-4 justify-between items-center">
        <h1 className="font-heading text-3xl">Edit Projects</h1>
        <div className="flex gap-2">
          {isOrderMode ? (
            <>
              <Button variant="outline" onClick={handleCancelOrder}>Cancel</Button>
              <Button variant="default" onClick={handleDoneOrder}>Done</Button>
            </>
          ) : (
            <Button variant="outline" onClick={handleOrderMode}>Edit Order</Button>
          )}
          <Button variant="default" onClick={handleAdd}>
            <FaPlus className="mr-2" />
            Add
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-6 w-full">
        {(isOrderMode ? orderedProjects : projects).map((project: Project, idx: number) => (
          <Card key={project.id} className="overflow-hidden flex flex-col gap-2 hover:bg-white/10 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl group">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{project.title}</CardTitle>
                <div className="flex gap-1">
                  {isOrderMode && (
                    <>
                      <Button variant="ghost" size="sm" aria-label="Move up" onClick={() => handleMoveUp(idx)} disabled={idx === 0}>
                        <FaChevronUp className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" aria-label="Move down" onClick={() => handleMoveDown(idx)} disabled={idx === (orderedProjects.length - 1)}>
                        <FaChevronDown className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="sm" aria-label="Edit project" onClick={() => handleEdit(project)}>
                    <FaRegEdit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Delete project"
                    onClick={() => handleDelete(project.id!)}
                    disabled={deletingId === project.id}
                  >
                    <FaTrash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p>{project.description}</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-1">
                {project.tech.map((tech, i) => (
                  <span key={i} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                {project.link && (() => {
                  const isGithub = project.link.includes("github.com");
                  return (
                    <Button asChild variant="outline" size="sm">
                      <Link href={project.link} target="_blank" rel="noopener noreferrer">
                        {isGithub ? <FaGithub className="w-4 h-4 mr-2" /> : <ExternalLinkIcon className="w-4 h-4 mr-2" />}
                        {isGithub ? "GitHub" : (project.type === "more" ? "More" : "View")}
                      </Link>
                    </Button>
                  );
                })()}
                {project.githubLink && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={project.githubLink} target="_blank" rel="noopener noreferrer">
                      <FaGithub className="w-4 h-4 mr-2" />
                      GitHub
                    </Link>
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "Add Project"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* ...existing code for form fields... */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Project title" {...field} />
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
                      <Input placeholder="Project description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tech"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tech</FormLabel>
                    <FormControl>
                      <Input placeholder="Tech (comma separated)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="github">GitHub</SelectItem>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                          <SelectItem value="more">More</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input placeholder="Project link" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="githubLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Link</FormLabel>
                    <FormControl>
                      <Input placeholder="GitHub link" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                {editingProject ? "Update" : "Add"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
