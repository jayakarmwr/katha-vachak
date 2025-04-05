import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { History, Calendar, Trash2 } from "lucide-react";

function StoryHistory() {
  const [email, setEmail] = useState("");
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Load email from session storage on component mount
  useEffect(() => {
    const storedData = sessionStorage.getItem("user");
    if (storedData) {
      const userData = JSON.parse(storedData);
      setEmail(userData.email);
    }
  }, []);

  // Fetch user stories
  useEffect(() => {
    if (!email) return;

    const fetchStories = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get("http://localhost:3000/en/save-history", {
          params: { email_id: email },
        });

        if (Array.isArray(response.data) && response.data.length > 0) {
          setStories(response.data);
        } else {
          setStories([]);
        }
      } catch (error) {
        console.error("Error fetching stories:", error.message);
        setError("Failed to load story history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [email]);

  const handleStoryClick = (id) => {
    navigate(`/story-display/${id}`);
  };

  const handleDeleteStory = async(id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this story?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/en/delete-story/${id}`);
      setStories((prevStories) => prevStories.filter((story) => story._id !== id));
    } catch (error) {
      console.error("Error deleting story:", error.message);
      alert("Failed to delete the story. Please try again later.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <History className="h-8 w-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-800">Story History</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          {loading && <p>Loading your stories...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {stories.length === 0 && !loading && !error && (
            <p className="text-gray-600">No stories found. Start creating your stories!</p>
          )}

          <div className="space-y-6">
            {stories.map((story) => (
              <div
                key={story._id}
                className="flex justify-between items-center border-b border-gray-200 pb-6 last:border-0 last:pb-0 hover:bg-gray-50 transition px-2 rounded-md"
              >
                <div className="cursor-pointer" onClick={() => handleStoryClick(story._id)}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {story.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{story.genre}</span>
                  </div>
                </div>

                <button
                  className="text-red-500 hover:text-red-700 p-2"
                  onClick={() => handleDeleteStory(story._id)}
                  title="Delete story"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryHistory;