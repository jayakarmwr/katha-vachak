import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { History } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function StoryDisplay() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `http://localhost:3000/en/story-display/${id}`
        );
        setStory(response.data);
      } catch (error) {
        console.error("Error fetching story:", error.message);
        setError("Failed to load the story. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  const handleDownload = async () => {
    const input = document.getElementById("story-content");
    if (!input) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const canvas = await html2canvas(input, { scale: 2 });

    const imgData = canvas.toDataURL("image/png");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${story?.title || "story"}.pdf`);
  };

  if (loading) return <p>Loading story...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Download Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownload}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Download PDF
        </button>
      </div>

      {/* Story Header */}
      <div className="flex items-center space-x-4 mb-8">
        <History className="h-8 w-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-800">{story?.title}</h1>
      </div>

      {/* Story Content */}
      <div
        id="story-content"
        className="bg-white rounded-xl shadow-lg overflow-hidden p-6"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">{story?.genre}</h2>
        <p className="text-gray-700 whitespace-pre-line">
          {story?.generatedStory}
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {story?.images.map((image, i) => (
            <img
              key={i}
              src={`data:image/png;base64,${image}`}
              alt={`Story Image ${i + 1}`}
              className="w-full h-64 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default StoryDisplay;
