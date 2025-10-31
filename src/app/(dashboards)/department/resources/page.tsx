"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Video,
  Music,
  Image,
  File,
  Download,
  Upload,
  Search,
  Folder,
  Eye,
  Share2,
  Trash2,
  Plus,
  BookOpen,
  GraduationCap,
  FileVideo,
  FileAudio,
  FileImage,
} from "lucide-react";

interface Resource {
  id: string;
  name: string;
  type: "document" | "video" | "audio" | "image" | "other";
  category: "lesson-plans" | "worksheets" | "assessments" | "multimedia" | "reference";
  size: string;
  uploadedBy: string;
  uploadedAt: Date;
  downloads: number;
  shared: boolean;
}

export default function DepartmentResourcesPage() {
  return (
    <ProtectedRoute>
      <ResourcesPageContent />
    </ProtectedRoute>
  );
}

function ResourcesPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Mock data
  const resources: Resource[] = [
    {
      id: "r1",
      name: "Level 4 Speaking Assessment Rubric",
      type: "document",
      category: "assessments",
      size: "245 KB",
      uploadedBy: "Dr. Anderson",
      uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      downloads: 24,
      shared: true,
    },
    {
      id: "r2",
      name: "Conversation Practice Video - Business English",
      type: "video",
      category: "multimedia",
      size: "125 MB",
      uploadedBy: "Ms. Chen",
      uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      downloads: 48,
      shared: true,
    },
    {
      id: "r3",
      name: "Foundation Level Listening Exercise Audio",
      type: "audio",
      category: "multimedia",
      size: "8.5 MB",
      uploadedBy: "Ms. Lee",
      uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      downloads: 36,
      shared: false,
    },
    {
      id: "r4",
      name: "Grammar Worksheet - Present Perfect",
      type: "document",
      category: "worksheets",
      size: "180 KB",
      uploadedBy: "Prof. Taylor",
      uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      downloads: 52,
      shared: true,
    },
    {
      id: "r5",
      name: "NZCEL Level 3 Sample Questions",
      type: "document",
      category: "reference",
      size: "320 KB",
      uploadedBy: "Dr. Anderson",
      uploadedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      downloads: 67,
      shared: true,
    },
  ];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-5 w-5" />;
      case "video":
        return <FileVideo className="h-5 w-5" />;
      case "audio":
        return <FileAudio className="h-5 w-5" />;
      case "image":
        return <FileImage className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case "document":
        return "text-blue-500";
      case "video":
        return "text-purple-500";
      case "audio":
        return "text-green-500";
      case "image":
        return "text-amber-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Department Resources</h1>
          <p className="text-muted-foreground">
            Manage teaching materials and resources for your department
          </p>
        </div>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Upload Resource
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Resources</p>
                <p className="text-2xl font-bold">124</p>
              </div>
              <Folder className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Documents</p>
                <p className="text-2xl font-bold">68</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Videos</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <FileVideo className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Audio Files</p>
                <p className="text-2xl font-bold">18</p>
              </div>
              <FileAudio className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Shared</p>
                <p className="text-2xl font-bold">89</p>
              </div>
              <Share2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Bulk Download
        </Button>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="lesson-plans">Lesson Plans</TabsTrigger>
          <TabsTrigger value="worksheets">Worksheets</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="multimedia">Multimedia</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid gap-4">
            {resources.map(resource => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg bg-muted ${getResourceColor(resource.type)}`}>
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{resource.name}</h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <span>{resource.uploadedBy}</span>
                              <span>•</span>
                              <span>{resource.uploadedAt.toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{resource.size}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <Badge variant="outline" className="capitalize">
                            {resource.category.replace("-", " ")}
                          </Badge>
                          <Badge variant="secondary" className="capitalize">
                            {resource.type}
                          </Badge>
                          {resource.shared && (
                            <Badge variant="default">
                              <Share2 className="w-3 h-3 mr-1" />
                              Shared
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {resource.downloads} downloads
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Resource Categories */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <BookOpen className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-base">Lesson Plans</CardTitle>
                <CardDescription>32 resources</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Complete lesson plans and teaching guides
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <FileText className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <CardTitle className="text-base">Worksheets</CardTitle>
                <CardDescription>45 resources</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Practice worksheets and exercises
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <GraduationCap className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <CardTitle className="text-base">Assessments</CardTitle>
                <CardDescription>28 resources</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Tests, quizzes, and assessment tools
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
