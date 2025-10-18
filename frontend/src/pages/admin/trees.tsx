import React, { useState, useEffect } from "react";
import { getTrees, createTree, updateTree, deleteTree } from "../../services/adminService";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../components/ui/pagination";
import { useToast } from "../../hooks/use-toast";
import { Search, Plus, Edit, Trash2, Package, Filter, RefreshCw, X } from "lucide-react";

interface Tree {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  scientificName: string;
  growthTime: string;
  height: string;
  benefits: string[];
  createdAt: string;
  updatedAt: string;
}

const categoryOptions = [
  { value: "Medicinal", label: "Medicinal" },
  { value: "Fruit", label: "Fruit" },
  { value: "Shade", label: "Shade" },
  { value: "Sacred", label: "Sacred" },
  { value: "Timber", label: "Timber" },
  { value: "Ornamental", label: "Ornamental" }
];

export default function AdminTrees() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingTree, setEditingTree] = useState<Tree | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: '',
    scientificName: '',
    growthTime: '',
    height: '',
    benefits: [] as string[]
  });

  const [editData, setEditData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: '',
    scientificName: '',
    growthTime: '',
    height: '',
    benefits: [] as string[]
  });

  const [newBenefit, setNewBenefit] = useState('');
  const [newEditBenefit, setNewEditBenefit] = useState('');

  const fetchTrees = async () => {
    try {
      setLoading(true);
      const response = await getTrees({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search || undefined,
        category: filters.category !== 'all' ? filters.category : undefined,
      });
      
      console.log('Trees response:', response);
      
      // The response now has the correct structure: { data: Tree[], pagination: {...} }
      if (response.data && Array.isArray(response.data)) {
        setTrees(response.data);
        setPagination(response.pagination || {
          page: 1,
          limit: 10,
          total: response.data.length,
          pages: Math.ceil(response.data.length / 10)
        });
      } else {
        setTrees([]);
        setPagination(prev => ({
          ...prev,
          total: 0,
          pages: 0
        }));
      }
    } catch (error) {
      console.error('Error fetching trees:', error);
      toast({
        title: "Error",
        description: "Failed to fetch trees",
        variant: "destructive",
      });
      // Set safe defaults on error
      setTrees([]);
      setPagination(prev => ({
        ...prev,
        total: 0,
        pages: 0
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrees();
  }, [pagination?.page, filters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createTree({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        imageUrl: formData.imageUrl,
        scientificName: formData.scientificName,
        growthTime: formData.growthTime,
        height: formData.height,
        benefits: formData.benefits
      });
      
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        imageUrl: '',
        scientificName: '',
        growthTime: '',
        height: '',
        benefits: []
      });
      setNewBenefit('');
      setShowAddDialog(false);
      
      toast({
        title: "Success",
        description: "Tree created successfully",
      });
      fetchTrees();
    } catch (error: any) {
      console.error('Error creating tree:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create tree",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    try {
      setEditing(true);
      await updateTree(editingTree!.id, {
        name: editData.name,
        description: editData.description,
        price: parseFloat(editData.price),
        category: editData.category,
        stock: parseInt(editData.stock),
        imageUrl: editData.imageUrl,
        scientificName: editData.scientificName,
        growthTime: editData.growthTime,
        height: editData.height,
        benefits: editData.benefits
      });
      
      toast({
        title: "Success",
        description: "Tree updated successfully",
      });
      setEditingTree(null);
      fetchTrees();
    } catch (error: any) {
      console.error('Error updating tree:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update tree",
        variant: "destructive",
      });
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async (treeId: string) => {
    try {
      await deleteTree(treeId);
      toast({
        title: "Success",
        description: "Tree deleted successfully",
      });
      fetchTrees();
    } catch (error: any) {
      console.error('Error deleting tree:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete tree",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (tree: Tree) => {
    setEditingTree(tree);
    setEditData({
      name: tree.name,
      description: tree.description,
      price: tree.price.toString(),
      category: tree.category,
      stock: tree.stock.toString(),
      imageUrl: tree.imageUrl,
      scientificName: tree.scientificName,
      growthTime: tree.growthTime,
      height: tree.height,
      benefits: tree.benefits
    });
    setNewEditBenefit('');
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim() && !formData.benefits.includes(newBenefit.trim())) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  const handleRemoveBenefit = (benefit: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(b => b !== benefit)
    }));
  };

  const handleEditAddBenefit = () => {
    if (newEditBenefit.trim() && !editData.benefits.includes(newEditBenefit.trim())) {
      setEditData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newEditBenefit.trim()]
      }));
      setNewEditBenefit('');
    }
  };

  const handleEditRemoveBenefit = (benefit: string) => {
    setEditData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(b => b !== benefit)
    }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-900">Manage Trees</h1>
          <p className="text-gray-600 mt-1">Add, edit, and manage tree catalog</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchTrees} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Tree
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Tree</DialogTitle>
                <DialogDescription>
                  Add a new tree to the catalog
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Tree Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Neem Tree"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="scientificName">Scientific Name</Label>
                    <Input
                      id="scientificName"
                      value={formData.scientificName}
                      onChange={(e) => setFormData(prev => ({ ...prev, scientificName: e.target.value }))}
                      placeholder="e.g., Azadirachta indica"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the tree..."
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="growthTime">Growth Time</Label>
                    <Input
                      id="growthTime"
                      value={formData.growthTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, growthTime: e.target.value }))}
                      placeholder="e.g., 3-5 years"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Max Height</Label>
                    <Input
                      id="height"
                      value={formData.height}
                      onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                      placeholder="e.g., 15-20 meters"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="150"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                      placeholder="100"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="benefits">Benefits (Tags)</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id="benefits"
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      placeholder="Add a benefit..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
                    />
                    <Button type="button" onClick={handleAddBenefit} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.benefits.map((benefit, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {benefit}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleRemoveBenefit(benefit)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Creating..." : "Create Tree"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search trees..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Package className="h-4 w-4" />
              <span>Total Trees: {pagination?.total || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trees</CardTitle>
          <CardDescription>
            Showing {trees.length} of {pagination?.total || 0} trees
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-green-600" />
              <span className="ml-2 text-gray-600">Loading trees...</span>
            </div>
          ) : trees.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No trees found</h3>
              <p className="text-gray-600">Try adjusting your filters or add a new tree.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tree</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Benefits</TableHead>
                    <TableHead>Price & Stock</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trees.map((tree) => (
                    <TableRow key={tree.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={tree.imageUrl}
                            alt={tree.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <div className="font-medium">{tree.name}</div>
                            <div className="text-sm text-gray-500">{tree.scientificName}</div>
                            <Badge variant="outline">{tree.category}</Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{tree.growthTime}</div>
                          <div className="text-sm text-gray-500">{tree.height}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {tree.benefits.slice(0, 2).map((benefit, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                          {tree.benefits.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{tree.benefits.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">₹{tree.price}</div>
                          <div className="text-sm text-gray-500">Stock: {tree.stock}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(tree)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Tree</DialogTitle>
                                <DialogDescription>
                                  Update tree information
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-name">Tree Name</Label>
                                    <Input
                                      id="edit-name"
                                      value={editData.name}
                                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                                      placeholder="e.g., Neem Tree"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-scientificName">Scientific Name</Label>
                                    <Input
                                      id="edit-scientificName"
                                      value={editData.scientificName}
                                      onChange={(e) => setEditData(prev => ({ ...prev, scientificName: e.target.value }))}
                                      placeholder="e.g., Azadirachta indica"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="edit-description">Description</Label>
                                  <textarea
                                    id="edit-description"
                                    value={editData.description}
                                    onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Describe the tree..."
                                    className="w-full p-2 border rounded-md"
                                    rows={3}
                                  />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-growthTime">Growth Time</Label>
                                    <Input
                                      id="edit-growthTime"
                                      value={editData.growthTime}
                                      onChange={(e) => setEditData(prev => ({ ...prev, growthTime: e.target.value }))}
                                      placeholder="e.g., 3-5 years"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-height">Max Height</Label>
                                    <Input
                                      id="edit-height"
                                      value={editData.height}
                                      onChange={(e) => setEditData(prev => ({ ...prev, height: e.target.value }))}
                                      placeholder="e.g., 15-20 meters"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <Label htmlFor="edit-price">Price (₹)</Label>
                                    <Input
                                      id="edit-price"
                                      type="number"
                                      value={editData.price}
                                      onChange={(e) => setEditData(prev => ({ ...prev, price: e.target.value }))}
                                      placeholder="150"
                                      min="0"
                                      step="0.01"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-stock">Stock</Label>
                                    <Input
                                      id="edit-stock"
                                      type="number"
                                      value={editData.stock}
                                      onChange={(e) => setEditData(prev => ({ ...prev, stock: e.target.value }))}
                                      placeholder="100"
                                      min="0"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-category">Category</Label>
                                    <Select value={editData.category} onValueChange={(value) => setEditData(prev => ({ ...prev, category: value }))}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {categoryOptions.map((option) => (
                                          <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="edit-imageUrl">Image URL</Label>
                                  <Input
                                    id="edit-imageUrl"
                                    value={editData.imageUrl}
                                    onChange={(e) => setEditData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                    placeholder="https://example.com/image.jpg"
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="edit-benefits">Benefits (Tags)</Label>
                                  <div className="flex gap-2 mb-2">
                                    <Input
                                      id="edit-benefits"
                                      value={newEditBenefit}
                                      onChange={(e) => setNewEditBenefit(e.target.value)}
                                      placeholder="Add a benefit..."
                                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleEditAddBenefit())}
                                    />
                                    <Button type="button" onClick={handleEditAddBenefit} variant="outline">
                                      Add
                                    </Button>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {editData.benefits.map((benefit, index) => (
                                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                        {benefit}
                                        <X
                                          className="h-3 w-3 cursor-pointer"
                                          onClick={() => handleEditRemoveBenefit(benefit)}
                                        />
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                  <Button type="button" variant="outline" onClick={() => setEditingTree(null)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleEdit} disabled={editing}>
                                    {editing ? "Updating..." : "Update Tree"}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Tree</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{tree.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(tree.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(pagination.page - 1)}
                    className={pagination.page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={pageNum === pagination.page}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {pagination.pages > 5 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(pagination.pages)}
                        isActive={pagination.page === pagination.pages}
                        className="cursor-pointer"
                      >
                        {pagination.pages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(pagination.page + 1)}
                    className={pagination.page >= pagination.pages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 