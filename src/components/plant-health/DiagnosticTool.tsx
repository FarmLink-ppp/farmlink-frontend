
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Upload, Sparkles } from "lucide-react";

const DiagnosticTool = () => {
  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="bg-gradient-to-r from-farmlink-green/5 to-farmlink-mediumgreen/5 border-b border-farmlink-lightgreen/20">
        <CardTitle className="flex items-center text-farmlink-darkgreen">
          <div className="w-12 h-12 bg-gradient-to-br from-farmlink-green to-farmlink-mediumgreen rounded-2xl flex items-center justify-center mr-3">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-xl font-bold">AI Plant Diagnostic Tool</div>
            <div className="text-sm text-farmlink-darkgreen/70 font-normal flex items-center">
              <Sparkles className="w-4 h-4 mr-1" />
              Powered by advanced AI vision
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-8">
          <div className="border-2 border-dashed border-farmlink-lightgreen/30 rounded-2xl p-12 text-center bg-gradient-to-br from-farmlink-offwhite/30 to-farmlink-lightgreen/10 hover:from-farmlink-offwhite/50 hover:to-farmlink-lightgreen/20 transition-all duration-300">
            <div className="mx-auto flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-farmlink-green to-farmlink-mediumgreen rounded-2xl flex items-center justify-center">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-farmlink-darkgreen">Upload Plant Image</h3>
              <p className="text-farmlink-darkgreen/70 max-w-md">
                Take a clear photo of your plant showing any symptoms. Our AI will analyze it instantly and provide detailed diagnosis.
              </p>
              <Input
                id="picture"
                type="file"
                className="hidden"
                accept="image/*"
              />
              <Button className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 px-8 py-3">
                <Upload className="mr-2 h-5 w-5" />
                Select Plant Image
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="plant-type" className="text-farmlink-darkgreen font-semibold">Plant Type (Optional)</Label>
              <Input 
                id="plant-type" 
                placeholder="e.g., Tomato, Corn, Lettuce..." 
                className="bg-white/70 border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 text-farmlink-darkgreen"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="symptoms" className="text-farmlink-darkgreen font-semibold">Symptoms (Optional)</Label>
              <Input 
                id="symptoms" 
                placeholder="e.g., Yellow leaves, brown spots..." 
                className="bg-white/70 border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 text-farmlink-darkgreen"
              />
            </div>
          </div>
          
          <Button className="w-full bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <Sparkles className="mr-2 h-5 w-5" />
            Analyze Plant Health with AI
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiagnosticTool;