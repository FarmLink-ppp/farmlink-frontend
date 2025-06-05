
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import DiagnosticTool from "@/components/plant-health/DiagnosticTool";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf } from "lucide-react";

const PlantHealth = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Leaf className="mr-2 h-7 w-7 text-farmlink-green" />
            Plant Health Diagnostics
          </h1>
          <p className="text-muted-foreground mt-1">
            Use AI-powered tools to diagnose and treat plant diseases
          </p>
        </div>

        <Tabs defaultValue="diagnose">
          <TabsList className="grid grid-cols-2 mb-6 w-full md:w-[400px]">
            <TabsTrigger value="diagnose">Diagnose</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="diagnose" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DiagnosticTool />
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-primary/10 rounded-full p-2 mr-3">
                        <span className="font-semibold">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Upload a Photo</p>
                        <p className="text-sm text-muted-foreground">
                          Take a clear photo of the affected plant part (leaves, stems, etc.)
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 rounded-full p-2 mr-3">
                        <span className="font-semibold">2</span>
                      </div>
                      <div>
                        <p className="font-medium">AI Analysis</p>
                        <p className="text-sm text-muted-foreground">
                          Our AI examines the image to identify disease patterns
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 rounded-full p-2 mr-3">
                        <span className="font-semibold">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Get Solutions</p>
                        <p className="text-sm text-muted-foreground">
                          Receive diagnosis and customized treatment recommendations
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Tips for Better Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">• Take photos in good natural lighting</p>
                    <p className="text-sm">• Focus clearly on the affected area</p>
                    <p className="text-sm">• Include both healthy and affected parts for comparison</p>
                    <p className="text-sm">• Take multiple photos from different angles</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Diagnostic History</CardTitle>
                <CardDescription>Your recent plant diagnostics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: "Apr 26, 2025", plant: "Tomato", condition: "Powdery Mildew", status: "Resolved" },
                    { date: "Apr 22, 2025", plant: "Cucumber", condition: "Bacterial Wilt", status: "In Treatment" },
                    { date: "Apr 18, 2025", plant: "Corn", condition: "Healthy", status: "N/A" },
                    { date: "Apr 10, 2025", plant: "Apple Tree", condition: "Fire Blight", status: "Resolved" },
                  ].map((record, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium">{record.plant} - {record.condition}</p>
                        <p className="text-xs text-muted-foreground">{record.date}</p>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        record.status === "Resolved" 
                          ? "bg-green-100 text-green-800" 
                          : record.status === "In Treatment"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {record.status}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
       
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PlantHealth;
