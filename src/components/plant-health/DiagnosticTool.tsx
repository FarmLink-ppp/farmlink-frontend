
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Upload } from "lucide-react";

const DiagnosticTool = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/10">
        <CardTitle className="flex items-center">
          <Leaf className="mr-2 h-5 w-5 text-primary" />
          Plant Diagnostic Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center">
            <div className="mx-auto flex flex-col items-center justify-center gap-2">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-semibold">Upload Plant Image</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your image here or click to browse
              </p>
              <Input
                id="picture"
                type="file"
                className="hidden"
                accept="image/*"
              />
              <Button className="mt-2">
                Select Image
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="plant-type">Plant Type (Optional)</Label>
              <Input id="plant-type" placeholder="e.g., Tomato, Corn, etc." />
            </div>
            
            <div>
              <Label htmlFor="symptoms">Symptoms (Optional)</Label>
              <Input id="symptoms" placeholder="e.g., Yellow leaves, spots, etc." />
            </div>
            
            <Button className="w-full">
              Analyze Plant Health
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiagnosticTool;
