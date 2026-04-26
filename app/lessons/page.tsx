"use client";

import { useState } from "react";

const lessons = [
  {
    id: 1,
    title: "Lesson 1: Introduction",
    duration: "10 min",
    level: "Beginner",
    image: "https://via.placeholder.com/300",
    progress: 30,
  },
  {
    id: 2,
    title: "Lesson 2: Basics",
    duration: "15 min",
    level: "Medium",
    image: "https://via.placeholder.com/300",
    progress: 0,
  },
];

export default function LessonsPage() {
  const [search, setSearch] = useState("");

  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          الصف الخامس الابتدائي
        </h1>

        <input
          type="text"
          placeholder="Search lessons..."
          className="w-full p-3 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition"
          >
            {/* Image */}
            <img
              src={lesson.image}
              className="rounded-t-2xl w-full h-40 object-cover"
            />

            {/* Content */}
            <div className="p-4">
              <h2 className="font-semibold text-lg mb-2">
                {lesson.title}
              </h2>

              <p className="text-sm text-gray-500 mb-2">
                {lesson.duration} • {lesson.level}
              </p>

              {/* Progress */}
              {lesson.progress > 0 && (
                <div className="w-full bg-gray-200 h-2 rounded mb-3">
                  <div
                    className="bg-blue-500 h-2 rounded"
                    style={{ width: `${lesson.progress}%` }}
                  />
                </div>
              )}

              {/* Button */}
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                {lesson.progress > 0 ? "Continue" : "Start"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}