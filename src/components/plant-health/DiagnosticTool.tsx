
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Leaf, Upload, Sparkles, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface AnalysisResult {
  condition: string;
  confidence: number;
  severity: "low" | "medium" | "high";
  description: string;
  treatment: string;
}

const DiagnosticTool = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        setAnalysisResult(null);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Please select a valid image file.");
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error("Please upload an image first.");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis with a delay
    setTimeout(() => {
      // Mock analysis results - in a real app, this would call your AI service
      const mockResults: AnalysisResult[] = [
        {
          condition: "Healthy Plant",
          confidence: 95,
          severity: "low",
          description: "Your plant appears to be healthy with no visible signs of disease or stress.",
          treatment: "Continue with regular watering and ensure adequate sunlight. Monitor for any changes."
        },
        {
          condition: "Powdery Mildew",
          confidence: 87,
          severity: "medium",
          description: "White powdery spots detected on leaves, indicating a fungal infection.",
          treatment: "Remove affected leaves, improve air circulation, and apply fungicide spray."
        },
        {
          condition: "Nutrient Deficiency",
          confidence: 82,
          severity: "medium",
          description: "Yellowing leaves suggest possible nitrogen or iron deficiency.",
          treatment: "Apply balanced fertilizer and check soil pH. Consider adding compost."
        },
        {
          condition: "Bacterial Leaf Spot",
          confidence: 78,
          severity: "high",
          description: "Dark spots with yellow halos indicate bacterial infection.",
          treatment: "Remove infected leaves, avoid overhead watering, apply copper-based bactericide."
        }
      ];

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setAnalysisResult(randomResult);
      setIsAnalyzing(false);
      toast.success("Analysis complete!");
    }, 3000);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
  };

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
          {/* Image Upload Section */}
          <div className="border-2 border-dashed border-farmlink-lightgreen/30 rounded-2xl p-12 text-center bg-gradient-to-br from-farmlink-offwhite/30 to-farmlink-lightgreen/10 hover:from-farmlink-offwhite/50 hover:to-farmlink-lightgreen/20 transition-all duration-300">
            {imagePreview ? (
              <div className="space-y-4">
                <img 
                  src={imagePreview} 
                  alt="Plant preview" 
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                />
                <div className="flex gap-3 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={resetAnalysis}
                    className="border-farmlink-lightgreen/30 text-farmlink-darkgreen hover:bg-farmlink-lightgreen/10"
                  >
                    Upload Different Image
                  </Button>
                </div>
              </div>
            ) : (
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
                  onChange={handleImageUpload}
                />
                <Button 
                  className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 px-8 py-3"
                  onClick={() => document.getElementById('picture')?.click()}
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Select Plant Image
                </Button>
              </div>
            )}
          </div>
          
          {/* Analysis Button */}
          <Button 
            className="w-full bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAnalyze}
            disabled={!selectedImage || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing Plant Health...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Analyze Plant Health with AI
              </>
            )}
          </Button>

          {/* Analysis Results */}
          {analysisResult && (
            <div className="mt-8 p-6 bg-gradient-to-br from-farmlink-offwhite/50 to-farmlink-lightgreen/20 rounded-2xl border border-farmlink-lightgreen/30">
              <div className="flex items-center mb-4">
                {analysisResult.severity === "low" ? (
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-amber-600 mr-2" />
                )}
                <h3 className="text-xl font-bold text-farmlink-darkgreen">
                  Diagnosis: {analysisResult.condition}
                </h3>
                <span className="ml-auto text-sm font-medium text-farmlink-darkgreen bg-farmlink-lightgreen/30 px-3 py-1 rounded-full">
                  {analysisResult.confidence}% confidence
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-farmlink-darkgreen mb-2">Description:</h4>
                  <p className="text-farmlink-darkgreen/80">{analysisResult.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-farmlink-darkgreen mb-2">Recommended Treatment:</h4>
                  <p className="text-farmlink-darkgreen/80">{analysisResult.treatment}</p>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm font-medium text-farmlink-darkgreen mr-2">Severity:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    analysisResult.severity === "low" 
                      ? "bg-green-100 text-green-800"
                      : analysisResult.severity === "medium"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {analysisResult.severity.charAt(0).toUpperCase() + analysisResult.severity.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiagnosticTool;