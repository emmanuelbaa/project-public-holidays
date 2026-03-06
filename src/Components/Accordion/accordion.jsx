import data from "./data";
import { FaGithub, FaSearch } from "react-icons/fa";
import { useState } from "react";

export default function Accordion() {
  const [isMultiple, setIsMultiple] = useState(false);
  const [selected, setSelected] = useState([]);

  function handleSelections(index) {
    if (isMultiple) {
      setSelected((previousSelection) =>
        previousSelection.includes(index)
          ? previousSelection.filter((item) => item != index)
          : [...previousSelection, index],
      );
    } else {
      setSelected((previousSelection) =>
        previousSelection[0] === index ? [] : [index],
      );
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
 <h1 className="text-center text-4xl md:text-5xl font-extrabold tracking-tight mb-7 pt-8">
  Project Accordion
  <span className="block text-lg md:text-xl font-medium text-gray-500 mt-2">
    GitHub-Style FAQ Interface
  </span>
</h1>
      {/* Navbar */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-center justify-between py-4 gap-6">
          
          <span className="flex items-center gap-2 text-lg font-bold">
            <FaGithub className="text-3xl" />
            <span className="text-gray-400">/</span>
            <span className="text-2xl">Resources</span>
          </span>

          <ul className="flex gap-8 font-semibold text-gray-600 text-sm md:text-base">
            <li className="hover:text-black cursor-pointer transition">Why GitHub</li>
            <li className="hover:text-black cursor-pointer transition">Topics</li>
            <li className="hover:text-black cursor-pointer transition">Learn</li>
            <li className="hover:text-black cursor-pointer transition">Events & Webinars</li>
          </ul>

          <div className="flex items-center gap-4">
            <FaSearch className="text-xl text-gray-500 hover:text-black cursor-pointer transition" />

            <button className="bg-black text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-gray-800 transition shadow-sm">
              Enterprise trial
            </button>

            <button className="border border-gray-300 bg-white text-black text-sm font-semibold px-5 py-2 rounded-lg hover:bg-gray-100 transition shadow-sm">
              Contact Sales
            </button>
          </div>
        </div>

        <div className="h-px w-full bg-gray-200"></div>
      </div>

      {/* Accordion Section */}
      <div className="flex justify-center px-4 mt-10">
        <div className="w-full max-w-4xl px-6 py-8 bg-white rounded-xl shadow-sm border border-gray-100">

          {/* Toggle Button */}
          <button
            className="mb-8 bg-green-800 hover:bg-green-700 transition text-white text-sm font-semibold px-4 py-2 rounded-lg shadow"
            onClick={() => setIsMultiple((yes) => !yes)}
          >
            {isMultiple ? "MultipleSelection: ON" : "SingleSelection: ON"}
          </button>

          {data.map((item, index) => (
            <article
              key={item.title}
              className="py-6 border-b last:border-none border-gray-200 transition"
            >
              <div className="flex items-start justify-between gap-4 w-full">
                
                <h2
                  onClick={() => handleSelections(index)}
                  className="text-lg md:text-xl font-semibold leading-tight cursor-pointer hover:text-green-700 transition"
                >
                  {item.title}
                </h2>

                <button
                  onClick={() => handleSelections(index)}
                  className="shrink-0 text-xl font-bold leading-none text-green-700 hover:text-green-900 transition"
                >
                  {selected.includes(index) ? "-" : "+"}
                </button>

              </div>

              {selected.includes(index) && (
                <p className="mt-4 text-gray-600 leading-relaxed text-sm md:text-base">
                  {item.content}
                </p>
              )}

              <div className="mt-3 text-base leading-7 text-gray-600"></div>
            </article>
          ))}

        </div>
      </div>
    </div>
  );
}