import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa"; // Import FontAwesome star icon

function CreateStory() {
  const [email, setEmail] = useState("");
  const [story, setStory] = useState({ genre: "", title: "", plot: "" });
  const [generatedStory, setGeneratedStory] = useState("");
  const [images, setImages] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [storyError, setStoryError] = useState("");
  const [imageError, setImageError] = useState("");
  const [isStarred, setIsStarred] = useState(false);
  const [reading, setReading] = useState(false);
  const [Title,setTile]=useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedData = sessionStorage.getItem("user");
    if (storedData) {
      const userData = JSON.parse(storedData);
      setEmail(userData.email);
    }
  }, []);

  const handleLikedStories = async () => {
    try {
      await axios.post("http://localhost:3000/en/setlike", {
        email,
        title: Title,
      });
      setIsStarred(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStoryError("");
    setImageError("");

    try {
      const response = await axios.post(
        "https://115c-34-125-149-83.ngrok-free.app/story",
        story,
        { headers: { "Content-Type": "application/json" }, timeout: 300000 }
      );

      if (!response.data.story) throw new Error("Failed to generate story.");
      console.log(response.data);
      setGeneratedStory(response.data.story);
      const prompts = response.data.prompts;
      setPrompts(prompts);

      if (!response.data.prompts || response.data.prompts.length === 0) {
        throw new Error("No prompts returned for image generation.");
      }

      const imageResponse = await axios.post(
        "http://127.0.0.1:5000/generate-images",
        { prompts },
        { headers: { "Content-Type": "application/json" } }
      );

      setImages(imageResponse.data.images || []);
      console.log(images)
      if (!imageResponse.data.images) throw new Error("No images generated.");
      const titleMatch = response.data.story.match(/^Title:\s*(.+)$/m);
      const title = titleMatch ? titleMatch[1] : "Untitled";
      setTile(title);

      const saveData = {
        ...story,
        genre: story.genre,
        title,
        generatedStory: response.data.story,
        email_id: email,
        images: imageResponse.data.images,
      };

      await axios.post("http://localhost:3000/en/save-story", saveData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Story and images saved successfully!");
    } catch (error) {
      console.error("Error:", error.message);
      if (error.message.includes("story")) {
        setStoryError("Failed to generate the story. Please try again.");
      } else if (error.message.includes("image")) {
        setImageError("Failed to generate images. Please try again.");
      } else {
        setStoryError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStoryWithImages = () => {
    const storySegments = generatedStory.split("\n\n").filter((seg) => seg.trim() !== ""); // Split into paragraphs, ignoring empty lines
    const totalSegments = storySegments.length;
    const totalImages = images.length; // Use the actual length of images
    const interval = Math.ceil(totalSegments / totalImages);
    console.log(totalImages)
    const content = [];
    let imageIndex=""
    storySegments.forEach((segment, index) => {
      // Add story text
      content.push(
        <p key={`story-segment-${index}`} className="text-gray-700 whitespace-pre-line mb-4">
          {segment}
        </p>
      );
  
      // Add image when necessary
      imageIndex = Math.floor(index / interval);
      if (imageIndex < totalImages && (index + 1) % interval === 0) {
        content.push(
          <div
            key={`image-${imageIndex}`}
            className="flex justify-center items-center mb-4"
          >
            <img
              src={`data:image/png;base64,${images[imageIndex]}`}
              alt={`Generated Story Image ${imageIndex + 1}`}
              className="max-w-full max-h-72 object-contain rounded-lg shadow-md"
            />
            {console.log(imageIndex+"-")}
          </div>
        );
      }
    });
  
    // Append any remaining images if they weren't displayed
    for (let i = imageIndex; i < totalImages; i++) {
      {console.log(i)}
      // if(i==2) continue;
      content.push(
        <div
          key={`extra-image-${i}`}
          className="flex justify-center items-center mb-4"
        > 
          <img
            src={`data:image/png;base64,${images[i]}`}
            alt={`Generated Story Image ${i + 1}`}
            className="max-w-full max-h-72 object-contain rounded-lg shadow-md"
          />
        </div>
      );
    }
  
    return content;
  };
  

  const handleReadStory = () => {
    if (!generatedStory) return;

    const utterance = new SpeechSynthesisUtterance(generatedStory);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.onstart = () => setReading(true);
    utterance.onend = () => setReading(false);
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (reading) {
      window.speechSynthesis.pause();
      setReading(false);
    }
  };

  const handlePlay = () => {
    if (!reading) {
      window.speechSynthesis.resume();
      setReading(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Create Your Story</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genre
            </label>
            <input
              type="text"
              value={story.genre}
              onChange={(e) => setStory({ ...story, genre: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter the genre of your story"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Story Title
            </label>
            <input
              type="text"
              value={story.title}
              onChange={(e) => setStory({ ...story, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your story title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Story Plot
            </label>
            <textarea
              value={story.plot}
              onChange={(e) => setStory({ ...story, plot: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Describe your story plot"
              rows={4}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center space-x-2 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white py-3 px-6 rounded-lg transition duration-200`}
            >
              <span>{loading ? "Generating..." : "Generate Story"}</span>
            </button>
          </div>
        </form>

        {generatedStory && (
          <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-md relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Generated Story</h2>
            {renderStoryWithImages()}
            <button
              onClick={handleLikedStories}
              className="absolute top-4 right-4"
            >
              <FaStar
                size={24}
                className={isStarred ? "text-yellow-400" : "text-gray-400"}
              />
            </button>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={handleReadStory}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Read Story
              </button>
              <button
                onClick={handlePause}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg"
              >
                Pause
              </button>
              <button
                onClick={handlePlay}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
              >
                Play
              </button>
            </div>
          </div>
        )}

        {storyError && <p className="text-red-500 mt-4">{storyError}</p>}

        {imageError && <p className="text-red-500 mt-4">{imageError}</p>}
      </div>
    </div>
  );
}

export default CreateStory;