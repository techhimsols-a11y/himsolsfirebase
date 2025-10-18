import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Package,
  Users,
  TreePine,
  TrendingUp,
  Eye,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  getDashboardStats, 
  getTrees, 
  createTree, 
  updateTree, 
  deleteTree,
  Tree,
  DashboardStats
} from "@/services/adminService";

const summaryCards = [
  { 
    label: "Total Trees", 
    key: "totalTrees",
    color: "bg-green-100", 
    icon: TreePine,
    textColor: "text-green-800"
  },
  { 
    label: "Total Orders", 
    key: "totalOrders",
    color: "bg-blue-100", 
    icon: Package,
    textColor: "text-blue-800"
  },
  { 
    label: "Total Users", 
    key: "totalUsers",
    color: "bg-purple-100", 
    icon: Users,
    textColor: "text-purple-800"
  },
  { 
    label: "Service Requests", 
    key: "totalServiceRequests",
    color: "bg-orange-100", 
    icon: TrendingUp,
    textColor: "text-orange-800"
  },
];

export default function AdminDashboard() {
  const { toast } = useToast();
  const [trees, setTrees] = useState<Tree[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTree, setEditingTree] = useState<Tree | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    imageUrl: ""
  });

  const categories = ["all", "Deciduous", "Evergreen", "Fruit", "Ornamental"];

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, treesData] = await Promise.all([
        getDashboardStats(),
        getTrees()
      ]);
      setDashboardStats(statsData);
      console.log(treesData.data)
      setTrees(treesData.data?.trees || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
      // Set empty arrays as fallback
      setTrees([]);
      setDashboardStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // const filteredTrees = (trees || []).filter(tree => {
  //   const matchesSearch = tree.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        tree.description.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesCategory = selectedCategory === "all" || tree.category === selectedCategory;
  //   return matchesSearch && matchesCategory;
  // });
  const filteredTrees = trees || []

  const handleAddTree = async () => {
    try {
      const newTree = await createTree({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        imageUrl: formData.imageUrl || "/placeholder-tree.jpg"
      });

      setTrees(prevTrees => [...(prevTrees || []), newTree]);
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Tree added successfully!",
      });
      
      // Refresh dashboard stats
      fetchDashboardData();
    } catch (error) {
      console.error('Error adding tree:', error);
      toast({
        title: "Error",
        description: "Failed to add tree",
        variant: "destructive"
      });
    }
  };

  const handleEditTree = async () => {
    if (!editingTree) return;

    try {
      const updatedTree = await updateTree(editingTree.id, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        imageUrl: formData.imageUrl
      });

      setTrees(prevTrees => 
        (prevTrees || []).map(tree => 
          tree.id === editingTree.id ? updatedTree : tree
        )
      );
      setIsEditDialogOpen(false);
      setEditingTree(null);
      resetForm();
      toast({
        title: "Success",
        description: "Tree updated successfully!",
      });
    } catch (error) {
      console.error('Error updating tree:', error);
      toast({
        title: "Error",
        description: "Failed to update tree",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTree = async (id: string) => {
    try {
      await deleteTree(id);
      setTrees(prevTrees => (prevTrees || []).filter(tree => tree.id !== id));
      toast({
        title: "Success",
        description: "Tree deleted successfully!",
      });
      
      // Refresh dashboard stats
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting tree:', error);
      toast({
        title: "Error",
        description: "Failed to delete tree",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (tree: Tree) => {
    setEditingTree(tree);
    setFormData({
      name: tree.name,
      description: tree.description,
      price: tree.price.toString(),
      category: tree.category,
      stock: tree.stock.toString(),
      imageUrl: tree.imageUrl
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      imageUrl: ""
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your trees and monitor business metrics</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Tree
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card) => (
          <Card key={card.label} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.label}</p>
                  <p className={`text-2xl font-bold ${card.textColor}`}>
                    {dashboardStats?.stats[card.key as keyof typeof dashboardStats.stats] || 0}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${card.color}`}>
                  <card.icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


      {/* Add Tree Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Tree</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Tree Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter tree name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter tree description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select category</option>
                <option value="Deciduous">Deciduous</option>
                <option value="Evergreen">Evergreen</option>
                <option value="Fruit">Fruit</option>
                <option value="Ornamental">Ornamental</option>
              </select>
            </div>
            <div>
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleAddTree}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Add Tree
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Tree Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Tree</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Tree Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter tree name"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter tree description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-price">Price ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <select
                id="edit-category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select category</option>
                <option value="Deciduous">Deciduous</option>
                <option value="Evergreen">Evergreen</option>
                <option value="Fruit">Fruit</option>
                <option value="Ornamental">Ornamental</option>
              </select>
            </div>
            <div>
              <Label htmlFor="edit-imageUrl">Image URL (optional)</Label>
              <Input
                id="edit-imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleEditTree}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Update Tree
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 