"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useClassContext } from "../layout";
import {
  Upload,
  FileText,
  File,
  Video,
  Music,
  Image,
  Download,
  Trash2,
  Share2,
  Search,
  FolderOpen,
  Plus,
  Eye,
  Clock,
} from "lucide-react";

export default function ClassMaterialsPage() {
  return (
    <ProtectedRoute>
      <MaterialsContent />
    </ProtectedRoute>
  );
}

function MaterialsContent() {
  const { classData } = useClassContext();

  // Mock materials data
  const materials = [
    {
      id: "1",
      name: "Grammar Workbook - Chapter 5",
      type: "pdf",
      size: "2.4 MB",
      uploadedDate: "Dec 5, 2024",
      downloads: 18,
      category: "Textbook",
    },
    {
      id: "2",
      name: "Listening Exercise - Business English",
      type: "audio",
      size: "15.2 MB",
      uploadedDate: "Dec 3, 2024",
      downloads: 22,
      category: "Audio",
    },
    {
      id: "3",
      name: "Vocabulary Flashcards Set 3",
      type: "pdf",
      size: "1.1 MB",
      uploadedDate: "Dec 1, 2024",
      downloads: 25,
      category: "Practice",
    },
    {
      id: "4",
      name: "Speaking Practice Video - Job Interview",
      type: "video",
      size: "45.8 MB",
      uploadedDate: "Nov 28, 2024",
      downloads: 15,
      category: "Video",
    },
    {
      id: "5",
      name: "Writing Template - Essay Structure",
      type: "doc",
      size: "890 KB",
      uploadedDate: "Nov 25, 2024",
      downloads: 20,
      category: "Template",
    },
    {
      id: "6",
      name: "Pronunciation Guide",
      type: "pdf",
      size: "3.2 MB",
      uploadedDate: "Nov 20, 2024",
      downloads: 19,
      category: "Reference",
    },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "doc":
        return <File className="h-4 w-4 text-blue-500" />;
      case "video":
        return <Video className="h-4 w-4 text-purple-500" />;
      case "audio":
        return <Music className="h-4 w-4 text-green-500" />;
      case "image":
        return <Image className="h-4 w-4 text-amber-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Textbook":
        return "default";
      case "Audio":
        return "success";
      case "Video":
        return "secondary";
      case "Practice":
        return "warning";
      case "Template":
        return "info";
      case "Reference":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Materials Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.length}</div>
            <p className="text-xs text-muted-foreground">Files uploaded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.5 MB</div>
            <p className="text-xs text-muted-foreground">Storage used</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">119</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">Dec 5</div>
            <p className="text-xs text-muted-foreground">3 days ago</p>
          </CardContent>
        </Card>
      </div>

      {/* Upload and Search Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Class Materials</CardTitle>
              <CardDescription>
                Learning resources for {classData.name}
              </CardDescription>
            </div>
            <Button size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload Material
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <FolderOpen className="h-4 w-4 mr-2" />
              Categories
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((material) => (
          <Card key={material.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    {getFileIcon(material.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm line-clamp-1">{material.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={getCategoryColor(material.category) as any}
                        className="text-xs"
                      >
                        {material.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{material.size}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {material.uploadedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {material.downloads}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-3 pt-3 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Folders/Categories */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Material Categories</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["Textbooks", "Audio Files", "Videos", "Practice Materials", "Templates", "References", "Assignments", "Solutions"].map((folder) => (
              <Button
                key={folder}
                variant="outline"
                className="h-auto flex-col p-4 space-y-2"
              >
                <FolderOpen className="h-8 w-8 text-muted-foreground" />
                <span className="text-xs">{folder}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}