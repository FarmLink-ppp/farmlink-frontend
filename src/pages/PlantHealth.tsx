import MainLayout from "@/components/layout/MainLayout";
import DiagnosticTool from "@/components/plant-health/DiagnosticTool";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api";
import { ScanWithDiagnosis } from "@/types";
import { Leaf, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PlantHealth = () => {
  const [history, setHistory] = useState<ScanWithDiagnosis[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("diagnose");

  useEffect(() => {
    if (activeTab === "history") {
      const fetchScansWithDiagnosis = async () => {
        setLoading(true);
        try {
          const response = await apiClient.getAllDiagnosis();
          setHistory(response);
        } catch (error) {
          console.error("Failed to fetch diagnosis history:", error);
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to fetch diagnosis history"
          );
        } finally {
          setLoading(false);
        }
      };
      fetchScansWithDiagnosis();
    }
  }, [activeTab]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </MainLayout>
    );
  }

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

        <Tabs
          defaultValue="diagnose"
          value={activeTab}
          onValueChange={setActiveTab}
        >
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
                          Take a clear photo of the affected plant part (leaves,
                          stems, etc.)
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
                          Receive diagnosis and customized treatment
                          recommendations
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
                    <p className="text-sm">
                      • Take photos in good natural lighting
                    </p>
                    <p className="text-sm">
                      • Focus clearly on the affected area
                    </p>
                    <p className="text-sm">
                      • Include both healthy and affected parts for comparison
                    </p>
                    <p className="text-sm">
                      • Take multiple photos from different angles
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Diagnosis History</CardTitle>
                  <CardDescription>
                    Scans with completed AI diagnosis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-muted-foreground">
                        Loading diagnosis...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {history.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                          No diagnosis found yet.
                        </p>
                      ) : (
                        history.map((item, index) => (
                          <div
                            key={index}
                            className="p-4 bg-secondary rounded-lg space-y-3"
                          >
                            <div className="flex items-start space-x-3">
                              <img
                                src={item.image_url}
                                alt="Plant diagnosis"
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                {item.diagnostic ? (
                                  <>
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium truncate">
                                        {item.diagnostic.disease_name}
                                      </p>
                                      <div
                                        className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                                          item.diagnostic.issue_detected
                                            ? item.diagnostic.confidence_score >
                                              0.8
                                              ? "bg-red-100 text-red-800"
                                              : "bg-yellow-100 text-yellow-800"
                                            : "bg-green-100 text-green-800"
                                        }`}
                                      >
                                        {item.diagnostic.issue_detected
                                          ? `${Math.round(
                                              item.diagnostic.confidence_score *
                                                100
                                            )}% confidence`
                                          : "Healthy"}
                                      </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {item.diagnostic.description}
                                    </p>
                                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                                      <Calendar className="w-3 h-3 mr-1" />
                                      {formatDate(item.diagnostic.created_at)}
                                    </div>
                                  </>
                                ) : (
                                  <p className="text-muted-foreground">
                                    Diagnosis pending...
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PlantHealth;
